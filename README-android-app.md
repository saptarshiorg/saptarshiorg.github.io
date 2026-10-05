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

**3. Popup policy (iframe popups only)**
- Everything loads: images (png/jpg/svg/webp/gif/avif), fonts, scripts, API calls, embeds, stream segments. No ad-host blocking of assets.
- Popups / popunders / `target=_blank` opened **from inside an iframe** are blocked. Script popups with no user tap are refused by WebView.
- Links and `window.open` on the main page that you tap open in your browser or the real app (Instagram, YouTube, Telegram…).
- `intent://` / `market://` jumps from iframes are refused; scripted main-page redirects with no tap are refused.
- Raw stream links (`.m3u8`, `.mpd`, `.mp4`, `rtsp://`, `udp://`, `srt://`…) open in the native player.
- Faster images: images load **directly** (no proxy hop). If a host refuses a direct load (hotlink protection) the page retries once and that host is proxied from then on (remembered). Proxy path: 24 parallel connections per host, HTTP/2, 200 MB disk cache, 24 h cache when the host sends none.
- The JS bridge only answers while your own site is the top-level page.

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
