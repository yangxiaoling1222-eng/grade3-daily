const CACHE_NAME = 'grade3-daily-v1';
const ASSETS = [
  '/grade3-daily/',
  '/grade3-daily/index.html',
  '/grade3-daily/manifest.json',
  '/grade3-daily/icon-192.png',
  '/grade3-daily/icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).catch(function(){})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
