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
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import okhttp3.Headers.Companion.toHeaders
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.ByteArrayInputStream
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * EV Streams — WebView shell + native VLC-style players.
 *
 *  1. Navigation lock: the top-level page can only ever be saptarshiorg.github.io or
 *     evstreams.pages.dev. Any other link, redirect, popup, popunder, intent:// or
 *     market:// jump is swallowed — no ad blocker needed on the device.
 *  2. Embeds still work: iframes/sub-resources (images, scripts, fonts, API/JSON, HLS/DASH
 *     segments) load normally. Cross-origin ones are fetched natively through OkHttp
 *     (NativeProxy) so CORS / X-Frame-Options never stop a legitimate embed or asset.
 *  3. Native players: window.EVStreamsNative.play(url, title, optionsJson)
 *       → libVLC (PlayerActivity)       for everything without DRM
 *       → Media3 (DrmPlayerActivity)    for licensed DRM (Widevine/PlayReady/ClearKey)
 *                                       or streams needing custom headers
 *  4. Fullscreen for HTML5 <video> and iframe players.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var customView: View? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null
    private var fullscreenContainer: FrameLayout? = null

    companion object {
        private const val SITE_URL = "https://evstreams.pages.dev/"

        /** The ONLY hosts allowed as the top-level page. Add yours here. */
        private val ALLOWED_PAGE_HOSTS = listOf("saptarshiorg.github.io", "evstreams.pages.dev")

        private val STREAM_EXTENSIONS = listOf(
            ".m3u8", ".mpd", ".ts", ".mkv", ".mp4", ".flv", ".key", ".m4s", ".vtt", ".webm", ".avi", ".mov"
        )

        /** Links that are playable media, not pages — open in the native player. */
        private val PLAYABLE_SCHEMES = listOf("rtsp", "rtmp", "udp", "srt", "rtp", "mms")

        /** Popup / popunder / redirect networks that should never load at all. Extend freely. */
        private val BLOCKED_HOSTS = listOf(
            "popads.net", "popcash.net", "propellerads.com", "propu.sh", "onclickads.net",
            "adsterra.com", "highperformanceformat.com", "exoclick.com", "exosrv.com",
            "juicyads.com", "trafficjunky.net", "clickadu.com", "hilltopads.net", "adcash.com",
            "popunderjs.com", "ad-maven.com", "admaven.com", "richpush.co", "pushame.com",
            "syndication.realsrv.com", "a-ads.com", "monetag.com", "tsyndicate.com"
        )

        fun isAllowedPageHost(host: String?): Boolean {
            val h = host?.lowercase() ?: return false
            return ALLOWED_PAGE_HOSTS.any { h == it }
        }

        fun isBlockedHost(host: String?): Boolean {
            val h = host?.lowercase() ?: return false
            return BLOCKED_HOSTS.any { h == it || h.endsWith(".$it") }
        }
    }

    private fun looksLikeStream(url: String): Boolean {
        val path = url.substringBefore('?').substringBefore('#').lowercase()
        return STREAM_EXTENSIONS.any { path.endsWith(it) } || path.contains(".m3u8") || path.contains(".mpd")
    }

    // ─────────────────────────── native proxy ───────────────────────────

    private object NativeProxy {
        private var cache: okhttp3.Cache? = null
        fun init(ctx: android.content.Context) {
            if (cache == null) cache = okhttp3.Cache(java.io.File(ctx.cacheDir, "ev_http"), 200L * 1024 * 1024)
            client = client.newBuilder().cache(cache).build()
        }

        // Many parallel connections + HTTP/2 → image grids load together instead of 5 at a time.
        private val dispatcher = okhttp3.Dispatcher().apply { maxRequests = 96; maxRequestsPerHost = 24 }

        // Images with no cache headers would be re-downloaded every time; keep them for a day.
        private val imageCacheInterceptor = okhttp3.Interceptor { chain ->
            val r = chain.proceed(chain.request())
            val type = r.header("Content-Type") ?: ""
            val cc = r.header("Cache-Control") ?: ""
            if (r.isSuccessful && type.startsWith("image/") && !cc.contains("max-age") && !cc.contains("no-store"))
                r.newBuilder().removeHeader("Pragma").header("Cache-Control", "public, max-age=86400").build()
            else r
        }

        @Volatile var client: OkHttpClient = OkHttpClient.Builder()
            .dispatcher(dispatcher)
            .connectionPool(okhttp3.ConnectionPool(32, 5, TimeUnit.MINUTES))
            .protocols(listOf(okhttp3.Protocol.HTTP_2, okhttp3.Protocol.HTTP_1_1))
            .addNetworkInterceptor(imageCacheInterceptor)
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .followRedirects(true)
            .followSslRedirects(true)
            .retryOnConnectionFailure(true)
            .build()

        private val DROP_REQUEST_HEADERS = setOf("host", "connection", "accept-encoding", "cookie2")

        private val STRIP_RESPONSE_HEADERS = setOf(
            "x-frame-options", "content-security-policy", "content-security-policy-report-only",
            "access-control-allow-origin", "access-control-allow-credentials",
            "access-control-allow-methods", "access-control-allow-headers",
            "cross-origin-resource-policy", "cross-origin-embedder-policy", "cross-origin-opener-policy"
        )

        private val IMAGE_EXT = listOf(".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif", ".ico", ".bmp")
        // Conditional headers can make the server answer 304, which WebResourceResponse can't represent.
        private val DROP_CONDITIONAL = setOf("if-none-match", "if-modified-since", "if-range")

        private fun isImage(request: WebResourceRequest): Boolean {
            val path = request.url.path?.lowercase() ?: ""
            val accept = request.requestHeaders.entries.firstOrNull { it.key.equals("accept", true) }?.value ?: ""
            return IMAGE_EXT.any { path.endsWith(it) } || accept.startsWith("image/")
        }

        private fun call(url: String, headers: Map<String, String>, method: String): Response =
            client.newCall(Request.Builder().url(url).headers(headers.toHeaders()).method(method, null).build()).execute()

        fun fetch(request: WebResourceRequest): WebResourceResponse? {
            val method = request.method.uppercase()
            if (method != "GET" && method != "HEAD") return null
            return try {
                val url = request.url.toString()
                val base = request.requestHeaders.filterKeys {
                    val k = it.lowercase(); k !in DROP_REQUEST_HEADERS && k !in DROP_CONDITIONAL
                }
                var response: Response = call(url, base, method)

                // Hotlink protection: hosts that reject our page's Referer/Origin. Retry the way a
                // plain <img> from the host's own site would — Referer = the image's own origin, no Origin.
                if (isImage(request) && response.code in listOf(400, 401, 403, 429)) {
                    response.close()
                    val u = request.url
                    val selfOrigin = "${u.scheme}://${u.host}/"
                    val retry = base.filterKeys { it.lowercase() != "origin" && it.lowercase() != "referer" } + ("Referer" to selfOrigin)
                    response = call(url, retry, method)
                    if (response.code in listOf(400, 401, 403, 429)) { // last try: no referer at all
                        response.close()
                        response = call(url, retry - "Referer", method)
                    }
                }

                val body = response.body ?: return null
                val code = response.code
                if (code < 100 || code in 300..399) { response.close(); return null } // let WebView handle it
                val ct = response.header("Content-Type")
                val mimeType = (ct ?: guessMime(url))?.substringBefore(";")?.trim()
                val encoding = ct?.substringAfter("charset=", "utf-8")?.trim() ?: "utf-8"

                val headers = LinkedHashMap<String, String>()
                for (name in response.headers.names()) {
                    if (name.lowercase() !in STRIP_RESPONSE_HEADERS) headers[name] = response.header(name) ?: continue
                }
                headers["Access-Control-Allow-Origin"] = "*"
                headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
                headers["Access-Control-Allow-Headers"] = "*"
                headers["Cross-Origin-Resource-Policy"] = "cross-origin"

                WebResourceResponse(
                    mimeType ?: "application/octet-stream", encoding, code,
                    response.message.ifBlank { "OK" }, headers, body.byteStream()
                )
            } catch (e: IOException) {
                Log.w("EVStreams", "proxy fetch failed ${request.url}: ${e.message}"); null
            } catch (e: Exception) {
                Log.w("EVStreams", "proxy error ${request.url}: ${e.message}"); null
            }
        }

        private fun guessMime(url: String): String? {
            val l = url.substringBefore('?').lowercase()
            return when {
                l.contains(".m3u8") -> "application/vnd.apple.mpegurl"
                l.contains(".mpd") -> "application/dash+xml"
                l.endsWith(".ts") -> "video/mp2t"
                l.endsWith(".m4s") -> "video/iso.segment"
                l.endsWith(".mp4") -> "video/mp4"
                l.endsWith(".webm") -> "video/webm"
                l.endsWith(".mkv") -> "video/x-matroska"
                l.endsWith(".vtt") -> "text/vtt"
                l.endsWith(".png") -> "image/png"
                l.endsWith(".jpg") || l.endsWith(".jpeg") -> "image/jpeg"
                l.endsWith(".gif") -> "image/gif"
                l.endsWith(".webp") -> "image/webp"
                l.endsWith(".svg") -> "image/svg+xml"
                l.endsWith(".avif") -> "image/avif"
                l.endsWith(".ico") -> "image/x-icon"
                l.endsWith(".json") -> "application/json"
                l.endsWith(".css") -> "text/css"
                l.endsWith(".js") -> "application/javascript"
                l.endsWith(".woff2") -> "font/woff2"
                l.endsWith(".woff") -> "font/woff"
                else -> null
            }
        }
    }

    // ─────────────────────────── lifecycle ───────────────────────────

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.webview)
        fullscreenContainer = findViewById(R.id.fullscreen_container)
        NativeProxy.init(applicationContext)
        configureWebView()
        webView.loadUrl(SITE_URL)
    }

    /** Injected into every frame at document start: neuter popup / redirect tricks. */
    private val GUARD_JS = """
        (function(){
          try {
            // Main page: leave everything native. Only iframes (where ad popups come from) are policed.
            if (window.top === window.self) return;
            var stub = { closed:true, close:function(){}, focus:function(){}, blur:function(){}, postMessage:function(){}, location:{} };
            window.open = function(){ return stub; };
            document.addEventListener('click', function(e){
              var a = e.target && e.target.closest ? e.target.closest('a[target]') : null;
              if (a && a.target && a.target !== '_self' && a.target !== '_top' && a.target !== '_parent') {
                e.preventDefault(); e.stopPropagation();
              }
            }, true);
            var mo = new MutationObserver(function(ms){ ms.forEach(function(m){ m.addedNodes && m.addedNodes.forEach(function(n){
              if (n.tagName === 'A' && n.target && n.target !== '_self' && !n.textContent.trim()) n.remove();
            }); }); });
            mo.observe(document.documentElement, {childList:true, subtree:true});
          } catch(e){}
        })();
    """.trimIndent()

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val s: WebSettings = webView.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = true
        s.databaseEnabled = true
        s.loadWithOverviewMode = true
        s.useWideViewPort = true
        s.mediaPlaybackRequiresUserGesture = false
        s.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        s.loadsImagesAutomatically = true
        s.blockNetworkImage = false
        s.allowContentAccess = true
        s.allowFileAccess = false
        s.cacheMode = WebSettings.LOAD_DEFAULT

        // No popups, ever.
        s.setSupportMultipleWindows(true)
        s.javaScriptCanOpenWindowsAutomatically = false

        WebView.setWebContentsDebuggingEnabled(false)

        if (WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
            WebViewCompat.addDocumentStartJavaScript(webView, GUARD_JS, setOf("*"))
        }

        webView.webViewClient = object : WebViewClient() {

            override fun onPageStarted(view: WebView, url: String?, favicon: android.graphics.Bitmap?) {
                if (!WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT))
                    view.evaluateJavascript(GUARD_JS, null)
            }

            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                val url = request.url
                val host = url.host

                // The top-level document is left to WebView so navigation/history behave normally.
                if (request.isForMainFrame) return null

                val sameSite = isAllowedPageHost(host)
                val isStream = looksLikeStream(url.toString())
                // Images, scripts, fonts, JSON/API, segments from other origins → native fetch (no CORS wall).
                if (!isStream && sameSite) return null
                if (url.scheme != "http" && url.scheme != "https") return null
                return NativeProxy.fetch(request)
            }

            override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler, error: SslError?) {
                // Never accept bad certs for the site itself; tolerate them for third-party stream/asset hosts.
                val host = Uri.parse(error?.url ?: "").host
                if (isAllowedPageHost(host)) handler.cancel() else handler.proceed()
            }

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val uri = request.url
                val url = uri.toString()
                val scheme = uri.scheme?.lowercase() ?: ""

                // Direct playable links → native player
                if (scheme in PLAYABLE_SCHEMES || (scheme.startsWith("http") && looksLikeStream(url) && !isAllowedPageHost(uri.host))) {
                    playNative(url, uri.lastPathSegment ?: "Stream", null)
                    return true
                }

                // Sub-frames (embeds) may navigate over http(s) — but never to ad networks or app-jump schemes.
                if (!request.isForMainFrame) {
                    return !(scheme == "http" || scheme == "https" || scheme == "about" || scheme == "blob" || scheme == "data") 
                }

                // Top-level: our own hosts stay inside the app.
                if ((scheme == "http" || scheme == "https") && isAllowedPageHost(uri.host)) return false

                // Anything else: only if the USER tapped it → hand to their browser / the real app
                // (Instagram, YouTube, Telegram…). Scripted redirects, popunders and ad hosts are dropped.
                val userTapped = if (android.os.Build.VERSION.SDK_INT >= 24) request.hasGesture() else true
                if (userTapped) openExternal(uri)
                else Log.i("EVStreams", "blocked auto-navigation → $url")
                return true
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowCustomView(view: View, callback: CustomViewCallback) {
                if (customView != null) { callback.onCustomViewHidden(); return }
                customView = view; customViewCallback = callback
                fullscreenContainer?.visibility = View.VISIBLE
                fullscreenContainer?.addView(view, FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))
                webView.visibility = View.GONE
            }

            override fun onHideCustomView() {
                fullscreenContainer?.visibility = View.GONE
                fullscreenContainer?.removeView(customView)
                customView = null
                customViewCallback?.onCustomViewHidden()
                webView.visibility = View.VISIBLE
            }

            // Main-page link/window.open that the user tapped → their browser / the real app.
            // (Iframe popups never get here: GUARD_JS stubs window.open inside frames, and
            // WebView refuses window.open without a user gesture.)
            override fun onCreateWindow(view: WebView, isDialog: Boolean, isUserGesture: Boolean, resultMsg: android.os.Message): Boolean {
                if (!isUserGesture) return false
                val tmp = WebView(this@MainActivity)
                tmp.webViewClient = object : WebViewClient() {
                    private fun hand(u: Uri?) { if (u != null && u.toString() != "about:blank") { openExternal(u); tmp.post { tmp.destroy() } } }
                    override fun shouldOverrideUrlLoading(v: WebView, r: WebResourceRequest): Boolean { hand(r.url); return true }
                    override fun onPageStarted(v: WebView, url: String?, f: android.graphics.Bitmap?) { v.stopLoading(); hand(url?.let { Uri.parse(it) }) }
                }
                (resultMsg.obj as WebView.WebViewTransport).webView = tmp
                resultMsg.sendToTarget()
                return true
            }

            override fun onJsAlert(view: WebView, url: String?, message: String?, result: JsResult): Boolean { result.cancel(); return true }
            override fun onJsBeforeUnload(view: WebView, url: String?, message: String?, result: JsResult): Boolean { result.cancel(); return true }

            override fun onPermissionRequest(request: PermissionRequest) {
                // Allow only what players need (protected media for licensed DRM); never camera/mic.
                val ok = request.resources.filter { it == PermissionRequest.RESOURCE_PROTECTED_MEDIA_ID }
                runOnUiThread { if (ok.isEmpty()) request.deny() else request.grant(ok.toTypedArray()) }
            }
        }

        webView.addJavascriptInterface(NativeBridge(), "EVStreamsNative")
    }

    // ─────────────────────────── native player routing ───────────────────────────

    private fun playNative(url: String, title: String, optionsJson: String?) {
        val spec = PlayerSpec.parse(url, title, optionsJson)
        val engine = if (spec.hasDrm || spec.needsCustomHeaders) DrmPlayerActivity::class.java else PlayerActivity::class.java
        startActivity(spec.toIntent(this, engine))
    }

    /** Only trust calls coming while our own site is the top-level page. */
    private fun callerTrusted(): Boolean = isAllowedPageHost(Uri.parse(webView.url ?: "").host)

    inner class NativeBridge {
        /** window.EVStreamsNative.play(url, title, optionsJson) — see PlayerSpec for the JSON shape. */
        @JavascriptInterface
        fun play(url: String, title: String?, optionsJson: String?) {
            if (!callerTrusted()) return
            runOnUiThread { playNative(url, title ?: "", optionsJson) }
        }

        /** Hand a stream to the real VLC app, if installed. */
        @JavascriptInterface
        fun openInVlc(url: String) {
            if (!callerTrusted()) return
            runOnUiThread { openInVlcOrChooser(url) }
        }

        @JavascriptInterface
        fun isNativeApp(): Boolean = true
    }

    /** Open a tapped link in the user's browser or the owning app. http(s)/mailto/tel only — never intent:// or market://. */
    private fun openExternal(uri: Uri) {
        val scheme = uri.scheme?.lowercase()
        if (scheme !in listOf("http", "https", "mailto", "tel")) return
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        } catch (e: Exception) {
            Toast.makeText(this, "No app found to open this link.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun openInVlcOrChooser(url: String) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW).setDataAndType(Uri.parse(url), "video/*")
                .setPackage("org.videolan.vlc").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        } catch (e: Exception) {
            try {
                startActivity(Intent.createChooser(Intent(Intent.ACTION_VIEW).setDataAndType(Uri.parse(url), "video/*")
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK), "Open stream with"))
            } catch (e2: Exception) {
                Toast.makeText(this, "No video player found.", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack() && customView == null) {
            webView.goBack(); return true
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun onDestroy() { webView.destroy(); super.onDestroy() }
}
