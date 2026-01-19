const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const urlInput = document.getElementById('urlInput');
const getInfoBtn = document.getElementById('getInfoBtn');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');
const qualitySelect = document.getElementById('qualitySelect');
const thumb = document.getElementById('thumb');
const videoTitle = document.getElementById('videoTitle');
const statusText = document.getElementById('statusText');

let currentUrl = '';
let currentTitle = '';

// ETCH METADATA
getInfoBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return setStatus('⚠️ Please enter a URL', 'red');

    currentUrl = url;
    setStatus('<div class="loader"></div> Searching video...', 'black');
    getInfoBtn.disabled = true;

    try {
        const res = await fetch(`/info?url=${encodeURIComponent(url)}`);
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Server HTML Error:", text);
            throw new Error("Server returned HTML. Check console.");
        }

        if (data.error) throw new Error(data.error);
        currentTitle = data.title; 
        videoTitle.innerText = currentTitle;
        thumb.src = data.thumbnail;
        
        qualitySelect.innerHTML = '';
        if (data.qualities && data.qualities.length) {
            data.qualities.forEach(q => {
                const opt = document.createElement('option');
                opt.value = q;
                opt.innerText = `${q}p Quality`;
                qualitySelect.appendChild(opt);
            });
        } else {
            const opt = document.createElement('option');
            opt.value = '';
            opt.innerText = 'Best Available';
            qualitySelect.appendChild(opt);
        }

        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        setStatus('');

    } catch (err) {
        setStatus('❌ ' + err.message, 'red');
    } finally {
        getInfoBtn.disabled = false;
    }
});

// DOWNLOAD FILE
downloadBtn.addEventListener('click', () => {
    const quality = qualitySelect.value;
    
    setStatus('⏳ Processing on Server... Please wait.', '#1877f2');
    downloadBtn.disabled = true;
    downloadBtn.innerText = "Processing...";

    const downloadUrl = `/download?url=${encodeURIComponent(currentUrl)}&quality=${quality}&title=${encodeURIComponent(currentTitle)}`;
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = downloadUrl;
    document.body.appendChild(iframe);

    setTimeout(() => {
        setStatus('✅ Download started! Check your downloads folder.', 'green');
        downloadBtn.disabled = false;
        downloadBtn.innerText = "Download MP4";
        setTimeout(() => document.body.removeChild(iframe), 60000);
    }, 4000);
});

backBtn.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    setStatus('');
    urlInput.value = '';
    currentUrl = '';
    currentTitle = '';
});

function setStatus(msg, color) {
    statusText.innerHTML = msg;
    statusText.style.color = color || 'black';
}

// THEME
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerText = '☀️';
}
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerText = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerText = '🌙';
    }
});