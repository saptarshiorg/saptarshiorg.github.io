package com.evstreams.app

import android.content.Context
import android.content.Intent
import org.json.JSONArray
import org.json.JSONObject

/**
 * Everything the native players need to know about one stream.
 * Built from the JSON the website passes to EVStreamsNative.play(url, title, json).
 *
 * json shape (all optional):
 * {
 *   "referer": "https://provider.example/",      // sent as Referer
 *   "userAgent": "Mozilla/5.0 ...",
 *   "headers": { "X-Token": "abc" },              // arbitrary request headers (Media3 engine)
 *   "backups": ["https://b1/stream.m3u8", ...],   // tried in order if primary fails
 *   "drm": {                                      // LICENSED playback only
 *     "type": "widevine" | "playready" | "clearkey",
 *     "license": "https://license.server/...",    // widevine / playready license URL
 *     "licenseHeaders": { "Authorization": "..." },
 *     "kid": "hex", "key": "hex"                  // clearkey, when the provider supplies them
 *   }
 * }
 */
data class PlayerSpec(
    val url: String,
    val title: String,
    val referer: String?,
    val userAgent: String?,
    val headers: Map<String, String>,
    val backups: List<String>,
    val drmType: String?,
    val drmLicense: String?,
    val drmLicenseHeaders: Map<String, String>,
    val clearKid: String?,
    val clearKey: String?
) {
    val hasDrm get() = drmType != null
    val needsCustomHeaders get() = headers.isNotEmpty()

    /** All candidate URLs in fallback order. */
    val allUrls get() = listOf(url) + backups

    fun toIntent(ctx: Context, target: Class<*>): Intent =
        Intent(ctx, target).putExtra(EXTRA, toJson().toString())

    fun toJson(): JSONObject = JSONObject().apply {
        put("url", url); put("title", title)
        referer?.let { put("referer", it) }
        userAgent?.let { put("userAgent", it) }
        put("headers", JSONObject(headers))
        put("backups", JSONArray(backups))
        if (drmType != null) put("drm", JSONObject().apply {
            put("type", drmType)
            drmLicense?.let { put("license", it) }
            put("licenseHeaders", JSONObject(drmLicenseHeaders))
            clearKid?.let { put("kid", it) }
            clearKey?.let { put("key", it) }
        })
    }

    companion object {
        const val EXTRA = "spec"

        private fun JSONObject.strMap(name: String): Map<String, String> {
            val o = optJSONObject(name) ?: return emptyMap()
            return o.keys().asSequence().associateWith { o.optString(it) }
        }

        fun parse(url: String, title: String, json: String?): PlayerSpec {
            val j = try { JSONObject(json ?: "{}") } catch (e: Exception) { JSONObject() }
            val backups = j.optJSONArray("backups")?.let { a ->
                (0 until a.length()).map { a.optString(it) }.filter { it.startsWith("http") || it.startsWith("rtsp") || it.startsWith("udp") || it.startsWith("srt") || it.startsWith("rtmp") }
            } ?: emptyList()
            val d = j.optJSONObject("drm")
            return PlayerSpec(
                url = url, title = title,
                referer = j.optString("referer").ifBlank { null },
                userAgent = j.optString("userAgent").ifBlank { null },
                headers = j.strMap("headers"),
                backups = backups,
                drmType = d?.optString("type")?.lowercase()?.ifBlank { null },
                drmLicense = d?.optString("license")?.ifBlank { null },
                drmLicenseHeaders = d?.strMap("licenseHeaders") ?: emptyMap(),
                clearKid = d?.optString("kid")?.ifBlank { null },
                clearKey = d?.optString("key")?.ifBlank { null }
            )
        }

        fun fromIntent(i: Intent): PlayerSpec? {
            val s = i.getStringExtra(EXTRA) ?: return null
            val j = JSONObject(s)
            return parse(j.optString("url"), j.optString("title"), s)
        }
    }
}

/** Friendly error codes (as in the player spec) instead of "Playback failed". */
enum class PlayError(val msg: String) {
    NETWORK_ERROR("Network problem — check your connection"),
    STREAM_OFFLINE("This stream is offline right now"),
    AUTH_REQUIRED("This stream needs authorization"),
    FORMAT_UNSUPPORTED("Format not supported"),
    CODEC_UNSUPPORTED("Codec not supported on this device"),
    MANIFEST_ERROR("Stream playlist could not be read"),
    DRM_UNSUPPORTED("This device does not support the required DRM"),
    DRM_LICENSE_ERROR("DRM licence was refused or expired"),
    TIMEOUT("Stream took too long to respond"),
    DECODER_ERROR("Decoder error"),
    UNKNOWN("Playback error")
}
