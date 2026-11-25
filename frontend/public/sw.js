// Mandalink service worker: just enough for "Install app" in Chrome, and for the app shell to open offline.
// It caches the app shell and this site's own static files only. Requests to the backend API (a different
// origin, or anything under /api/) are never cached: they always go straight to the network.
// The version comes from the registration URL (sw.js?v=<build id>), so every deploy installs a fresh worker,
// which deletes the previous version's cache.
const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE = 'mandalink-' + VERSION;
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/logo.png', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'];
const STATIC = /\.(?:js|css|png|jpe?g|svg|webp|gif|ico|woff2?|ttf|webmanifest)$/i;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('mandalink-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // the backend (another origin), Google sign-in, fonts and anything else off-site: straight to the network
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.well-known/') || url.pathname === '/sw.js') return;

  // pages: network first, so a deploy shows up at once; the cached shell only when offline
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/index.html').then(r => r || caches.match('/'))));
    return;
  }

  // the site's own static files: cache first (built files have hashed names, so they never go stale)
  if (STATIC.test(url.pathname)) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
