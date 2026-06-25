// functions/proxy.js
// Generic CDN / stream proxy for Cloudflare Pages
//
// Usage:
//   /proxy?url=https://example.com/playlist.m3u8
//   /proxy?url=https://some-cdn.com/icon.png
//
// Deploy: drop this file in /functions/proxy.js in your Cloudflare Pages project.
// It will be live at https://yourdomain.pages.dev/proxy

export async function onRequest(context) {
  const { request } = context;
  const reqUrl = new URL(request.url);
  const target = reqUrl.searchParams.get("url");

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }

  if (!target) {
    return new Response(
      JSON.stringify({ error: "Missing ?url= parameter" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Invalid URL" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // Only allow http/https targets
  if (!["http:", "https:"].includes(targetUrl.protocol)) {
    return new Response(
      JSON.stringify({ error: "Only http/https URLs are allowed" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  try {
    const upstreamHeaders = new Headers();
    // Forward Range header so video seeking / partial segment fetches work
    const range = request.headers.get("Range");
    if (range) upstreamHeaders.set("Range", range);

    // Some CDNs check Referer/User-Agent/Origin — spoof a normal browser request
    upstreamHeaders.set(
      "User-Agent",
      request.headers.get("User-Agent") ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    );
    upstreamHeaders.set("Referer", `${targetUrl.protocol}//${targetUrl.host}/`);

    const upstreamResponse = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: upstreamHeaders,
      redirect: "follow",
    });

    const contentType = upstreamResponse.headers.get("Content-Type") || "";

    // Rewrite .m3u8 playlists so relative segment URLs route back through this proxy
    if (
      contentType.includes("application/vnd.apple.mpegurl") ||
      contentType.includes("application/x-mpegurl") ||
      targetUrl.pathname.endsWith(".m3u8")
    ) {
      const text = await upstreamResponse.text();
      const rewritten = rewriteM3U8(text, targetUrl, reqUrl);

      return new Response(rewritten, {
        status: upstreamResponse.status,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Cache-Control": "no-cache",
          ...corsHeaders(),
        },
      });
    }

    // Everything else (segments, images, json, etc.) — stream through as-is
    const responseHeaders = new Headers(corsHeaders());
    responseHeaders.set("Content-Type", contentType || "application/octet-stream");

    const contentLength = upstreamResponse.headers.get("Content-Length");
    if (contentLength) responseHeaders.set("Content-Length", contentLength);

    const contentRange = upstreamResponse.headers.get("Content-Range");
    if (contentRange) responseHeaders.set("Content-Range", contentRange);

    const acceptRanges = upstreamResponse.headers.get("Accept-Ranges");
    if (acceptRanges) responseHeaders.set("Accept-Ranges", acceptRanges);

    responseHeaders.set("Cache-Control", "public, max-age=30");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Fetch failed", detail: err.message }),
      { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Range, Content-Type",
    "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
  };
}

// Rewrites relative URIs inside an .m3u8 playlist so they point back through
// this same proxy, preserving streaming across nested playlists/segments.
function rewriteM3U8(text, targetUrl, reqUrl) {
  const baseHref = targetUrl.toString();
  const proxyBase = `${reqUrl.protocol}//${reqUrl.host}${reqUrl.pathname}`;

  const lines = text.split("\n");
  const out = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return line;

    // It's a URI line (segment or nested playlist)
    let absolute;
    try {
      absolute = new URL(trimmed, baseHref).toString();
    } catch {
      return line;
    }
    return `${proxyBase}?url=${encodeURIComponent(absolute)}`;
  });

  return out.join("\n");
}
