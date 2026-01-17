# 🎥 FB Downloader

A full-stack web application to download Facebook videos in high quality (HD/SD) with audio. This tool utilizes a **Node.js/Express** backend to handle complex stream merging and a **Vite/Vanilla JS** frontend for a clean user interface.

## ✨ Features

* **Video Info Extraction:** Automatically fetches video thumbnails, titles, and available resolutions.
* **Quality Selection:** Users can choose specific resolutions (1080p, 720p, 480p, etc.).
* **Audio/Video Merging:** Uses **FFmpeg** on the server to ensure high-quality video is merged with audio (fixing the common "silent video" issue).
* **No CORS Issues:** Proxies requests through a local backend server.
* **Clean UI:** Built with Vite and modern CSS.
* **Youtube Support:** Can downloaded video & short.

---

## ⚙️ Prerequisites

Before running this project, you must install the necessary binaries. The application relies on `yt-dlp` for downloading and `ffmpeg` for merging streams.

### 1. Download Binaries

You need to download two executable files and place them in the `server/bin/` folder.

1. **yt-dlp:**
    * Download the latest release from [GitHub Releases](https://github.com/yt-dlp/yt-dlp/releases).
    * *Windows:* Download `yt-dlp.exe`.
    * *Linux/Mac:* Download `yt-dlp` (binary).


2. **FFmpeg:**
    * Download from the [Official FFmpeg Site](https://ffmpeg.org/download.html).
    * Extract the zip file and find `ffmpeg.exe` (or `ffmpeg` binary) inside the `bin` folder.



### 2. File Placement

Ensure your directory structure looks **exactly** like this:

```text
locally-fb-video-downloader/
└── server/
    └── bin/
        ├── yt-dlp.exe    <-- Required
        └── ffmpeg.exe    <-- Required

```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Id-Yuu/locally-fb-video-downloader.git
cd locally-fb-video-downloader

```

### 2. Install Backend Dependencies

```bash
cd server
npm install

```

### 3. Install Frontend Dependencies

Open a new terminal window (or return to root):

```bash
cd ../client
npm install

```

---

## 🛠️ Execution

You need to run the **Backend** and **Frontend** simultaneously in two separate terminal windows.

### Terminal 1: Start Backend Server

This handles the downloading and processing logic.

```bash
cd server
npm start

```

*Output should see:* `✅ Server running on http://localhost:3000`

### Terminal 2: Start Frontend Client

This launches the user interface.

```bash
cd client
npm run dev

```

*Output should see:* `➜  Local:   http://localhost:5173/`

### Usage

1. Open your browser to `http://localhost:5173`.
2. Paste a **public** Facebook video URL (e.g., from the Watch tab).
3. Click **Check Video** to see available qualities.
4. Select a quality and click **Download MP4**.

---

## 📂 Project Structure

```text
locally-fb-video-downloader/
├── client/                 # Frontend (Vite + Vanilla JS)
│   ├── index.html          # Main HTML entry
│   ├── main.js             # UI Logic & API calls
│   └── vite.config.js      # Proxy configuration (Port 5173 -> 3000)
│
└── server/                 # Backend (Node.js + Express)
    ├── bin/                # External binaries (NOT included in git)
    │   ├── ffmpeg.exe
    │   └── yt-dlp.exe
    ├── temp/               # Temporary download folder (auto-created)
    └── index.js            # Server logic (API & Spawning processes)

```

---

## ⚠️ Troubleshooting

**1. "Failed to start yt-dlp" or "Spawn Error"**

* Ensure `yt-dlp.exe` is inside `server/bin/`.
* Ensure you have read/write permissions for that folder.

**2. "Server returned HTML" or "Unexpected token <"**

* This usually means the frontend cannot talk to the backend.
* Ensure the **Server Terminal** is running.
* Restart the **Frontend Terminal** to ensure `vite.config.js` proxy settings are loaded.

**3. Download fails instantly**

* The video might be **Private**. This tool only works with Public videos.
* You might be missing `ffmpeg.exe`. Without it, high-quality streams cannot be merged.

---

## ⚖️ Disclaimer

This project is for **educational purposes only**.

* Do not download content you do not own or have permission to use.
* Respect the privacy and Terms of Service of the platforms you interact with.
* The developers of this repository are not responsible for any misuse of this tool.


