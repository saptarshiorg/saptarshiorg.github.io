// EV Streams — Desktop app
// Electron port of the Android WebView shell (see android-app/README.md).
// Ports: native CORS/CSP/X-Frame-Options bypass, mixed-content + self-signed
// cert tolerance, and VLC hand-off for raw stream links. No ad blocker —
// popups and ad redirects open in a new app window instead of being blocked.

const { app, BrowserWindow, session, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SITE_URL = 'https://evstreams.pages.dev/';
const SITE_HOST = new URL(SITE_URL).host;
const STREAM_EXTENSIONS = ['.m3u8', '.mpd', '.ts', '.mkv', '.mp4', '.flv', '.key', '.m4s', '.vtt'];
function isStreamUrl(url) {
  try {
    const p = new URL(url).pathname.toLowerCase();
    return STREAM_EXTENSIONS.some((ext) => p.endsWith(ext));
  } catch (e) { return false; }
}

const STRIP_RESPONSE_HEADERS = new Set([
  'x-frame-options', 'content-security-policy', 'content-security-policy-report-only',
  'access-control-allow-origin', 'access-control-allow-credentials',
  'access-control-allow-methods', 'access-control-allow-headers',
  'cross-origin-resource-policy', 'cross-origin-embedder-policy', 'cross-origin-opener-policy'
]);

let mainWindow = null;

// ---------------------------------------------------------------------------
// VLC hand-off — mirrors openInVlcOrChooser(): try VLC directly by platform-
// typical binary name/path, then fall back to the OS default handler (the
// desktop equivalent of Android's chooser), then a dialog if nothing works.
// ---------------------------------------------------------------------------
function vlcCandidates() {
  if (process.platform === 'win32') {
    return [
      'C\\:\\Program Files\\VideoLAN\\VLC\\vlc.exe'.replace(/\\:/g, ':'),
      'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe',
      'vlc'
    ];
  }
  if (process.platform === 'darwin') {
    return ['/Applications/VLC.app/Contents/MacOS/VLC', 'vlc'];
  }
  return ['vlc', '/usr/bin/vlc', '/snap/bin/vlc'];
}

function openInVlcOrChooser(url) {
  const candidates = vlcCandidates();
  const tryNext = (i) => {
    if (i >= candidates.length) {
      // No VLC found — fall back to the OS default handler for the URL,
      // same role as Android's Intent.createChooser fallback.
      shell.openExternal(url).catch(() => {
        dialog.showMessageBox(mainWindow, {
          type: 'warning',
          message: 'No video player found — install VLC to play this stream externally.'
        });
      });
      return;
    }
    const bin = candidates[i];
    const child = spawn(bin, [url], { detached: true, stdio: 'ignore' });
    child.on('error', () => tryNext(i + 1));
    child.unref();
  };
  tryNext(0);
}

// ---------------------------------------------------------------------------
// Window / session setup
// ---------------------------------------------------------------------------
function setupSession(ses) {
  // The real CORS/CSP/X-Frame-Options bypass: strip origin-restricting
  // response headers and add fully permissive ones back, on every
  // sub-resource response (stream segments, iframe embeds, JW Player/
  // Video.js API/config calls). This is the same trust model VLC/OkHttp
  // use — no browser-enforced Origin/CSP/X-Frame-Options concept.
  ses.webRequest.onHeadersReceived((details, callback) => {
    const headers = details.responseHeaders || {};
    const cleaned = {};
    for (const [name, value] of Object.entries(headers)) {
      if (!STRIP_RESPONSE_HEADERS.has(name.toLowerCase())) {
        cleaned[name] = value;
      }
    }
    cleaned['Access-Control-Allow-Origin'] = ['*'];
    cleaned['Access-Control-Allow-Methods'] = ['GET, HEAD, OPTIONS'];
    cleaned['Access-Control-Allow-Headers'] = ['*'];
    cleaned['Access-Control-Allow-Credentials'] = ['true'];
    callback({ responseHeaders: cleaned });
  });

  // Mixed content (http streams on an https page) and self-signed/bad certs —
  // many stream hosts serve these; proceed anyway, same as a native player.
  ses.setCertificateVerifyProc((request, callback) => callback(0));
}


const STRIP_META_CSP_JS = `
(function(){
  try {
    document.querySelectorAll('meta[http-equiv]').forEach(function(m){
      if (/content-security-policy/i.test(m.getAttribute('http-equiv') || '')) m.remove();
    });
  } catch (e) {}
})();
`;

function stripMetaCspEverywhere(wc) {
  try {
    for (const frame of wc.mainFrame.framesInSubtree) {
      frame.executeJavaScript(STRIP_META_CSP_JS).catch(() => {});
    }
  } catch (e) {}
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'EV Streams',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,               // needed for cross-origin embed/API calls, mirrors NativeProxy
      allowRunningInsecureContent: true, // mixed http/https content, mirrors MIXED_CONTENT_ALWAYS_ALLOW
      autoplayPolicy: 'no-user-gesture-required'
    }
  });

  setupSession(mainWindow.webContents.session);
  mainWindow.webContents.on('dom-ready', () => stripMetaCspEverywhere(mainWindow.webContents));
  mainWindow.webContents.on('did-frame-navigate', () => stripMetaCspEverywhere(mainWindow.webContents));

  // Fullscreen playback for <video> and iframe-embedded players.
  mainWindow.webContents.on('enter-html-full-screen', () => mainWindow.setFullScreen(true));
  mainWindow.webContents.on('leave-html-full-screen', () => mainWindow.setFullScreen(false));

  // Direct stream links (not opened inside an iframe player) get handed
  // straight to VLC — mirrors
  // shouldOverrideUrlLoading().
  const maybeIntercept = (event, url) => {
    let u;
    try { u = new URL(url); } catch (e) { return; }
    const isStream = isStreamUrl(url);
    if (isStream && !url.includes('play.html') && !url.startsWith(SITE_URL)) {
      event.preventDefault();
      openInVlcOrChooser(url);
    }
  };
  mainWindow.webContents.on('will-navigate', maybeIntercept);

  // New-window requests: own-site links open in this window, raw stream
  // links go to VLC, and everything else (ads, popups, and player redirects
  // from VidAPI/movie embeds) opens in a new app window — same as a browser
  // "open in new tab". Nothing is blocked here; players that rely on
  // window.open() returning a real window keep working.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    let u;
    try { u = new URL(url); } catch (e) { return { action: 'deny' }; }
    if (u.host === SITE_HOST) {
      mainWindow.webContents.loadURL(url);
      return { action: 'deny' };
    }
    if (isStreamUrl(url)) {
      openInVlcOrChooser(url);
      return { action: 'deny' };
    }
    if (u.protocol === 'http:' || u.protocol === 'https:') {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 1000,
          height: 720,
          autoHideMenuBar: true,
          icon: path.join(__dirname, 'assets', 'icon.png'),
          webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            autoplayPolicy: 'no-user-gesture-required',
            plugins: true
          }
        }
      };
    }
    return { action: 'deny' };
  });

  // New windows opened above (ad/popup tabs) get the same VLC hand-off and
  // back-navigation shortcut, and close cleanly instead of piling up.
  mainWindow.webContents.on('did-create-window', (childWindow) => {
    childWindow.webContents.on('dom-ready', () => stripMetaCspEverywhere(childWindow.webContents));
    childWindow.webContents.on('did-frame-navigate', () => stripMetaCspEverywhere(childWindow.webContents));
    childWindow.webContents.on('will-navigate', maybeIntercept);
    childWindow.webContents.on('before-input-event', (event, input) => {
      if (input.type !== 'keyDown') return;
      if (input.key === 'F12') { childWindow.webContents.toggleDevTools(); return; }
      if (input.alt && input.key === 'ArrowLeft' && childWindow.webContents.canGoBack()) {
        event.preventDefault();
        childWindow.webContents.goBack();
      }
    });
  });

  // Back navigation (mirrors Android's hardware-back handling).
  // Handled per-window via before-input-event, NOT globalShortcut: a global
  // Backspace shortcut hijacks the key system-wide and breaks typing.
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    const wc = mainWindow.webContents;
    if (input.key === 'F12') { wc.toggleDevTools(); return; }
    if (input.alt && input.key === 'ArrowLeft' && wc.canGoBack()) {
      event.preventDefault();
      wc.goBack();
    }
  });

  mainWindow.loadURL(SITE_URL);

  mainWindow.on('closed', () => { mainWindow = null; });
}

// IPC bridge for window.EVStreamsNative.openInVlc(url) called from the page.
ipcMain.on('evstreams-open-in-vlc', (event, url) => openInVlcOrChooser(url));

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

