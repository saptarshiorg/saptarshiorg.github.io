// EV Streams — Desktop app
// Electron port of the Android WebView shell (see android-app/README.md).
// Ports: native CORS/CSP/X-Frame-Options bypass, adblock (StevenBlack hosts +
// curated streaming popunder networks), popup/popunder guard, cosmetic ad
// overlay filtering, mixed-content + self-signed cert tolerance, and VLC
// hand-off for raw stream links.

const { app, BrowserWindow, session, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
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
// AdBlocker — same blocklist as the Android app (assets/adblock_hosts.txt:
// StevenBlack combined hosts + curated streaming popunder/redirect networks).
// Blocked sub-resource requests are redirected to an empty data: response
// (200-equivalent) rather than cancelled, so embeds don't break waiting on a
// failed request — mirrors the Android AdBlocker.blockedResponse() behaviour.
// ---------------------------------------------------------------------------
const AdBlocker = (() => {
  let domains = new Set();
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'assets', 'adblock_hosts.txt'), 'utf8');
    for (const line of raw.split('\n')) {
      const d = line.trim();
      if (d && !d.startsWith('#')) domains.add(d.toLowerCase());
    }
    console.log(`[EVStreams] AdBlocker loaded ${domains.size} domains`);
  } catch (e) {
    console.warn('[EVStreams] AdBlocker failed to load blocklist:', e.message);
  }

  function isBlocked(host) {
    if (!host) return false;
    const h = host.toLowerCase();
    if (domains.has(h)) return true;
    let idx = h.indexOf('.');
    while (idx !== -1) {
      const parent = h.substring(idx + 1);
      if (domains.has(parent)) return true;
      idx = h.indexOf('.', idx + 1);
    }
    return false;
  }

  return { isBlocked };
})();

// ---------------------------------------------------------------------------
// PopupGuard — rate-limits window.open()/new-tab requests to stop popunder
// chains, same cooldown as the Android app.
// ---------------------------------------------------------------------------
const PopupGuard = (() => {
  let lastAllowedAt = 0;
  const COOLDOWN_MS = 1500;
  return {
    allow() {
      const now = Date.now();
      if (now - lastAllowedAt < COOLDOWN_MS) return false;
      lastAllowedAt = now;
      return true;
    }
  };
})();

// ---------------------------------------------------------------------------
// Cosmetic filtering — identical logic to the Android app's COSMETIC_FILTER_JS:
// hides ad/popup class-and-id patterns via injected CSS, and a
// MutationObserver + interval sweep that hides fixed/absolute full-viewport
// overlay divs (the "fake close button" trick), conservative enough to avoid
// eating the site's own player UI. Auto-dismisses alert()/confirm() spam too.
// ---------------------------------------------------------------------------
const COSMETIC_FILTER_JS = `
(function(){
  if (window.__evStreamsAdblockInstalled) return;
  window.__evStreamsAdblockInstalled = true;

  var css = [
    '[id*="popup" i]:not([id*="player" i]):not([id*="video" i])',
    '[class*="popup" i]:not([class*="player" i]):not([class*="video" i])',
    '[id*="banner-ad" i]', '[class*="banner-ad" i]',
    '[id*="ad-container" i]', '[class*="ad-container" i]',
    '[class*="ads-container" i]', '.advertisement', '.adsbygoogle',
    'ins.adsbygoogle',
    'iframe[src*="doubleclick" i]', 'iframe[src*="googlesyndication" i]',
    'iframe[src*="popads" i]', 'iframe[src*="propellerads" i]',
    'iframe[src*="exoclick" i]', 'iframe[src*="juicyads" i]',
    'iframe[src*="mgid" i]', 'iframe[src*="hilltopads" i]'
  ].join(',') + ' { display:none !important; visibility:hidden !important; pointer-events:none !important; opacity:0 !important; height:0 !important; }';

  var style = document.createElement('style');
  style.setAttribute('data-evstreams', 'adblock-css');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  var KEEP_ATTR = 'data-evstreams-keep';
  var AD_PATTERN = /(^|[^a-z])(ad|ads|advert|popup|banner|sponsor)([^a-z]|$)/i;

  function looksLikeAdOverlay(el) {
    if (!el || el.hasAttribute(KEEP_ATTR)) return false;
    var id = (el.id || '') + ' ' + (el.className || '');
    if (typeof el.className !== 'string' && el.className && el.className.baseVal) {
      id += ' ' + el.className.baseVal;
    }
    var cs;
    try { cs = window.getComputedStyle(el); } catch (e) { return false; }
    if (!cs) return false;
    var pos = cs.position;
    if (pos !== 'fixed' && pos !== 'absolute') return false;
    var z = parseInt(cs.zIndex) || 0;
    var rect = el.getBoundingClientRect();
    var bigEnough = rect.width >= window.innerWidth * 0.65 &&
                     rect.height >= window.innerHeight * 0.65;
    if (!bigEnough) return false;
    return z >= 999 || AD_PATTERN.test(id);
  }

  function sweep() {
    try {
      var candidates = document.querySelectorAll('body > div, body > iframe, body > section');
      for (var i = 0; i < candidates.length; i++) {
        var el = candidates[i];
        if (looksLikeAdOverlay(el)) {
          el.style.setProperty('display', 'none', 'important');
          el.setAttribute('data-evstreams-blocked', '1');
        }
      }
      if (document.body && document.body.style.overflow === 'hidden' &&
          document.querySelectorAll('[data-evstreams-blocked]').length > 0) {
        document.body.style.removeProperty('overflow');
      }
    } catch (e) {}
  }

  sweep();
  try {
    var observer = new MutationObserver(function(){ sweep(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
  setInterval(sweep, 1500);

  window.alert = function(msg){ console.log('[EVStreams] suppressed alert():', msg); };
  window.confirm = function(msg){ console.log('[EVStreams] suppressed confirm():', msg); return false; };
})();
`;

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
function isAdRedirect(hostname) {
  if (hostname === SITE_HOST) return false;
  return AdBlocker.isBlocked(hostname);
}

function setupSession(ses) {
  // Network-layer ad/tracker block, checked before anything else — including
  // main-frame navigations, so forced full-page ad redirects are stopped too.
  ses.webRequest.onBeforeRequest((details, callback) => {
    let host;
    try { host = new URL(details.url).hostname; } catch (e) { host = null; }
    if (AdBlocker.isBlocked(host)) {
      callback({ redirectURL: 'data:text/plain;base64,' });
      return;
    }
    callback({});
  });

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

  // Cosmetic filtering — injected into every frame (main + iframes) after
  // each load finishes, same as the Android onPageFinished hook.
  const injectFilterEverywhere = () => {
    try {
      for (const frame of mainWindow.webContents.mainFrame.framesInSubtree) {
        frame.executeJavaScript(COSMETIC_FILTER_JS).catch(() => {});
      }
    } catch (e) {
      mainWindow.webContents.executeJavaScript(COSMETIC_FILTER_JS).catch(() => {});
    }
  };
  mainWindow.webContents.on('did-finish-load', injectFilterEverywhere);
  mainWindow.webContents.on('did-frame-finish-load', injectFilterEverywhere);

  // Fullscreen playback for <video> and iframe-embedded players.
  mainWindow.webContents.on('enter-html-full-screen', () => mainWindow.setFullScreen(true));
  mainWindow.webContents.on('leave-html-full-screen', () => mainWindow.setFullScreen(false));

  // Direct stream links (not opened inside an iframe player) get handed
  // straight to VLC, and ad redirects are blocked — mirrors
  // shouldOverrideUrlLoading().
  const maybeIntercept = (event, url) => {
    let u;
    try { u = new URL(url); } catch (e) { return; }
    if (isAdRedirect(u.hostname)) {
      event.preventDefault();
      console.log('[EVStreams] Blocked ad redirect:', url);
      return;
    }
    const isStream = isStreamUrl(url);
    if (isStream && !url.includes('play.html') && !url.startsWith(SITE_URL)) {
      event.preventDefault();
      openInVlcOrChooser(url);
    }
  };
  mainWindow.webContents.on('will-navigate', maybeIntercept);

  // Popup/popunder guard: only a rate-limited request is honoured at all,
  // and even then it's redirected into the current window rather than a
  // real separate popup — streaming embeds never legitimately need one.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    let u;
    try { u = new URL(url); } catch (e) { return { action: 'deny' }; }
    if (isAdRedirect(u.hostname)) {
      console.log('[EVStreams] Blocked popup/popunder to ad host:', url);
      return { action: 'deny' };
    }
    if (!PopupGuard.allow()) {
      console.log('[EVStreams] Blocked popup (cooldown):', url);
      return { action: 'deny' };
    }
    const isStream = isStreamUrl(url);
    if (isStream) {
      openInVlcOrChooser(url);
    } else {
      mainWindow.webContents.loadURL(url);
    }
    return { action: 'deny' };
  });

  // Back navigation (mirrors Android's hardware-back handling).
  // Handled per-window via before-input-event, NOT globalShortcut: a global
  // Backspace shortcut hijacks the key system-wide and breaks typing.
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    const wc = mainWindow.webContents;
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

