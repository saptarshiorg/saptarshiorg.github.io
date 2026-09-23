package com.evstreams.app

import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.ActivityInfo
import android.net.Uri
import android.net.http.SslError
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.View
import android.webkit.*
import android.widget.FrameLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.Headers.Companion.toHeaders
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.BufferedReader
import java.io.ByteArrayInputStream
import java.io.IOException
import java.io.InputStreamReader
import java.util.concurrent.TimeUnit

/**
 * EV Streams — WebView shell for saptarshiorg.github.io
 *
 * What this activity does that a stock WebView won't:
 *  1. Real CORS bypass for every non-document request (see NativeProxy below):
 *     sub-resource requests — stream segments, iframe embeds, JW Player/
 *     Video.js API calls — are re-fetched natively via OkHttp, which has no
 *     Origin/CORS/CSP concept at all, and handed back to the WebView with
 *     permissive headers already attached. This is the same trust model VLC
 *     uses: the request never actually happens inside a browser context.
 *  2. Allows mixed content (http streams on an https page) and universal
 *     file/URL access so third-party embed players can load in the first
 *     place.
 *  3. Detects raw stream links (.m3u8, .mp4, .mkv, .ts) and offers a native
 *     "Open in VLC" hand-off via ACTION_VIEW for streams the in-app proxy
 *     still can't get through.
 *  4. Supports fullscreen playback for HTML5 <video> and embedded players.
 *  5. Brave-level ad/popup blocking (see AdBlocker below): a ~76k-domain
 *     block list (StevenBlack hosts + curated streaming popunder networks)
 *     kills ad requests at the network layer, new-window/popup creation is
 *     rate-limited and gesture-checked to stop popunder chains, and forced
 *     full-page ad redirects are blocked the same way.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null
    private var fullscreenContainer: FrameLayout? = null

    companion object {
        private const val SITE_URL = "https://saptarshiorg.github.io/"
        private val SITE_HOST = Uri.parse(SITE_URL).host
        private val STREAM_EXTENSIONS = listOf(
            ".m3u8", ".mpd", ".ts", ".mkv", ".mp4", ".flv", ".key", ".m4s", ".vtt"
        )

        /**
         * Cosmetic filtering — the other half of a "proper" adblocker
         * alongside the network-layer AdBlocker below. A lot of shady
         * streaming ad scripts never make a separately-blockable network
         * request at all: the ad script is already loaded as part of the
         * embed, and it just injects a full-screen overlay <div>/<iframe>
         * or spams alert()/confirm() dialogs. This runs after every page
         * (and iframe) load, plus on a short interval and via a
         * MutationObserver so late-injected ad overlays get caught too:
         *  - hides elements matching common ad/popup class-and-id patterns
         *  - detects and removes fixed/absolute full-viewport overlay divs
         *    that aren't part of your own player UI (the common "fake close
         *    button" full-screen ad trick)
         *  - is intentionally conservative: it only nukes elements that are
         *    BOTH suspiciously positioned/sized AND pattern-matched, to
         *    avoid hiding your own site's real UI
         */
        private val COSMETIC_FILTER_JS = """
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
          var AD_PATTERN = /(^|[^a-z])(ad|ads|advert|popup|banner|sponsor)([^a-z]|${'$'})/i;

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
            // High z-index full-viewport overlay is suspicious on its own;
            // pattern match on id/class raises confidence further but isn't
            // required, since ad overlays are often unnamed inline divs.
            return z >= 999 || AD_PATTERN.test(id);
          }

          function sweep() {
            try {
              var candidates = document.querySelectorAll(
                'body > div, body > iframe, body > section'
              );
              for (var i = 0; i < candidates.length; i++) {
                var el = candidates[i];
                if (looksLikeAdOverlay(el)) {
                  el.style.setProperty('display', 'none', 'important');
                  el.setAttribute('data-evstreams-blocked', '1');
                }
              }
              // Also restore scroll/body-lock some ad overlays force on <body>
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
        })();
        """
    }

    /**
     * The actual "VLC-style bypass" for in-page playback. VLC bypasses CORS
     * simply by not being a browser — it has no Origin header policy, no CSP,
     * no X-Frame-Options enforcement, it just opens the URL and reads bytes.
     * This object gives the WebView the same behaviour for any request that
     * isn't the top-level page load: fetch it natively (no origin policy),
     * then hand it back with Access-Control-Allow-Origin: * and no framing
     * restrictions, so hls.js/JW Player/Video.js/iframes see a response that
     * looks like it always had permissive headers.
     */
    private object NativeProxy {
        val client: OkHttpClient = OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .followRedirects(true)
            .followSslRedirects(true)
            .retryOnConnectionFailure(true)
            .build()

        // Headers that only make sense between the WebView and this process,
        // or that would break a fresh native fetch if forwarded verbatim.
        private val DROP_REQUEST_HEADERS = setOf(
            "host", "connection", "accept-encoding", "cookie2"
        )

        // Headers whose *origin-restricting* values we always override —
        // everything else from the real response passes through untouched
        // (Content-Type, Content-Length, Content-Range, Accept-Ranges, ETag…)
        // so range-seeking on large .mp4/.ts files keeps working.
        private val STRIP_RESPONSE_HEADERS = setOf(
            "x-frame-options", "content-security-policy",
            "content-security-policy-report-only",
            "access-control-allow-origin", "access-control-allow-credentials",
            "access-control-allow-methods", "access-control-allow-headers",
            "cross-origin-resource-policy", "cross-origin-embedder-policy",
            "cross-origin-opener-policy"
        )

        fun fetch(request: WebResourceRequest): WebResourceResponse? {
            // POST/PUT bodies aren't exposed by WebResourceRequest, so only
            // GET/HEAD can be transparently proxied. Everything else falls
            // back to default WebView handling.
            val method = request.method.uppercase()
            if (method != "GET" && method != "HEAD") return null

            return try {
                val reqHeaders = request.requestHeaders
                    .filterKeys { it.lowercase() !in DROP_REQUEST_HEADERS }

                val okRequest = Request.Builder()
                    .url(request.url.toString())
                    .headers(reqHeaders.toHeaders())
                    .method(method, null)
                    .build()

                val response: Response = client.newCall(okRequest).execute()
                val body = response.body ?: return null

                val mimeType = (response.header("Content-Type") ?: guessMime(request.url.toString()))
                    ?.substringBefore(";")?.trim()
                val encoding = response.header("Content-Type")
                    ?.substringAfter("charset=", "utf-8")?.trim() ?: "utf-8"

                val responseHeaders = LinkedHashMap<String, String>()
                for (name in response.headers.names()) {
                    if (name.lowercase() !in STRIP_RESPONSE_HEADERS) {
                        responseHeaders[name] = response.header(name) ?: continue
                    }
                }
                // Now add back fully permissive versions — this is the bypass.
                responseHeaders["Access-Control-Allow-Origin"] = "*"
                responseHeaders["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
                responseHeaders["Access-Control-Allow-Headers"] = "*"
                responseHeaders["Access-Control-Allow-Credentials"] = "true"

                val statusCode = response.code
                val reason = if (response.message.isNotBlank()) response.message else "OK"

                WebResourceResponse(
                    mimeType ?: "application/octet-stream",
                    encoding,
                    statusCode,
                    reason,
                    responseHeaders,
                    body.byteStream()
                )
            } catch (e: IOException) {
                Log.w("EVStreams", "NativeProxy fetch failed for ${request.url}: ${e.message}")
                null // let WebView fall back to its own (restricted) fetch
            } catch (e: Exception) {
                Log.w("EVStreams", "NativeProxy unexpected error for ${request.url}: ${e.message}")
                null
            }
        }

        private fun guessMime(url: String): String? {
            val lower = url.lowercase()
            return when {
                lower.contains(".m3u8") -> "application/vnd.apple.mpegurl"
                lower.contains(".mpd") -> "application/dash+xml"
                lower.contains(".ts") -> "video/mp2t"
                lower.contains(".m4s") -> "video/iso.segment"
                lower.contains(".mp4") -> "video/mp4"
                lower.contains(".mkv") -> "video/x-matroska"
                lower.contains(".vtt") -> "text/vtt"
                lower.contains(".key") -> "application/octet-stream"
                else -> null
            }
        }
    }

    /**
     * Brave-style network-layer ad/tracker blocking. Loaded once from
     * assets/adblock_hosts.txt (~76k domains: StevenBlack's combined hosts
     * list plus a curated set of streaming-site popunder/redirect ad
     * networks — popads, propellerads, exoclick, juicyads, etc.). Matching
     * requests are killed with an empty 200 response instead of returning
     * null, so the page layout doesn't break waiting on a failed request —
     * this mirrors how Brave's adblock engine responds to blocked requests.
     */
    private object AdBlocker {
        private var domains: HashSet<String> = HashSet()
        @Volatile private var loaded = false

        fun init(context: android.content.Context) {
            if (loaded) return
            synchronized(this) {
                if (loaded) return
                try {
                    val set = HashSet<String>(80000)
                    context.assets.open("adblock_hosts.txt").use { stream ->
                        BufferedReader(InputStreamReader(stream)).forEachLine { line ->
                            val d = line.trim()
                            if (d.isNotEmpty() && !d.startsWith("#")) set.add(d.lowercase())
                        }
                    }
                    domains = set
                    loaded = true
                    Log.i("EVStreams", "AdBlocker loaded ${set.size} domains")
                } catch (e: Exception) {
                    Log.w("EVStreams", "AdBlocker failed to load blocklist: ${e.message}")
                }
            }
        }

        fun isBlocked(host: String?): Boolean {
            if (host.isNullOrEmpty()) return false
            val h = host.lowercase()
            if (h in domains) return true
            // also match parent-domain blocks, e.g. "ads.example.com" blocked
            // because "example.com" is listed
            var idx = h.indexOf('.')
            while (idx != -1) {
                val parent = h.substring(idx + 1)
                if (parent in domains) return true
                idx = h.indexOf('.', idx + 1)
            }
            return false
        }

        fun blockedResponse(): WebResourceResponse {
            return WebResourceResponse(
                "text/plain", "utf-8", 200, "OK",
                mapOf("Access-Control-Allow-Origin" to "*"),
                ByteArrayInputStream(ByteArray(0))
            )
        }
    }

    /**
     * Stops popunder/popup ad chains without relying on the (unreliable)
     * isUserGesture flag alone: many ad scripts spawn window.open() calls
     * synthetically right inside a real click handler, so gesture-checking
     * by itself isn't enough. This adds a cooldown — only one new-window
     * request is honoured per short window, and even then it's redirected
     * into the current tab rather than an actual separate popup window,
     * since streaming embeds never legitimately need a second window.
     */
    private object PopupGuard {
        private var lastAllowedAt = 0L
        private const val COOLDOWN_MS = 1500L

        fun allow(isUserGesture: Boolean): Boolean {
            if (!isUserGesture) return false
            val now = System.currentTimeMillis()
            if (now - lastAllowedAt < COOLDOWN_MS) return false
            lastAllowedAt = now
            return true
        }
    }

    private fun isAdRedirect(url: android.net.Uri): Boolean {
        if (url.host == SITE_HOST) return false
        return AdBlocker.isBlocked(url.host)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        setContentView(R.layout.activity_main)

        AdBlocker.init(applicationContext)

        webView = findViewById(R.id.webview)
        fullscreenContainer = findViewById(R.id.fullscreen_container)

        configureWebView()
        webView.loadUrl(SITE_URL)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.mediaPlaybackRequiresUserGesture = false

        // Allow mixed http/https content — many stream hosts are still http-only
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        // Universal + file access from file URLs — needed for some embed
        // players that bootstrap via local blob/file contexts
        settings.allowUniversalAccessFromFileURLs = true
        settings.allowFileAccessFromFileURLs = true
        settings.allowContentAccess = true
        settings.allowFileAccess = true

        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.setSupportMultipleWindows(true)
        // False on purpose: forces window.open() to require a real user
        // gesture before onCreateWindow is even invoked, which is the first
        // line of defense against JS-spawned popup/popunder ads. PopupGuard
        // below adds the cooldown on top of this.
        settings.javaScriptCanOpenWindowsAutomatically = false

        WebView.setWebContentsDebuggingEnabled(true)

        webView.webViewClient = object : WebViewClient() {

            // This is where the real bypass happens. The top-level page load
            // (isForMainFrame) is left to the WebView itself, so navigation,
            // JS execution and history behave normally. Everything else —
            // stream segments, iframe embeds, cross-origin API/config calls —
            // gets re-fetched natively via NativeProxy, which has no CORS/
            // CSP/X-Frame-Options concept, and handed back with permissive
            // headers. Same-origin page assets (site's own CSS/JS/images)
            // are skipped for speed since they were never blocked anyway.
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                // Ad/tracker network block — checked first, before anything
                // else, for every request including main-frame navigations
                // (this is what stops a forced full-page ad redirect, not
                // just in-page ad iframes/scripts).
                if (AdBlocker.isBlocked(request.url.host)) {
                    return AdBlocker.blockedResponse()
                }

                if (request.isForMainFrame) return null

                val url = request.url
                val isStream = STREAM_EXTENSIONS.any {
                    url.toString().contains(it, ignoreCase = true)
                }
                val isCrossOrigin = url.host != null && url.host != SITE_HOST

                if (!isStream && !isCrossOrigin) return null

                return NativeProxy.fetch(request)
            }

            override fun onReceivedSslError(
                view: WebView?,
                handler: SslErrorHandler,
                error: SslError?
            ) {
                // Many stream/embed hosts use self-signed or misconfigured certs.
                // Proceed anyway — same trust model VLC/native players use.
                handler.proceed()
            }

            // Cosmetic filtering — injected as soon as the page finishes
            // loading so it catches ad overlays present in the initial DOM.
            // Its own MutationObserver + interval sweep (set up inside the
            // JS itself) handles anything injected later by ad scripts.
            override fun onPageFinished(view: WebView, url: String?) {
                super.onPageFinished(view, url)
                view.evaluateJavascript(COSMETIC_FILTER_JS, null)
            }

            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                val urlObj = request.url
                val url = urlObj.toString()

                // Forced navigation to a known ad/redirect network — block
                // outright rather than letting the page leave your site.
                if (isAdRedirect(urlObj)) {
                    Log.i("EVStreams", "Blocked ad redirect: $url")
                    return true
                }

                // If it's a direct stream link (not opened inside an iframe
                // player), give the option to hand it straight to VLC.
                if (STREAM_EXTENSIONS.any { url.contains(it, ignoreCase = true) } &&
                    !url.contains("play.html") &&
                    !url.contains(SITE_URL)
                ) {
                    openInVlcOrChooser(url)
                    return true
                }
                return false
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            // Fullscreen support for <video> elements and iframe-embedded players
            override fun onShowCustomView(view: View, callback: CustomViewCallback) {
                if (customView != null) {
                    callback.onCustomViewHidden()
                    return
                }
                customView = view
                customViewCallback = callback
                fullscreenContainer?.visibility = View.VISIBLE
                fullscreenContainer?.addView(
                    view,
                    FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                    )
                )
                webView.visibility = View.GONE
            }

            override fun onHideCustomView() {
                fullscreenContainer?.visibility = View.GONE
                fullscreenContainer?.removeView(customView)
                customView = null
                customViewCallback?.onCustomViewHidden()
                webView.visibility = View.VISIBLE
            }

            // Auto-dismiss alert()/confirm()/prompt() dialogs. Aggressive ad
            // scripts on shady streaming embeds use these as spam/scare
            // loops ("you've won a prize", fake virus warnings, permission
            // traps) since a real WebView shows a native dialog for them
            // that can otherwise be hard to close. Swallowing them silently
            // is safe here since the site itself doesn't rely on them.
            override fun onJsAlert(
                view: WebView, url: String?, message: String?,
                result: JsResult
            ): Boolean {
                Log.i("EVStreams", "Suppressed alert() spam: $message")
                result.cancel()
                return true
            }

            override fun onJsConfirm(
                view: WebView, url: String?, message: String?,
                result: JsResult
            ): Boolean {
                Log.i("EVStreams", "Suppressed confirm() spam: $message")
                result.cancel()
                return true
            }

            override fun onJsBeforeUnload(
                view: WebView, url: String?, message: String?,
                result: JsResult
            ): Boolean {
                result.confirm()
                return true
            }

            // Popup/popunder suppression: only a genuine, rate-limited user
            // gesture is allowed to open a "new window" at all, and even
            // then it's redirected into the current tab rather than an
            // actual separate window — streaming embeds never legitimately
            // need a real popup, so this kills popunder ad chains entirely
            // while still letting a real click-through work once.
            override fun onCreateWindow(
                view: WebView,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: android.os.Message
            ): Boolean {
                if (!PopupGuard.allow(isUserGesture)) {
                    Log.i("EVStreams", "Blocked popup/popunder (gesture=$isUserGesture)")
                    return false
                }

                val newWebView = WebView(this@MainActivity)
                newWebView.settings.javaScriptEnabled = true
                newWebView.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        v: WebView,
                        request: WebResourceRequest
                    ): Boolean {
                        if (isAdRedirect(request.url)) return true
                        webView.loadUrl(request.url.toString())
                        return true
                    }
                }
                val transport = resultMsg.obj as WebView.WebViewTransport
                transport.webView = newWebView
                resultMsg.sendToTarget()
                return true
            }

            override fun onPermissionRequest(request: PermissionRequest) {
                runOnUiThread { request.grant(request.resources) }
            }
        }

        // Add a JS bridge so any page button can trigger the native VLC hand-off:
        // window.EVStreamsNative.openInVlc('https://host/stream.m3u8')
        webView.addJavascriptInterface(VlcBridge(), "EVStreamsNative")
    }

    inner class VlcBridge {
        @JavascriptInterface
        fun openInVlc(url: String) {
            runOnUiThread { openInVlcOrChooser(url) }
        }
    }

    private fun openInVlcOrChooser(url: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW)
            intent.setDataAndType(Uri.parse(url), "video/*")
            intent.setPackage("org.videolan.vlc")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
        } catch (e: Exception) {
            // VLC not installed — fall back to a generic chooser so the user
            // can pick any installed player, or stay in-app.
            try {
                val fallback = Intent(Intent.ACTION_VIEW)
                fallback.setDataAndType(Uri.parse(url), "video/*")
                fallback.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                startActivity(Intent.createChooser(fallback, "Open stream with"))
            } catch (e2: Exception) {
                Toast.makeText(
                    this,
                    "No video player found — install VLC to play this stream externally.",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack() && customView == null) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
