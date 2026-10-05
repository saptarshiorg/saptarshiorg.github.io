/* EV Streams — call the native player from your site (safe in normal browsers).
 *
 *   EVNative.play(url, title, { referer, userAgent, headers, backups, drm })
 *
 * drm (licensed playback only — keys/licence come from the stream provider):
 *   { type:'widevine'|'playready', license:'https://licence.server/..', licenseHeaders:{} }
 *   { type:'clearkey', kid:'hex', key:'hex' }       // or { type:'clearkey', license:'https://..' }
 */
window.EVNative = {
  available: !!window.EVStreamsNative,
  play: function (url, title, opts) {
    if (window.EVStreamsNative && window.EVStreamsNative.play) {
      window.EVStreamsNative.play(url, title || '', JSON.stringify(opts || {}));
      return true;
    }
    return false; // not in the app → fall back to your normal web player (hls.js / shaka)
  },
  openInVlc: function (url) {
    if (window.EVStreamsNative) { window.EVStreamsNative.openInVlc(url); return true; }
    return false;
  }
};
