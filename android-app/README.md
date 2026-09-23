# EV Streams — Android App

WebView shell for https://saptarshiorg.github.io/ built to actually play HLS
(.m3u8), DASH, iframe embeds (JW Player / Video.js), and hand off raw stream
links to VLC when the in-app player can't handle them.

## What makes it work where a plain WebView fails

- **True CORS bypass, not just header stripping.** Every non-document request
  (stream segments, iframe embeds, JW Player/Video.js API/config calls) is
  re-fetched natively via OkHttp inside `NativeProxy` in `MainActivity.kt`.
  OkHttp has no Origin/CORS/CSP concept at all — same as VLC — so the request
  never happens inside a browser-restricted context in the first place. The
  response is handed back to the WebView with `Access-Control-Allow-Origin: *`
  and framing restrictions stripped, so hls.js/JW Player/Video.js/iframes see
  a response that looks like it always had permissive headers.
- Range requests (seeking on large `.mp4`/`.ts` files) still work — the proxy
  forwards the `Range` header and passes back `Content-Range`/`Accept-Ranges`
  untouched.
- Only `GET`/`HEAD` are proxied (WebView doesn't expose POST bodies to
  `shouldInterceptRequest`); other methods fall back to normal WebView
  handling.
- The top-level page load itself is left to the WebView untouched, so
  navigation, JS execution and history behave normally — only sub-resources
  get proxied.
- **VLC hand-off**: any raw stream link the WebView can't play — or any page
  button that calls `window.EVStreamsNative.openInVlc(url)` — fires an
  `ACTION_VIEW` intent straight to VLC (falls back to a chooser if VLC isn't
  installed).
- **Fullscreen playback** is wired for both native `<video>` and iframe-embedded
  players via `onShowCustomView`/`onHideCustomView`.
- **Mixed content + self-signed certs allowed** — many stream hosts serve
  plain http or bad SSL; the app proceeds anyway, same as a native player would.
- **Brave-level ad/popup blocking** (v1.1+): a ~76,000-domain blocklist
  (`assets/adblock_hosts.txt` — StevenBlack's combined hosts list plus a
  curated set of streaming-site popunder/redirect ad networks: popads,
  propellerads, exoclick, juicyads, mgid, hilltopads, and more) kills ad
  requests at the network layer via `AdBlocker` in `MainActivity.kt`. Blocked
  requests get an empty 200 response instead of failing, so the embed's
  layout doesn't break waiting on a dead request — same behaviour as Brave's
  adblock engine. On top of that:
  - `PopupGuard` rate-limits and gesture-checks every `window.open()`/new-tab
    request (1.5s cooldown, real user gesture required) to kill popunder
    chains, since ad scripts often fire `window.open()` synthetically inside
    a real click handler
  - `javaScriptCanOpenWindowsAutomatically` is off, so JS can't spawn a
    window without a user gesture in the first place
  - Forced full-page redirects to a blocklisted ad domain are blocked in
    `shouldOverrideUrlLoading` the same way network requests are

## Building the APK

### Automatically (GitHub Actions)
Push this repo to GitHub. The workflow at `.github/workflows/build-apk.yml`
builds on every push to `main` and:
- uploads the APK as a downloadable **Actions artifact** (Actions tab → latest
  run → Artifacts → `EV-Streams-APK`)
- also attaches it to a new **GitHub Release** (`build-<run number>`)

No local Android Studio needed — no signing keystore is required either,
since the release build is configured to use the default debug signing config
(installable, not Play-Store-signed).

### Locally
```
./gradlew assembleRelease
```
APK lands at `app/build/outputs/apk/release/app-release.apk`.

## App details
- **App name:** EV STREAMS
- **Package:** `com.evstreams.app`
- **Icon:** site logo on a white background (adaptive icon + legacy mipmaps)
- **Loads:** `https://saptarshiorg.github.io/`

## Adding an "Open in VLC" button on the website itself
Anywhere in your site's JS, for a known stream URL:
```js
if (window.EVStreamsNative) {
  window.EVStreamsNative.openInVlc(streamUrl);
}
```
This only exists inside the app (not in a normal browser), so guard it with
the `if` check shown above.
