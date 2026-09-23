# EV Streams — Desktop App

Electron shell for https://evstreams.pages.dev/ — the desktop port of the
Android app in `../android-app/`. Same goals as the Android version: play
HLS (`.m3u8`), DASH, and iframe-embedded (JW Player / Video.js) streams that
a plain browser tab can't, with a VLC hand-off for
streams the in-app player can't handle.

## What it does (ported from the Android app)

- **CORS / CSP / X-Frame-Options bypass.** Every response, on every request
  (main page, stream segments, iframe embeds, JW Player/Video.js API calls),
  is intercepted at the network layer (`session.webRequest.onHeadersReceived`)
  and has its origin-restricting headers (`X-Frame-Options`,
  `Content-Security-Policy`, `Access-Control-Allow-*`, `Cross-Origin-*`)
  stripped and replaced with fully permissive ones. `webSecurity` is also
  disabled in the window so cross-origin embeds/API calls can run in the
  first place — the same net effect as the Android app's OkHttp `NativeProxy`,
  achieved via Electron's request-interception API instead of a native
  re-fetch.
- **New windows**: own-site links open in the app, raw stream links go to VLC, other links open in your default browser. There is no ad blocker.
- **VLC hand-off**: any raw stream link the app can't play in-window — or any
  page button that calls `window.EVStreamsNative.openInVlc(url)` — launches
  VLC directly (checked at its typical install path per OS), falling back to
  the OS's default handler for the URL, and a dialog if nothing can open it.
  Site JS written for the Android app works unmodified here.
- **Fullscreen playback** for native `<video>` and iframe-embedded players,
  via Chromium's HTML fullscreen events mapped to the OS window.
- **Mixed content + self-signed certs allowed** — many stream hosts serve
  plain http or bad SSL; the app proceeds anyway, same trust model as VLC.

## Known differences from the Android app
- Popup gesture-checking is approximated with the cooldown alone (Electron's
  `setWindowOpenHandler` doesn't expose a `isUserGesture` flag the way
  Android's `onCreateWindow` does).
- Back navigation is bound to `Alt+Left` and `Backspace` instead of a
  hardware back button.
- No app icon badge/adaptive-icon system — a single 256×256 PNG (upscaled
  from the Android launcher icon) is used for the taskbar/installer icon.

## Running it

```
cd desktop-app
npm install
npm start
```

## Building an installer

### Automatically (GitHub Actions)
Push this repo to GitHub with the workflow at
`.github/workflows/build-desktop.yml` in place (see
`../README-desktop-app.md`). It builds on every push to `main` under
`desktop-app/` and:
- uploads the build as a downloadable **Actions artifact** (Actions tab →
  latest run → Artifacts → `EV-Streams-Windows` / `EV-Streams-Linux`)
- also attaches it to a new **GitHub Release** (`desktop-build-<run number>`)

Windows build produces both an NSIS installer (`EV Streams Setup *.exe`) —
the "launcher" a user downloads and double-clicks to install, with desktop
and Start Menu shortcuts — and a portable `.exe` that needs no install.
Linux build produces an `.AppImage`. No signing certificate is required
(unsigned build — Windows SmartScreen may warn on first run).

### Locally
```
cd desktop-app
npm install
npm run dist:win     # Windows installer + portable .exe
npm run dist:linux    # Linux AppImage
npm run dist:mac      # macOS .dmg (must run on macOS)
```
Output lands in `desktop-app/dist/`.

## App details
- **App name:** EV Streams
- **App id:** `com.evstreams.desktop`
- **Loads:** `https://evstreams.pages.dev/`
- **Icon:** site logo (same source as the Android launcher icon)

## Adding an "Open in VLC" button on the website itself
Same bridge as the Android app — this only exists inside the wrapped app, so
guard it with the `if` check:
```js
if (window.EVStreamsNative) {
  window.EVStreamsNative.openInVlc(streamUrl);
}
```
