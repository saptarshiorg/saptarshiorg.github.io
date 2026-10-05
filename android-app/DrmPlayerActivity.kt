package com.evstreams.app

import android.app.PictureInPictureParams
import android.content.pm.ActivityInfo
import android.os.Build
import android.os.Bundle
import android.util.Base64
import android.util.Rational
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.datasource.DefaultHttpDataSource
import androidx.media3.exoplayer.DefaultLoadControl
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.media3.exoplayer.drm.FrameworkMediaDrm
import androidx.media3.ui.PlayerView
import org.json.JSONArray
import org.json.JSONObject

/**
 * Media3/ExoPlayer engine. Used when a stream needs
 *   • licensed DRM  — Widevine / PlayReady with the provider's licence server, or
 *                     ClearKey with keys the provider supplies;
 *   • arbitrary request headers (tokens, cookies) that libVLC can't send.
 *
 * This activity does NOT extract, guess or bypass keys. If the device lacks the CDM
 * the stream requires, or the licence server refuses, it reports DRM_UNSUPPORTED /
 * DRM_LICENSE_ERROR and falls back to the next backup stream.
 */
class DrmPlayerActivity : AppCompatActivity() {

    private lateinit var spec: PlayerSpec
    private var player: ExoPlayer? = null
    private lateinit var view: PlayerView
    private lateinit var status: TextView
    private var urlIndex = 0
    private var retries = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        spec = PlayerSpec.fromIntent(intent) ?: run { finish(); return }
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        // Secure surface: protected content must not be screenshot/recorded.
        if (spec.hasDrm) window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowInsetsControllerCompat(window, window.decorView).apply {
            hide(WindowInsetsCompat.Type.systemBars())
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        }

        val root = FrameLayout(this).apply { setBackgroundColor(0xFF000000.toInt()) }
        view = PlayerView(this).apply {
            setShowBuffering(PlayerView.SHOW_BUFFERING_ALWAYS)
            setShowSubtitleButton(true)
            setShowFastForwardButton(true); setShowRewindButton(true)
            controllerShowTimeoutMs = 4000
        }
        status = TextView(this).apply {
            setTextColor(0xFFFFFFFF.toInt()); textSize = 15f; gravity = android.view.Gravity.CENTER
            setBackgroundColor(0xCC000000.toInt()); setPadding(48, 36, 48, 36); visibility = View.GONE
            setOnClickListener { retries = 0; urlIndex = 0; start() }
        }
        root.addView(view, -1, -1)
        root.addView(status, FrameLayout.LayoutParams(-2, -2, android.view.Gravity.CENTER))
        setContentView(root)
        start()
    }

    private fun start() {
        status.visibility = View.GONE
        player?.release()

        val ua = spec.userAgent ?: "Mozilla/5.0 (Linux; Android 13) EVStreams"
        val reqHeaders = HashMap(spec.headers)
        spec.referer?.let { reqHeaders["Referer"] = it }
        val http = DefaultHttpDataSource.Factory()
            .setUserAgent(ua).setAllowCrossProtocolRedirects(true)
            .setConnectTimeoutMs(15000).setReadTimeoutMs(20000)
            .setDefaultRequestProperties(reqHeaders)

        val load = DefaultLoadControl.Builder()
            .setBufferDurationsMs(15000, 50000, 2500, 5000).build()

        val p = ExoPlayer.Builder(this)
            .setMediaSourceFactory(DefaultMediaSourceFactory(this).setDataSourceFactory(http))
            .setLoadControl(load)
            .setSeekBackIncrementMs(10_000).setSeekForwardIncrementMs(10_000)
            .build()
        player = p; view.player = p

        val url = spec.allUrls[urlIndex]
        val item = MediaItem.Builder().setUri(url).apply {
            mimeFor(url)?.let { setMimeType(it) }
            buildDrm()?.let { setDrmConfiguration(it) }
            setLiveConfiguration(MediaItem.LiveConfiguration.Builder().setMaxPlaybackSpeed(1.04f).build())
        }.build()

        p.addListener(object : Player.Listener {
            override fun onPlaybackStateChanged(state: Int) {
                if (state == Player.STATE_READY) retries = 0
            }
            override fun onPlayerError(e: PlaybackException) = handleError(e)
        })
        p.setMediaItem(item); p.prepare(); p.playWhenReady = true
    }

    private fun buildDrm(): MediaItem.DrmConfiguration? {
        val t = spec.drmType ?: return null
        return when (t) {
            "widevine" -> {
                if (!FrameworkMediaDrm.isCryptoSchemeSupported(C.WIDEVINE_UUID)) { fail(PlayError.DRM_UNSUPPORTED); return null }
                MediaItem.DrmConfiguration.Builder(C.WIDEVINE_UUID)
                    .setLicenseUri(spec.drmLicense).setLicenseRequestHeaders(spec.drmLicenseHeaders)
                    .setMultiSession(true).build()
            }
            "playready" -> {
                if (!FrameworkMediaDrm.isCryptoSchemeSupported(C.PLAYREADY_UUID)) { fail(PlayError.DRM_UNSUPPORTED); return null }
                MediaItem.DrmConfiguration.Builder(C.PLAYREADY_UUID)
                    .setLicenseUri(spec.drmLicense).setLicenseRequestHeaders(spec.drmLicenseHeaders)
                    .setMultiSession(true).build()
            }
            "clearkey" -> {
                // Keys come from the stream provider (CMS). Build the standard ClearKey JWK
                // response locally so no licence server is needed.
                val kid = spec.clearKid; val key = spec.clearKey
                if (spec.drmLicense != null) {
                    MediaItem.DrmConfiguration.Builder(C.CLEARKEY_UUID)
                        .setLicenseUri(spec.drmLicense).setLicenseRequestHeaders(spec.drmLicenseHeaders)
                        .setMultiSession(true).build()
                } else if (kid != null && key != null) {
                    val jwk = JSONObject().put("type", "temporary").put("keys", JSONArray().put(
                        JSONObject().put("kty", "oct").put("k", hexToB64Url(key)).put("kid", hexToB64Url(kid))
                    ))
                    val uri = "data:text/plain;base64," + Base64.encodeToString(jwk.toString().toByteArray(), Base64.NO_WRAP)
                    MediaItem.DrmConfiguration.Builder(C.CLEARKEY_UUID)
                        .setLicenseUri(uri).setMultiSession(true).build()
                } else null
            }
            else -> null
        }
    }

    private fun hexToB64Url(hex: String): String {
        val clean = hex.replace("-", "")
        val bytes = ByteArray(clean.length / 2) { clean.substring(it * 2, it * 2 + 2).toInt(16).toByte() }
        return Base64.encodeToString(bytes, Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP)
    }

    private fun mimeFor(url: String): String? {
        val u = url.substringBefore('?').lowercase()
        return when {
            u.endsWith(".m3u8") -> MimeTypes.APPLICATION_M3U8
            u.endsWith(".mpd") -> MimeTypes.APPLICATION_MPD
            u.endsWith(".ism") || u.endsWith(".isml") || u.contains(".ism/") -> MimeTypes.APPLICATION_SS
            else -> null
        }
    }

    private fun classify(e: PlaybackException): PlayError = when (e.errorCode) {
        PlaybackException.ERROR_CODE_DRM_SCHEME_UNSUPPORTED,
        PlaybackException.ERROR_CODE_DRM_PROVISIONING_FAILED -> PlayError.DRM_UNSUPPORTED
        PlaybackException.ERROR_CODE_DRM_LICENSE_ACQUISITION_FAILED,
        PlaybackException.ERROR_CODE_DRM_DISALLOWED_OPERATION,
        PlaybackException.ERROR_CODE_DRM_DEVICE_REVOKED,
        PlaybackException.ERROR_CODE_DRM_LICENSE_EXPIRED,
        PlaybackException.ERROR_CODE_DRM_CONTENT_ERROR,
        PlaybackException.ERROR_CODE_DRM_SYSTEM_ERROR -> PlayError.DRM_LICENSE_ERROR
        PlaybackException.ERROR_CODE_IO_BAD_HTTP_STATUS -> {
            val code = (e.cause as? androidx.media3.datasource.HttpDataSource.InvalidResponseCodeException)?.responseCode
            when (code) { 401, 403 -> PlayError.AUTH_REQUIRED; 404, 410 -> PlayError.STREAM_OFFLINE; else -> PlayError.NETWORK_ERROR }
        }
        PlaybackException.ERROR_CODE_IO_NETWORK_CONNECTION_FAILED,
        PlaybackException.ERROR_CODE_IO_NETWORK_CONNECTION_TIMEOUT -> PlayError.NETWORK_ERROR
        PlaybackException.ERROR_CODE_TIMEOUT -> PlayError.TIMEOUT
        PlaybackException.ERROR_CODE_IO_FILE_NOT_FOUND -> PlayError.STREAM_OFFLINE
        PlaybackException.ERROR_CODE_PARSING_MANIFEST_MALFORMED,
        PlaybackException.ERROR_CODE_PARSING_MANIFEST_UNSUPPORTED -> PlayError.MANIFEST_ERROR
        PlaybackException.ERROR_CODE_PARSING_CONTAINER_UNSUPPORTED -> PlayError.FORMAT_UNSUPPORTED
        PlaybackException.ERROR_CODE_DECODER_INIT_FAILED,
        PlaybackException.ERROR_CODE_DECODING_FORMAT_UNSUPPORTED,
        PlaybackException.ERROR_CODE_DECODING_FORMAT_EXCEEDS_CAPABILITIES -> PlayError.CODEC_UNSUPPORTED
        PlaybackException.ERROR_CODE_DECODING_FAILED -> PlayError.DECODER_ERROR
        PlaybackException.ERROR_CODE_BEHIND_LIVE_WINDOW -> PlayError.STREAM_OFFLINE
        else -> PlayError.UNKNOWN
    }

    private fun handleError(e: PlaybackException) {
        if (e.errorCode == PlaybackException.ERROR_CODE_BEHIND_LIVE_WINDOW) { // just re-sync to live edge
            player?.seekToDefaultPosition(); player?.prepare(); return
        }
        val err = classify(e)
        val permanent = err == PlayError.DRM_UNSUPPORTED || err == PlayError.DRM_LICENSE_ERROR ||
            err == PlayError.AUTH_REQUIRED || err == PlayError.CODEC_UNSUPPORTED
        if (!permanent && retries < 2) { retries++; view.postDelayed({ start() }, 1200L * retries); return }
        if (urlIndex < spec.allUrls.size - 1) { urlIndex++; retries = 0; start(); return }
        fail(err, e.errorCodeName)
    }

    private fun fail(err: PlayError, detail: String? = null) {
        status.text = "${err.name}\n${err.msg}" + (detail?.let { "\n($it)" } ?: "") + "\n\nTap to retry"
        status.visibility = View.VISIBLE
    }

    override fun onUserLeaveHint() {
        if (Build.VERSION.SDK_INT >= 26 && player?.isPlaying == true && !spec.hasDrm)
            enterPictureInPictureMode(PictureInPictureParams.Builder().setAspectRatio(Rational(16, 9)).build())
    }
    override fun onPictureInPictureModeChanged(inPip: Boolean, cfg: android.content.res.Configuration) {
        super.onPictureInPictureModeChanged(inPip, cfg)
        view.useController = !inPip
    }
    private fun inPip() = Build.VERSION.SDK_INT >= 24 && isInPictureInPictureMode
    override fun onStop() { super.onStop(); if (!inPip()) player?.pause() }
    override fun onStart() { super.onStart(); player?.play() }
    override fun onDestroy() { player?.release(); player = null; super.onDestroy() }
}
