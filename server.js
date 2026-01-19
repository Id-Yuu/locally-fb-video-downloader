import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules (needed because package.json uses "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const binPath = path.join(__dirname, 'bin');
const ytDlpExe = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpPath = path.join(binPath, ytDlpExe);
const tempDir = path.join(__dirname, 'temp');

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// ===========================
// 1. API ROUTES
// ===========================

app.get('/info', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'URL required' });

    console.log(`🔍 Fetching Info: ${videoUrl}`);
    const process = spawn(ytDlpPath, ['-J', videoUrl]);
    let dataBuffer = '';

    process.stdout.on('data', (data) => dataBuffer += data.toString());
    
    process.on('close', (code) => {
        if (code !== 0) return res.status(500).json({ error: 'Failed to fetch info' });
        try {
            const json = JSON.parse(dataBuffer);
            const formats = json.formats || [];
            const heights = formats.filter(f => f.vcodec !== 'none' && f.height).map(f => f.height);
            const uniqueHeights = [...new Set(heights)].sort((a, b) => b - a);

            res.json({
                title: json.title || 'Facebook Video',
                thumbnail: json.thumbnail || '',
                qualities: uniqueHeights
            });
        } catch (e) {
            res.status(500).json({ error: 'Error parsing metadata' });
        }
    });
});

app.get('/download', (req, res) => {
    const { url, quality, title } = req.query;
    if (!url) return res.status(400).send('URL required');

    console.log(`⬇️ Downloading: ${title}`);
    const tempFilename = `temp_${Date.now()}.mp4`;
    const tempFilePath = path.join(tempDir, tempFilename);

    const formatString = quality 
        ? `bestvideo[height=${quality}]+bestaudio/best[height=${quality}]/best` 
        : 'bestvideo+bestaudio/best';

    const ytDlp = spawn(ytDlpPath, [
        '-f', formatString,
        '--merge-output-format', 'mp4',
        '-o', tempFilePath,
        '--ffmpeg-location', binPath,
        url
    ]);

    ytDlp.on('close', (code) => {
        if (code !== 0 || !fs.existsSync(tempFilePath)) {
            return res.status(500).send('Download failed.');
        }

        const safeTitle = (title || 'video').replace(/[<>:"/\\|?*]+/g, '_').trim();
        res.download(tempFilePath, `${safeTitle}.mp4`, (err) => {
            fs.unlink(tempFilePath, () => {}); // Cleanup
        });
    });
});

// ===========================
// 2. SERVE FRONTEND (STATIC)
// ===========================

// Serve files from the 'dist' folder (created by Vite build)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback: Send index.html for any other request (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ App running on http://localhost:${PORT}`);
});