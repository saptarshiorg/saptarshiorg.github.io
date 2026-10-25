package com.evstreams.app

import android.annotation.SuppressLint
import android.app.PictureInPictureParams
import android.content.pm.ActivityInfo
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Rational
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import org.videolan.libvlc.LibVLC
import org.videolan.libvlc.Media
import org.videolan.libvlc.MediaPlayer
import org.videolan.libvlc.util.VLCVideoLayout
import kotlin.math.abs

/**
 * VLC-style native player powered by libVLC.
 *
 * Handles: HTTP/HTTPS, HLS, DASH, RTSP, RTP, UDP, SRT, RTMP, MKV/MP4/TS/AVI/FLV/…
 * Controls: play/pause, seek (±10s), go-live, speed, audio track, subtitle track,
 * aspect ratio, volume/brightness swipe, double-tap seek, lock, PiP, stats panel,
 * resume position, auto-reconnect and backup-stream fallback.
 *
 * Streams that need DRM or arbitrary headers are routed to DrmPlayerActivity (Media3)
 * by MainActivity before they ever reach here.
 */
class PlayerActivity : AppCompatActivity() {

    private lateinit var spec: PlayerSpec
    private lateinit var libVlc: LibVLC
    private lateinit var player: MediaPlayer
    private lateinit var videoLayout: VLCVideoLayout

    private lateinit var root: FrameLayout
    private lateinit var topBar: LinearLayout
    private lateinit var bottomBar: LinearLayout
    private lateinit var titleView: TextView
    private lateinit var liveBadge: TextView
    private lateinit var seek: SeekBar
    private lateinit var timeNow: TextView
    private lateinit var timeTotal: TextView
    private lateinit var playBtn: TextView
    private lateinit var spinner: ProgressBar
    private lateinit var errorView: TextView
    private lateinit var statsView: TextView
    private lateinit var toast: TextView
    private lateinit var lockBtn: TextView
    private lateinit var unlockBtn: TextView

    private val ui = Handler(Looper.getMainLooper())
    private var urlIndex = 0
    private var retries = 0
    private var controlsVisible = true
    private var locked = false
    private var seeking = false
    private var statsOn = false
    private var speedIdx = 3
    private var aspectIdx = 0
    private var isLive = false
    private var userPaused = false
    private val speeds = floatArrayOf(0.25f, 0.5f, 0.75f, 1f, 1.25f, 1.5f, 2f, 3f)
    private val aspects = listOf<Pair<String, String?>>(
        "Fit" to null, "Fill" to "FILL", "16:9" to "16:9", "4:3" to "4:3", "21:9" to "21:9", "1:1" to "1:1"
    )
    private val prefs by lazy { getSharedPreferences("ev_player", MODE_PRIVATE) }

    private val hideRunnable = Runnable { setControls(false) }
    private val tick = object : Runnable {
        override fun run() {
            refreshTime(); if (statsOn) refreshStats(); ui.postDelayed(this, 500)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        spec = PlayerSpec.fromIntent(intent) ?: run { finish(); return }
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        WindowCompat.setDecorFitsSystemWindows(window, false)

        buildUi()
        enterImmersive()

        val opts = arrayListOf(
            "--network-caching=3000", "--live-caching=3000", "--file-caching=1500",
            "--http-reconnect", "--adaptive-use-access", "--no-drop-late-frames",
            "--no-skip-frames", "--avcodec-hw=any", "-v"
        )
        libVlc = LibVLC(this, opts)
        player = MediaPlayer(libVlc)
        player.attachViews(videoLayout, null, true, false)
        player.setEventListener { e -> onVlcEvent(e) }
        titleView.text = spec.title.ifBlank { Uri.parse(spec.url).host ?: "Stream" }
        startCurrent(resume = true)
        ui.post(tick)
        scheduleHide()
    }

    // ───────────────────────── playback ─────────────────────────

    private fun startCurrent(resume: Boolean) {
        val url = spec.allUrls[urlIndex]
        errorView.visibility = View.GONE
        spinner.visibility = View.VISIBLE
        val media = Media(libVlc, Uri.parse(url))
        media.setHWDecoderEnabled(true, false)
        spec.userAgent?.let { media.addOption(":http-user-agent=$it") }
        spec.referer?.let { media.addOption(":http-referrer=$it") }
        media.addOption(":network-caching=3000")
        player.media = media
        media.release()
        player.play()
        if (resume) {
            val saved = prefs.getLong("pos_" + spec.url.hashCode(), 0L)
            if (saved > 5000) ui.postDelayed({ if (player.isSeekable) player.time = saved }, 1500)
        }
    }

    private fun failover(err: PlayError) {
        // 1) transient: retry same URL a couple of times
        if (retries < 2) {
            retries++
            toast("Reconnecting… ($retries/2)")
            ui.postDelayed({ startCurrent(false) }, 1200L * retries)
            return
        }
        // 2) backup stream
        if (urlIndex < spec.allUrls.size - 1) {
            urlIndex++; retries = 0
            toast("Switching to backup stream ${urlIndex}")
            startCurrent(false)
            return
        }
        // 3) proper error
        spinner.visibility = View.GONE
        errorView.text = "${err.name}\n${err.msg}\n\nTap to retry"
        errorView.visibility = View.VISIBLE
        setControls(true, sticky = true)
    }

    private fun onVlcEvent(e: MediaPlayer.Event) {
        when (e.type) {
            MediaPlayer.Event.Playing -> {
                retries = 0; spinner.visibility = View.GONE
                playBtn.text = "❚❚"
                applyAspect()
                player.rate = speeds[speedIdx]
            }
            MediaPlayer.Event.Paused -> playBtn.text = "▶"
            MediaPlayer.Event.Buffering ->
                spinner.visibility = if (e.buffering < 100f) View.VISIBLE else View.GONE
            MediaPlayer.Event.LengthChanged -> {
                isLive = player.length <= 0 || !player.isSeekable
                liveBadge.visibility = if (isLive) View.VISIBLE else View.GONE
            }
            MediaPlayer.Event.EncounteredError -> failover(classify())
            MediaPlayer.Event.EndReached -> {
                if (isLive) failover(PlayError.STREAM_OFFLINE) // live streams shouldn't end
                else { prefs.edit().remove("pos_" + spec.url.hashCode()).apply(); playBtn.text = "↺" }
            }
        }
    }

    /** libVLC doesn't expose typed errors; infer a friendly code from the URL scheme. */
    private fun classify(): PlayError {
        val u = spec.allUrls[urlIndex]
        return when {
            !u.startsWith("http") -> PlayError.STREAM_OFFLINE
            else -> PlayError.NETWORK_ERROR
        }
    }

    private fun refreshTime() {
        if (seeking || !::player.isInitialized) return
        val t = player.time; val len = player.length
        timeNow.text = fmt(t)
        if (isLive || len <= 0) {
            timeTotal.text = "LIVE"; seek.max = 1000; seek.progress = 1000
        } else {
            timeTotal.text = fmt(len)
            seek.max = 1000; seek.progress = (t * 1000 / len).toInt()
            if (player.isPlaying && t > 5000) prefs.edit().putLong("pos_" + spec.url.hashCode(), t).apply()
        }
    }

    private fun refreshStats() {
        val m = player.media ?: return
        val st = m.stats
        val vt = player.currentVideoTrack
        val sb = StringBuilder()
        sb.append("Source   ").append(Uri.parse(spec.allUrls[urlIndex]).host).append('\n')
        sb.append("Protocol ").append(spec.allUrls[urlIndex].substringBefore("://").uppercase()).append('\n')
        if (vt != null) {
            sb.append("Video    ").append(vt.width).append('x').append(vt.height)
            if (vt.frameRateDen > 0) sb.append(" @").append(vt.frameRateNum / vt.frameRateDen).append("fps")
            sb.append('\n')
            sb.append("Codec    ").append(vt.codec).append('\n')
        }
        if (st != null) {
            sb.append("Bitrate  ").append((st.inputBitrate * 8000).toInt()).append(" kbps\n")
            sb.append("Dropped  ").append(st.lostPictures).append(" / ").append(st.displayedPictures + st.lostPictures).append('\n')
        }
        sb.append("Speed    ").append(speeds[speedIdx]).append("x\n")
        sb.append("Decoder  HW→SW auto\nDRM      none (libVLC engine)")
        statsView.text = sb.toString()
    }

    // ───────────────────────── controls ─────────────────────────

    private fun togglePlay() {
        if (player.isPlaying) { player.pause(); userPaused = true } else {
            if (!isLive && player.length > 0 && player.time >= player.length - 500) player.time = 0
            player.play(); userPaused = false
        }
    }

    private fun skip(ms: Long) {
        if (!player.isSeekable) { toast("Live stream — can't seek"); return }
        player.time = (player.time + ms).coerceIn(0, if (player.length > 0) player.length else Long.MAX_VALUE)
        toast(if (ms > 0) "+${ms / 1000}s" else "${ms / 1000}s")
    }

    private fun goLive() {
        if (isLive) { startCurrent(false); toast("Jumping to live…") }
        else if (player.isSeekable) player.position = 0.999f
    }

    private fun applyAspect() {
        val (name, v) = aspects[aspectIdx]
        when (v) {
            null -> { player.aspectRatio = null; player.videoScale = MediaPlayer.ScaleType.SURFACE_BEST_FIT }
            "FILL" -> player.videoScale = MediaPlayer.ScaleType.SURFACE_FILL
            else -> { player.videoScale = MediaPlayer.ScaleType.SURFACE_BEST_FIT; player.aspectRatio = v }
        }
    }

    private fun pickTrack(title: String, tracks: Array<MediaPlayer.TrackDescription>?, current: Int, set: (Int) -> Unit) {
        if (tracks.isNullOrEmpty()) { toast("No $title tracks"); return }
        val names = tracks.map { it.name ?: "Track ${it.id}" }.toTypedArray()
        val checked = tracks.indexOfFirst { it.id == current }.coerceAtLeast(0)
        AlertDialog.Builder(this).setTitle(title)
            .setSingleChoiceItems(names, checked) { d, i -> set(tracks[i].id); d.dismiss() }
            .show()
    }

    private fun showQuality() {
        // libVLC's adaptive demuxer exposes renditions as video tracks.
        val t = player.videoTracks
        if (t.isNullOrEmpty() || t.size < 2) { toast("Auto quality (single rendition)"); return }
        val names = (listOf("Auto") + t.filter { it.id >= 0 }.map { it.name ?: "Track ${it.id}" }).toTypedArray()
        val ids = listOf(-1) + t.filter { it.id >= 0 }.map { it.id }
        AlertDialog.Builder(this).setTitle("Quality")
            .setItems(names) { _, i -> player.videoTrack = ids[i] }.show()
    }

    private fun showMenu() {
        val items = arrayOf(
            "Audio track", "Subtitles", "Quality", "Playback speed (${speeds[speedIdx]}x)",
            "Aspect ratio (${aspects[aspectIdx].first})", "Audio delay…", "Subtitle delay…",
            if (statsOn) "Hide stream info" else "Stream info", "Picture-in-picture"
        )
        AlertDialog.Builder(this).setItems(items) { _, i ->
            when (i) {
                0 -> pickTrack("Audio", player.audioTracks, player.audioTrack) { player.audioTrack = it }
                1 -> pickTrack("Subtitles", player.spuTracks, player.spuTrack) { player.spuTrack = it }
                2 -> showQuality()
                3 -> { speedIdx = (speedIdx + 1) % speeds.size; player.rate = speeds[speedIdx]; toast("${speeds[speedIdx]}x") }
                4 -> { aspectIdx = (aspectIdx + 1) % aspects.size; applyAspect(); toast(aspects[aspectIdx].first) }
                5 -> delayDialog("Audio delay (ms)", player.audioDelay / 1000) { player.audioDelay = it * 1000 }
                6 -> delayDialog("Subtitle delay (ms)", player.spuDelay / 1000) { player.spuDelay = it * 1000 }
                7 -> { statsOn = !statsOn; statsView.visibility = if (statsOn) View.VISIBLE else View.GONE }
                8 -> enterPip()
            }
        }.show()
    }

    private fun delayDialog(title: String, cur: Long, apply: (Long) -> Unit) {
        val et = EditText(this).apply {
            inputType = android.text.InputType.TYPE_CLASS_NUMBER or android.text.InputType.TYPE_NUMBER_FLAG_SIGNED
            setText(cur.toString())
        }
        AlertDialog.Builder(this).setTitle(title).setView(et)
            .setPositiveButton("OK") { _, _ -> et.text.toString().toLongOrNull()?.let(apply) }
            .setNegativeButton("Cancel", null).show()
    }

    private fun enterPip() {
        if (Build.VERSION.SDK_INT >= 26) {
            enterPictureInPictureMode(PictureInPictureParams.Builder().setAspectRatio(Rational(16, 9)).build())
        }
    }

    override fun onUserLeaveHint() { if (Build.VERSION.SDK_INT >= 26 && player.isPlaying) enterPip() }

    override fun onPictureInPictureModeChanged(inPip: Boolean, cfg: android.content.res.Configuration) {
        super.onPictureInPictureModeChanged(inPip, cfg)
        topBar.visibility = if (inPip) View.GONE else View.VISIBLE
        bottomBar.visibility = if (inPip) View.GONE else View.VISIBLE
    }

    // ───────────────────────── gestures ─────────────────────────

    @SuppressLint("ClickableViewAccessibility")
    private fun installGestures(v: View) {
        val dm = resources.displayMetrics
        var downX = 0f; var downY = 0f; var startVol = 0; var startBri = 0f
        var mode = 0 // 1 vol, 2 bri, 3 seek
        var seekStart = 0L; var lastTap = 0L
        val am = getSystemService(AUDIO_SERVICE) as android.media.AudioManager
        val maxVol = am.getStreamMaxVolume(android.media.AudioManager.STREAM_MUSIC)
        v.setOnTouchListener { _, e ->
            if (locked) { if (e.action == MotionEvent.ACTION_UP) setControls(true); return@setOnTouchListener true }
            when (e.action) {
                MotionEvent.ACTION_DOWN -> {
                    downX = e.x; downY = e.y; mode = 0
                    startVol = am.getStreamVolume(android.media.AudioManager.STREAM_MUSIC)
                    startBri = window.attributes.screenBrightness.let { if (it < 0) 0.5f else it }
                    seekStart = player.time
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = e.x - downX; val dy = e.y - downY
                    if (mode == 0 && (abs(dx) > 30 || abs(dy) > 30)) {
                        mode = if (abs(dx) > abs(dy)) 3 else if (downX < dm.widthPixels / 2) 2 else 1
                    }
                    when (mode) {
                        1 -> { val nv = (startVol - dy / dm.heightPixels * maxVol * 1.5f).toInt().coerceIn(0, maxVol)
                            am.setStreamVolume(android.media.AudioManager.STREAM_MUSIC, nv, 0); toast("Volume ${nv * 100 / maxVol}%") }
                        2 -> { val nb = (startBri - dy / dm.heightPixels * 1.5f).coerceIn(0.02f, 1f)
                            window.attributes = window.attributes.also { it.screenBrightness = nb }; toast("Brightness ${(nb * 100).toInt()}%") }
                        3 -> if (player.isSeekable) { val t = (seekStart + dx / dm.widthPixels * 120_000).toLong().coerceIn(0, player.length)
                            player.time = t; toast(fmt(t)) }
                    }
                }
                MotionEvent.ACTION_UP -> if (mode == 0) {
                    val now = System.currentTimeMillis()
                    if (now - lastTap < 300) { // double tap
                        if (e.x < dm.widthPixels / 3) skip(-10_000)
                        else if (e.x > dm.widthPixels * 2 / 3) skip(10_000) else togglePlay()
                        lastTap = 0
                    } else { lastTap = now; setControls(!controlsVisible) }
                }
            }
            true
        }
    }

    // ───────────────────────── UI ─────────────────────────

    private fun tv(text: String, size: Float = 22f, onClick: (() -> Unit)? = null) = TextView(this).apply {
        this.text = text; textSize = size; setTextColor(Color.WHITE); gravity = Gravity.CENTER
        setPadding(28, 14, 28, 14); typeface = Typeface.DEFAULT_BOLD
        onClick?.let { setOnClickListener { _ -> it(); scheduleHide() } }
    }

    private fun buildUi() {
        root = FrameLayout(this).apply { setBackgroundColor(Color.BLACK) }
        videoLayout = VLCVideoLayout(this)
        root.addView(videoLayout, MATCH, MATCH)

        val gestureLayer = View(this); root.addView(gestureLayer, MATCH, MATCH)
        installGestures(gestureLayer)

        // top bar
        topBar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL
            setBackgroundColor(0x99000000.toInt()); setPadding(24, 24, 24, 12)
        }
        topBar.addView(tv("←") { finish() })
        titleView = TextView(this).apply { setTextColor(Color.WHITE); textSize = 16f; maxLines = 1; ellipsize = android.text.TextUtils.TruncateAt.END }
        topBar.addView(titleView, LinearLayout.LayoutParams(0, WRAP, 1f))
        liveBadge = TextView(this).apply {
            text = "● LIVE"; setTextColor(Color.WHITE); textSize = 12f; setPadding(18, 6, 18, 6); visibility = View.GONE
            background = GradientDrawable().apply { setColor(0xFFE11D48.toInt()); cornerRadius = 12f }
            setOnClickListener { goLive() }
        }
        topBar.addView(liveBadge)
        topBar.addView(tv("⋮") { showMenu() })
        root.addView(topBar, FrameLayout.LayoutParams(MATCH, WRAP, Gravity.TOP))

        // bottom bar
        bottomBar = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL; setBackgroundColor(0x99000000.toInt()); setPadding(24, 8, 24, 24)
        }
        val seekRow = LinearLayout(this).apply { gravity = Gravity.CENTER_VERTICAL }
        timeNow = TextView(this).apply { setTextColor(Color.WHITE); textSize = 12f; text = "0:00" }
        timeTotal = TextView(this).apply { setTextColor(Color.WHITE); textSize = 12f; text = "0:00" }
        seek = SeekBar(this).apply {
            max = 1000
            setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(s: SeekBar, p: Int, fromUser: Boolean) {
                    if (fromUser && player.isSeekable) timeNow.text = fmt(player.length * p / 1000)
                }
                override fun onStartTrackingTouch(s: SeekBar) { seeking = true; ui.removeCallbacks(hideRunnable) }
                override fun onStopTrackingTouch(s: SeekBar) {
                    if (player.isSeekable) player.position = s.progress / 1000f
                    seeking = false; scheduleHide()
                }
            })
        }
        seekRow.addView(timeNow); seekRow.addView(seek, LinearLayout.LayoutParams(0, WRAP, 1f)); seekRow.addView(timeTotal)
        bottomBar.addView(seekRow)

        val row = LinearLayout(this).apply { gravity = Gravity.CENTER; orientation = LinearLayout.HORIZONTAL }
        lockBtn = tv("🔓", 18f) { locked = true; setControls(false); toast("Screen locked — tap to show unlock") }
        row.addView(lockBtn)
        row.addView(tv("⏮", 20f) { skip(-30_000) })
        row.addView(tv("↺10", 16f) { skip(-10_000) })
        playBtn = tv("❚❚", 28f) { togglePlay() }
        row.addView(playBtn)
        row.addView(tv("10↻", 16f) { skip(10_000) })
        row.addView(tv("⏭", 20f) { skip(30_000) })
        row.addView(tv("⛶", 20f) { aspectIdx = (aspectIdx + 1) % aspects.size; applyAspect(); toast(aspects[aspectIdx].first) })
        bottomBar.addView(row)
        root.addView(bottomBar, FrameLayout.LayoutParams(MATCH, WRAP, Gravity.BOTTOM))

        unlockBtn = tv("🔒 Unlock", 16f) { locked = false; unlockBtn.visibility = View.GONE; setControls(true) }.apply {
            visibility = View.GONE; setBackgroundColor(0xCC000000.toInt())
        }
        root.addView(unlockBtn, FrameLayout.LayoutParams(WRAP, WRAP, Gravity.CENTER_VERTICAL or Gravity.END).apply { rightMargin = 48 })

        spinner = ProgressBar(this)
        root.addView(spinner, FrameLayout.LayoutParams(120, 120, Gravity.CENTER))

        errorView = TextView(this).apply {
            setTextColor(Color.WHITE); textSize = 16f; gravity = Gravity.CENTER; visibility = View.GONE
            setBackgroundColor(0xCC000000.toInt()); setPadding(48, 48, 48, 48)
            setOnClickListener { retries = 0; urlIndex = 0; startCurrent(false) }
        }
        root.addView(errorView, FrameLayout.LayoutParams(WRAP, WRAP, Gravity.CENTER))

        statsView = TextView(this).apply {
            setTextColor(Color.WHITE); textSize = 11f; typeface = Typeface.MONOSPACE; visibility = View.GONE
            setBackgroundColor(0xBB000000.toInt()); setPadding(24, 16, 24, 16)
        }
        root.addView(statsView, FrameLayout.LayoutParams(WRAP, WRAP, Gravity.TOP or Gravity.START).apply { topMargin = 140; leftMargin = 24 })

        toast = TextView(this).apply {
            setTextColor(Color.WHITE); textSize = 15f; visibility = View.GONE
            setBackgroundColor(0xCC000000.toInt()); setPadding(32, 16, 32, 16)
        }
        root.addView(toast, FrameLayout.LayoutParams(WRAP, WRAP, Gravity.CENTER_HORIZONTAL or Gravity.TOP).apply { topMargin = 220 })

        setContentView(root)
    }

    private val toastHide = Runnable { toast.visibility = View.GONE }
    private fun toast(s: String) { toast.text = s; toast.visibility = View.VISIBLE; ui.removeCallbacks(toastHide); ui.postDelayed(toastHide, 1200) }

    private fun setControls(show: Boolean, sticky: Boolean = false) {
        if (locked) { // while locked only the unlock button can appear
            topBar.visibility = View.GONE; bottomBar.visibility = View.GONE
            unlockBtn.visibility = if (show) View.VISIBLE else View.GONE
            controlsVisible = show
            if (show) { ui.removeCallbacks(hideRunnable); ui.postDelayed(hideRunnable, 2500) }
            return
        }
        controlsVisible = show
        val vis = if (show) View.VISIBLE else View.GONE
        topBar.visibility = vis; bottomBar.visibility = vis
        if (show && !sticky) scheduleHide()
        if (!show) enterImmersive()
    }

    private fun scheduleHide() { ui.removeCallbacks(hideRunnable); ui.postDelayed(hideRunnable, 4000) }

    private fun enterImmersive() {
        val c = WindowInsetsControllerCompat(window, window.decorView)
        c.hide(WindowInsetsCompat.Type.systemBars())
        c.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }

    private fun fmt(ms: Long): String {
        val s = (ms / 1000).coerceAtLeast(0); val h = s / 3600; val m = s % 3600 / 60; val sec = s % 60
        return if (h > 0) "%d:%02d:%02d".format(h, m, sec) else "%d:%02d".format(m, sec)
    }

    private fun inPip() = Build.VERSION.SDK_INT >= 24 && isInPictureInPictureMode
    override fun onStop() { super.onStop(); if (!inPip() && ::player.isInitialized) player.pause() }
    override fun onStart() { super.onStart(); if (::player.isInitialized && !userPaused) player.play() }

    override fun onDestroy() {
        ui.removeCallbacksAndMessages(null)
        if (::player.isInitialized) { player.stop(); player.detachViews(); player.release() }
        if (::libVlc.isInitialized) libVlc.release()
        super.onDestroy()
    }

    companion object {
        private const val MATCH = ViewGroup.LayoutParams.MATCH_PARENT
        private const val WRAP = ViewGroup.LayoutParams.WRAP_CONTENT
    }
}
