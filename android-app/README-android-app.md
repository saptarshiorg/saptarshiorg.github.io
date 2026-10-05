# EV Streams Android app v2 — VLC-style player + locked navigation

Replace the repo's `android-app/` folder, `.github/workflows/build-apk.yml` and (optionally)
drop `ev-native-player.js` into your site root. Push → Actions builds the APK.

## What changed
**1. Native VLC-style player (libVLC)** — `PlayerActivity`
HTTP/HTTPS, HLS, DASH, RTSP, RTP, UDP, SRT, RTMP, MKV/MP4/TS/AVI/FLV/WebM…, HW→SW decoding.
Play/pause, seek bar, ±10/30s, double-tap seek, swipe volume/brightness, live badge + go-live,
speed 0.25–3×, audio/subtitle tracks, quality, aspect ratio, audio/sub delay, lock, PiP,
stream-info panel, resume position, auto-reconnect, backup-stream fallback, typed errors.

**2. Licensed DRM + header-auth engine (Media3)** — `DrmPlayerActivity`
Widevine / PlayReady with the provider's licence server, ClearKey with provider-supplied keys,
arbitrary request headers/cookies, secure surface for protected content, typed errors
(DRM_UNSUPPORTED, DRM_LICENSE_ERROR, AUTH_REQUIRED…) and backup fallback.
Routing is automatic: DRM or custom headers → Media3, everything else → libVLC.

**3. No link or iframe blocking**
- Nothing is blocked: all iframes, embeds, players, scripts, images, APIs and redirects load normally.
- Only convenience behaviour: a link you tap on the page to another site (Instagram, YouTube…) opens in your browser/the real app, and raw stream links (`.m3u8`, `.mpd`, `.mp4`, `rtsp://`…) tapped on the page open in the native player.
- Images load directly; if a host refuses (hotlink protection) that host is proxied and remembered.
- Proxy fails open: if the native proxy gets an error for a non-image, WebView loads it itself.
- The JS bridge only answers while your own site is the top-level page.

## Embed playback notes
- Iframe pages load natively (like Chrome), no proxy. If a host refuses to be framed (X-Frame-Options / frame-ancestors) the app notices from the console, proxies that host only, remembers it and reloads once.
- Frame failures and key console errors (refused / CORS / blocked / net::) pop up as short toasts so the real cause is visible. Remote debugging is on (`chrome://inspect`).
- Third-party cookies are enabled and the UA no longer says `; wv`, so JW Player / Video.js / other iframe players load like in Chrome.
- The proxy forwards WebView cookies and stores Set-Cookie back, and never caches playlists/segments/iframe pages (only images use the disk cache).
- Known limit: Android only exposes GET/HEAD to the proxy, so a player that POSTs to a server without CORS headers can't be rescued — use `EVNative.play()` for those.

## From your site
```html
<script src="/ev-native-player.js"></script>
<script>
  if (!EVNative.play(streamUrl, 'Match title', {
        referer: 'https://provider.example/',
        backups: [backup1, backup2],
        drm: { type: 'widevine', license: 'https://licence.example/wv' }
  })) { /* normal browser → use your web player */ }
</script>
```

## Not included
DRM key extraction / DRM bypass / HDCP bypass. Protected streams play only when the device has
the required CDM **and** the provider's licence server grants a licence; otherwise the player
shows DRM_UNSUPPORTED / DRM_LICENSE_ERROR and tries the next backup.

## Notes
- Built without an Android SDK in my environment — first CI run is the real compile check; send me the log if anything fails.
- APK is larger now (libVLC ≈ +25–30 MB per ABI; limited to arm64-v8a + armeabi-v7a).
- Original `android-app/README.md` is superseded by this file.
