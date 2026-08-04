<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JW Stream Player</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-color: #2563eb;
            --accent-color: #d946ef;
            --glass-bg: rgba(15, 23, 42, 0.7);
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #000;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
        }

        #player {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 10;
        }

        .jwplayer {
            width: 100% !important;
            height: 100% !important;
        }

        .ambient-glow {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, #1e1b4b 0%, #000000 100%);
            z-index: -1;
        }

        #ui-layer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1001;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #ui-layer.visible {
            display: flex;
            opacity: 1;
        }

        .message-box {
            background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
            border: 1px solid var(--glass-border);
            padding: 2.5rem;
            border-radius: 24px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            color: #f8fafc;
        }

        .btn-retry {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            border: none;
            padding: 12px 32px;
            color: white;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
            text-transform: uppercase;
        }
    </style>
</head>
<body>

    <div class="ambient-glow"></div>
    <div id="player"></div>

    <div id="ui-layer">
        <div class="message-box">
            <span style="font-size:3rem; margin-bottom:1rem; display:block;">⚠️</span>
            <h2 id="msg-title">Stream Interrupted</h2>
            <p id="msg-desc" style="color:#94a3b8; margin-bottom:2rem;">We are unable to fetch the video stream.</p>
            <button class="btn-retry" onclick="window.location.reload()">Retry Stream</button>
        </div>
    </div>

    <script src="https://cdn.jwplayer.com/libraries/SAHhwvZq.js"></script>
    <script>
        const App = {
            config: {
                jwKey: 'XSuP4qMl+9tK17QNb+4+th2Pm9AWgMO/cYH8CI0HGGr7bdjo',
                brandingLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Jio_Logo.png',
                defaultTitle: 'Live Stream',
            },

            init: function() {
                jwplayer.key = this.config.jwKey;
                const params = this.getParams();

                if (!params.url) {
                    this.showError("Missing Source", "No stream URL was provided.");
                    return;
                }

                this.patchXHR(params.token);
                this.setupPlayer(params);
            },

            getParams: function() {
                const urlParams = new URLSearchParams(window.location.search);
                let streamUrl = decodeURIComponent(urlParams.get('url') || '');
                const token = urlParams.get('token') || '';
                const drm = urlParams.get('drm') || '';
                const title = urlParams.get('title') || this.config.defaultTitle;

                if (streamUrl && token && !streamUrl.includes('__hdnea__')) {
                    streamUrl += (streamUrl.includes('?') ? '&' : '?') + token;
                }

                return {
                    url: streamUrl,
                    token: token,
                    drm: this.parseDRM(drm),
                    title: title
                };
            },

            parseDRM: function(drmString) {
                if (!drmString || !drmString.includes(':')) return {};
                const [kid, key] = drmString.split(':');
                return {
                    clearkey: {
                        keyId: kid.trim().toLowerCase(),
                        key: key.trim().toLowerCase()
                    }
                };
            },

            patchXHR: function(token) {
                if (!token) return;
                const origOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url) {
                    if (typeof url === 'string' && url.startsWith('http') && !url.includes('__hdnea__')) {
                         const newUrl = new URL(url);
                         const tokenKey = token.split('=')[0];
                         if (!newUrl.searchParams.has(tokenKey)) {
                            url += (url.includes('?') ? '&' : '?') + token;
                         }
                    }
                    return origOpen.apply(this, arguments);
                };
            },

            setupPlayer: function(params) {
                const player = jwplayer("player");

                player.setup({
                    playlist: [{
                        title: params.title,
                        file: params.url,
                        drm: params.drm
                    }],
                    width: "100%",
                    height: "100%",
                    autostart: true,
                    mute: false,
                    stretching: "uniform",
                    logo: {
                        file: this.config.brandingLogo,
                        position: "top-right",
                        margin: "20"
                    }
                });

                player.on("error", (e) => {
                    console.error("JW Error:", e);
                    this.showError("Playback Error", "The stream connection was lost or refused.");
                });
            },

            showError: function(title, desc) {
                const layer = document.getElementById('ui-layer');
                document.getElementById('msg-title').innerText = title;
                document.getElementById('msg-desc').innerText = desc;
                layer.classList.add('visible');
            }
        };

        document.addEventListener('DOMContentLoaded', () => {
            App.init();
        });

        document.addEventListener('contextmenu', event => event.preventDefault());
    </script>
</body>
</html>