<?php
$id = $_GET['id'] ?? '';

$json_url = "https://sonujson-devloper.vercel.app/Data/prime.json";
$json_raw = @file_get_contents($json_url);
$data = json_decode($json_raw, true);
$matches = $data['Matches'] ?? [];

$selected = null;
foreach($matches as $m) {
    if($m['id'] === $id) {
        $selected = $m;
        break;
    }
}

// Fallback to first item if ID not matched
if(!$selected && count($matches) > 0) {
    $selected = $matches[0];
}

$stream_url = $selected['CnpTV']['amazon_server'] 
            ?? $selected['CnpTV']['cloudfront_server'] 
            ?? $selected['CnpTV']['akamai_server'] 
            ?? '';

$drm_key = $selected['drm_key'] ?? '';
$event_name = $selected['event_name'] ?? 'Live Stream';
$logo_img = $selected['image'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title><?php echo htmlspecialchars($event_name); ?> | Stream Player</title>

  <!-- Frameworks & Fonts -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">

  <!-- Shaka Player CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.6.0/shaka-player.ui.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.6.0/controls.min.css" />

  <style>
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: #000 !important;
      overflow: hidden;
    }

    .shaka-video-container {
      width: 100%;
      height: 100%;
      background-color: #000;
    }

    .shaka-video-container video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      position: relative;
      max-width: none;
      max-height: none;
      transform: none;
    }

    /* Explicit Fullscreen rules */
    .shaka-video-container:fullscreen,
    .shaka-video-container:-webkit-full-screen,
    .shaka-video-container:-moz-full-screen,
    .shaka-video-container:-ms-fullscreen {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      max-width: 100vw !important;
      max-height: 100vh !important;
      background-color: #000 !important;
      transform: none !important;
      backface-visibility: visible !important;
      -webkit-backface-visibility: visible !important;
    }

    .shaka-video-container:fullscreen video,
    .shaka-video-container:-webkit-full-screen video,
    .shaka-video-container:-moz-full-screen video,
    .shaka-video-container:-ms-fullscreen video {
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: contain;
      transform: none !important;
      backface-visibility: visible !important;
      -webkit-backface-visibility: visible !important;
    }

    :-webkit-full-screen { background-color: #000 !important; }
    :fullscreen { background-color: #000 !important; }

    video {
      transform: translateZ(0);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
  </style>
</head>
<body class="bg-black text-white m-0 p-0 w-screen h-screen font-sans">

<div id="video-container" class="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">

  <!-- Loader -->
  <div id="loader" class="absolute inset-0 bg-black/90 z-[2000] flex flex-col items-center justify-center transition-opacity duration-300">
    <div class="text-7xl animate-spin text-cyan-400 drop-shadow-[0_0_25px_#00d2ff]">❄️</div>
    <div class="loading-text mt-4 text-sm tracking-widest text-gray-300 uppercase animate-pulse">LOADING STREAM...</div>
  </div>

  <!-- Unmute Overlay -->
  <button id="unmute-overlay" class="hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1500] btn btn-danger rounded-pill px-4 py-2 font-bold shadow-lg animate-bounce">
    <span class="material-icons-round align-middle me-1">volume_off</span> TAP TO UNMUTE
  </button>

  <!-- Shaka Video Container -->
  <div id="controls" class="absolute inset-0 z-10">
    <video id="video" class="w-full h-full object-contain" autoplay muted playsinline></video>
  </div>

  <!-- Logo Panel -->
  <?php if(!empty($logo_img)): ?>
  <div id="channel-logo" class="absolute top-4 right-4 z-[1000] bg-dark/70 backdrop-blur-md border border-white/10 rounded-3 px-3 py-2 flex items-center justify-center">
    <img id="logo-img" class="h-8 max-w-[120px] object-contain" src="<?php echo htmlspecialchars($logo_img); ?>" alt="Logo">
  </div>
  <?php endif; ?>

  <!-- Switch to JW Player Button -->
  <button id="jw-button" class="absolute top-4 left-4 z-[1000] btn btn-outline-light btn-sm backdrop-blur-md border-white/20 d-flex align-items-center gap-2 shadow">
    <span class="material-icons-round text-base">open_in_new</span>
    <span>Switch Player (JW)</span>
  </button>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<script>
  const loader = document.getElementById('loader');
  const unmuteBtn = document.getElementById('unmute-overlay');

  const rawUrl = "<?php echo $stream_url; ?>";
  const rawDrm = "<?php echo $drm_key; ?>";
  const eventName = "<?php echo addslashes($event_name); ?>";

  function toggleLoader(show, text = "LOADING STREAM...") {
    if (show) {
      document.querySelector('.loading-text').textContent = text;
      loader.classList.remove('opacity-0', 'pointer-events-none');
      loader.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      loader.classList.remove('opacity-100', 'pointer-events-auto');
      loader.classList.add('opacity-0', 'pointer-events-none');
    }
  }

  function showUnmuteButton() {
    unmuteBtn.classList.remove('hidden');
    unmuteBtn.classList.add('block');
  }

  function hideUnmuteButton() {
    unmuteBtn.classList.remove('block');
    unmuteBtn.classList.add('hidden');
  }

  function parseDRM(drmStr) {
    if (!drmStr || !drmStr.includes(':')) return null;
    const parts = drmStr.split(':');
    let drmObj = {};
    drmObj[parts[0].trim().toLowerCase()] = parts[1].trim().toLowerCase();
    return drmObj;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    toggleLoader(true, "LOADING STREAM...");

    // Switch to JWPlayer
    document.getElementById("jw-button").onclick = () => {
      const p = encodeURIComponent;
      window.location.href = `jwplayer.php?url=${p(rawUrl)}&drm=${p(rawDrm)}&title=${p(eventName)}`;
    };

    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      alert("Browser not supported");
      return;
    }

    const video = document.getElementById("video");
    const uiContainer = document.getElementById("controls");
    const player = new shaka.Player(video);
    const ui = new shaka.ui.Overlay(player, uiContainer, video);

    ui.configure({
      controlPanelElements: ["play_pause", "time_and_duration", "spacer", "mute", "volume", "quality", "fullscreen", "picture_in_picture"]
    });

    const playerConfig = {
      streaming: {
        bufferingGoal: 30,
        rebufferingGoal: 5,
        retryParameters: { timeout: 15000, maxAttempts: 3, baseDelay: 500, backoffFactor: 1.5 }
      }
    };

    const parsedDrm = parseDRM(rawDrm);
    if (parsedDrm) {
      playerConfig.drm = { clearKeys: parsedDrm };
    }

    player.configure(playerConfig);

    player.addEventListener('buffering', (event) => {
      toggleLoader(event.buffering, "BUFFERING...");
    });

    const handleResize = () => {
      window.requestAnimationFrame(() => {
        video.style.width = '100%';
        video.style.height = '100%';
      });
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
      document.addEventListener(evt, () => {
        handleResize();
        setTimeout(handleResize, 50);
        setTimeout(handleResize, 300);
      });
    });

    try {
      await player.load(rawUrl);
      toggleLoader(false);

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (video.muted) showUnmuteButton();
        }).catch(() => {
          showUnmuteButton();
        });
      }
    } catch (error) {
      console.error("Shaka error:", error);
      toggleLoader(false);
    }

    unmuteBtn.addEventListener('click', () => {
      video.muted = false;
      video.play();
      hideUnmuteButton();
    });

    video.addEventListener('volumechange', () => {
      if (!video.muted) hideUnmuteButton();
    });
  });
</script>

</body>
</html>