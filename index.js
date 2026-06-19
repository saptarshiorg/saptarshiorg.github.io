export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        }
      });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get("url");

    if (!target) {
      return new Response("SX Sports HLS Proxy — use ?url=<encoded_stream_url>", { status: 400 });
    }

    const decoded = decodeURIComponent(target);

    let originHeader = "";
    let refererHeader = "";
    try {
      const u = new URL(decoded);
      originHeader = u.origin;
      refererHeader = u.origin + "/";
    } catch (e) {}

    const res = await fetch(decoded, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": refererHeader,
        "Origin": originHeader,
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
      }
    });

    if (!res.ok) {
      return new Response(`Upstream error: ${res.status} ${res.statusText}`, { status: res.status });
    }

    const contentType = res.headers.get("Content-Type") || "";
    const isM3U8 = contentType.includes("mpegurl") || decoded.includes(".m3u8");

    if (isM3U8) {
      let text = await res.text();
      const baseUrl = decoded.substring(0, decoded.lastIndexOf("/") + 1);
      const PROXY = "https://saptarshisx.2010samantasaptarshi.workers.dev/";

      // Rewrite absolute URLs in playlist
      text = text.replace(/(https?:\/\/[^\s"'\r\n]+)/g, (match) => {
        return PROXY + "?url=" + encodeURIComponent(match);
      });

      // Rewrite relative .ts segment paths
      text = text.replace(/^(?!#)([^\r\n]+\.ts[^\r\n]*)/gm, (match) => {
        if (match.startsWith("http")) return match; // already rewritten above
        const full = baseUrl + match;
        return PROXY + "?url=" + encodeURIComponent(full);
      });

      // Rewrite relative .m3u8 sub-playlist paths
      text = text.replace(/^(?!#)([^\r\n]+\.m3u8[^\r\n]*)/gm, (match) => {
        if (match.startsWith("http")) return match;
        const full = baseUrl + match;
        return PROXY + "?url=" + encodeURIComponent(full);
      });

      return new Response(text, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store",
        }
      });
    }

    // Pass through .ts segments and other binary content
    return new Response(res.body, {
      headers: {
        "Content-Type": contentType || "video/MP2T",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store",
      }
    });
  }
};
