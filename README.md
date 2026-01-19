# 🎥 FB Downloader

A robust, full-stack web application to download Facebook videos in high quality (HD/SD) with audio. This version features a **Single-Folder Architecture** for easy deployment, combining a **Vite** frontend and **Express** backend into one cohesive unit.

## ✨ New Features

* **Unified Architecture:** Frontend and Backend live in one folder. No need to run two separate terminals.
* **Dark Mode:** Integrated theme toggle with persistent storage (remembers user preference).
* **Smart Filenames:** Downloads files using the original video title (sanitized for OS compatibility).
* **Audio Merge:** Uses FFmpeg to ensure high-quality video streams have sound.
* **Single Command Run:** One command to build and start the entire app.
* **Youtube Support**: Can downloaded video & short.

---

## ⚙️ Prerequisites

You must have **Node.js** installed. Additionally, this app relies on two external binaries to handle media processing.

### 1. Download Binaries

Create a folder named `bin` in the root directory and place these files inside:

1. **yt-dlp:**
   * Download from [GitHub Releases](https://github.com/yt-dlp/yt-dlp/releases).
   * *Windows:* `yt-dlp.exe`
   * *Linux/Mac:* `yt-dlp` (ensure it is executable: `chmod +x yt-dlp`)


2. **FFmpeg:**
   * Download from [FFmpeg.org](https://ffmpeg.org/download.html).
   * Extract and find the `ffmpeg` executable (or `ffmpeg.exe` on Windows).



---

## 🚀 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Id-Yuu/locally-fb-video-downloader.git
   cd locally-fb-video-downloader
   ```


2. **Install Dependencies**

   This installs libraries for both the server (Express) and client (Vite).
   ```bash
   npm install
   ```


4. **Verify Structure**

   Ensure your folder looks like this:
   ```text
   locally-fb-video-downloader/
   ├── bin/
   │   ├── ffmpeg.exe
   │   └── yt-dlp.exe
   ├── src/
   │   └── main.js
   ├── index.html
   ├── server.js
   └── package.json
   ```


---

## 🛠️ Usage

### A. Development Mode (Coding)

This runs the Backend server and the Vite Frontend server simultaneously with hot-reload.

```bash
npm run dev

```

* **Access:** `http://localhost:5173`

### B. Production Mode (Deployment)

This compiles the frontend into static files (`dist/`) and serves them via the Node.js backend.

```bash
npm run build
npm start

```

* **Access:** `http://localhost:3000`

---

## 📂 Project Structure

```text
locally-fb-video-downloader/
├── bin/                  # ⚠️ Binaries (yt-dlp & ffmpeg) go here
├── dist/                 # Production build (auto-created)
├── src/                  # Frontend Logic
│   └── main.js           # UI & Theme Logic
├── temp/                 # Temporary downloads (auto-created)
├── index.html            # Main Entry Point
├── package.json          # Unified dependencies & scripts
├── server.js             # Backend API + Static File Server
└── vite.config.js        # Build configuration & Proxy settings

```

---

## ⚠️ Troubleshooting

**1. "Spawn Error" or "Command not found"**

* Ensure `bin/yt-dlp.exe` and `bin/ffmpeg.exe` exist.
* If on Linux/Mac, ensure you downloaded the correct binary (not .exe) and gave it permission (`chmod +x`).

**2. Video has no audio**

* This usually means `ffmpeg` was not found. The server logs will show `[yt-dlp] WARNING: You have requested merging of formats but ffmpeg is not installed`.
* Verify `ffmpeg.exe` is in the `bin` folder.

**3. "Server returned HTML" Error**


* This happens if the backend crashes or isn't running. Check your terminal for error logs.


