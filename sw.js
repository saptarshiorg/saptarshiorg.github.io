/* EVORA service worker — same-origin app files are served from cache instantly,
   then refreshed in the background (stale-while-revalidate). Bump VER to force an update. */
const VER = 'evora-v4';
const SHELL = ['/', '/movies', '/tv', '/live', '/sports', '/search', '/play', '/player',
  'script.js', 'api.js', 'config.js', 'boot.js', 'pages.js', 'style.css', 'theme-dark.css',
  'evora-mark.png', 'evora-icon.png', 'evora-logo.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;     /* sheets / APIs / embeds untouched */
  e.respondWith(caches.open(VER).then(async c => {
    const hit = await c.match(r, { ignoreSearch: r.mode === 'navigate' });
    const net = fetch(r).then(res => { if (res && res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
