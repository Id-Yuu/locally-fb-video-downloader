const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const binPath = path.join(__dirname, 'bin');
// Detect OS to choose correct binary name
const ytDlpExe = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpPath = path.join(binPath, ytDlpExe);
const tempDir = path.join(__dirname, 'temp');

// Create temp folder if it doesn't exist
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// --- ROUTE 1: GET VIDEO INFO ---
app.get('/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    console.log(`🔍 Fetching Info: ${videoUrl}`);

    // -J dumps JSON metadata
    const process = spawn(ytDlpPath, ['-J', videoUrl]);
    let dataBuffer = '';

    process.stdout.on('data', (data) => dataBuffer += data.toString());
    
    process.on('close', (code) => {
        if (code !== 0) return res.status(500).json({ error: 'Failed to fetch video info. Is the link public?' });
        try {
            const json = JSON.parse(dataBuffer);
            
            // Extract resolutions
            const formats = json.formats || [];
            const heights = formats
                .filter(f => f.vcodec !== 'none' && f.height) // Must be video
                .map(f => f.height);
            
            // Sort unique heights (e.g., [1080, 720, 360])
            const uniqueHeights = [...new Set(heights)].sort((a, b) => b - a);

            res.json({
                title: json.title || 'Facebook Video',
                thumbnail: json.thumbnail || '',
                qualities: uniqueHeights
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error parsing video metadata' });
        }
    });
});

// --- ROUTE 2: DOWNLOAD & MERGE ---
app.get('/download', (req, res) => {
    const { url, quality } = req.query;
    if (!url) return res.status(400).send('URL required');

    console.log(`⬇️ Starting download (${quality}p)...`);

    // 1. Prepare Paths
    const filename = `fb_vid_${Date.now()}.mp4`;
    const filePath = path.join(tempDir, filename);

    // 2. Build Format String
    // Logic: "Best Video at specific height + Best Audio" OR "Best Combo available"
    const formatString = quality 
        ? `bestvideo[height=${quality}]+bestaudio/best[height=${quality}]/best` 
        : 'bestvideo+bestaudio/best';

    // 3. Spawn yt-dlp
    const ytDlp = spawn(ytDlpPath, [
        '-f', formatString,             // Select quality
        '--merge-output-format', 'mp4', // Force merge to MP4
        '-o', filePath,                 // Save to temp folder first
        '--ffmpeg-location', binPath,   // Point to local ffmpeg
        url
    ]);

    // Log progress
    ytDlp.stderr.on('data', (data) => console.log(`[yt-dlp] ${data}`));

    ytDlp.on('close', (code) => {
        if (code !== 0) {
            console.error('❌ Download failed.');
            return res.status(500).send('Download failed on server.');
        }

        console.log('✅ Merge complete. Sending file to user...');

        // 4. Send File to Browser
        if (fs.existsSync(filePath)) {
            res.download(filePath, `facebook_video_${quality || 'best'}.mp4`, (err) => {
                // 5. Cleanup: Delete temp file after sending
                fs.unlink(filePath, (e) => {
                    if (!e) console.log('🗑️ Temp file deleted.');
                });
            });
        } else {
            res.status(500).send('File missing after download.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📂 Bin folder: ${binPath}`);
});