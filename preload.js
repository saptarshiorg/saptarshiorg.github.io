// Exposes the same window.EVStreamsNative.openInVlc(url) bridge the Android
// app provides, so any page button written for the Android app works
// unmodified in the desktop app too:
//
//   if (window.EVStreamsNative) {
//     window.EVStreamsNative.openInVlc(streamUrl);
//   }

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('EVStreamsNative', {
  openInVlc: (url) => ipcRenderer.send('evstreams-open-in-vlc', url)
});
