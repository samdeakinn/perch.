const CACHE = 'perch-v1';
const PRECACHE = ['/', '/style.css', '/demo.js', '/particles.js', '/favicon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
      const ct = response.headers.get('Content-Type') || '';
      if (ct.includes('text') || ct.includes('font') || ct.includes('image') || ct.includes('javascript') || ct.includes('css')) {
        const copy = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return response;
    }))
  );
});