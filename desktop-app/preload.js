// Exposes the same window.EVStreamsNative.openInVlc(url) bridge the Android
// app provides, so any page button written for the Android app works
// unmodified in the desktop app too:
//
//   if (window.EVStreamsNative) {
//     window.EVStreamsNative.openInVlc(streamUrl);
//   }

// Also exposes window.EVStreamsNative.cast for Chromecast:
//
//   const { supported, devices } = await window.EVStreamsNative.cast.listDevices();
//   await window.EVStreamsNative.cast.play(devices[0].host, streamUrl);
//   await window.EVStreamsNative.cast.stop(devices[0].host);
//
// listDevices() can return an empty list right after launch — discovery
// takes a few seconds. supported is false only if the Chromecast module
// failed to load entirely (e.g. a broken install).
//
// And window.EVStreamsNative.streams for links sniffed from network
// requests — including ones from third-party embeds/iframes, not just
// evstreams.pages.dev itself:
//
//   const links = await window.EVStreamsNative.streams.list();
//   // [{ url, host, ts }, ...] most recent first, cleared on page navigation
//   const stop = window.EVStreamsNative.streams.onDetected((entry) => { ... });
//   // stop() to unsubscribe
//
// window.EVStreamsNative.copyText(str) copies to the system clipboard and
// returns { ok, error? } — use it for a "Copy link" button on any detected
// stream or cast device.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('EVStreamsNative', {
  openInVlc: (url) => ipcRenderer.send('evstreams-open-in-vlc', url),
  copyText: (text) => ipcRenderer.invoke('evstreams-copy-text', text),
  cast: {
    listDevices: () => ipcRenderer.invoke('evstreams-cast-list'),
    play: (host, url) => ipcRenderer.invoke('evstreams-cast-play', host, url),
    stop: (host) => ipcRenderer.invoke('evstreams-cast-stop', host)
  },
  streams: {
    list: () => ipcRenderer.invoke('evstreams-streams-list'),
    onDetected: (callback) => {
      const listener = (event, entry) => callback(entry);
      ipcRenderer.on('evstreams-stream-detected', listener);
      return () => ipcRenderer.removeListener('evstreams-stream-detected', listener);
    }
  }
});
