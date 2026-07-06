const CACHE = 'perch-v8';
const PRECACHE = [
  '/', '/style.css', '/demo.js',
  '/favicon.svg', '/manifest.json',
  '/problem', '/how-it-works', '/pricing', '/demo',
  '/404', '/download', '/digest'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(
        PRECACHE.map(url =>
          fetch(url).then(r => {
            if (r.ok) c.put(url, r);
          }).catch(() => {})
        )
      );
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // API calls — network only (no cache)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // HTML navigation — network-first with offline fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      }).catch(async () => {
        const cached = await caches.match(e.request);
        return cached || caches.match('/');
      })
    );
    return;
  }

  // Static assets — cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      });
    })
  );
});
