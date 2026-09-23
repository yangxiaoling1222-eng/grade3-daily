const CACHE_NAME = 'grade3-daily-v2';
const ASSETS = [
  '/grade3-daily/',
  '/grade3-daily/index.html',
  '/grade3-daily/manifest.webmanifest',
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
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        if (k !== CACHE_NAME) return caches.delete(k);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  var req = e.request;
  // 页面：优先网络，保证每次打开都是最新版；离线时回退缓存
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).then(function(res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put('/grade3-daily/index.html', copy); });
        return res;
      }).catch(function() {
        return caches.match('/grade3-daily/index.html') || caches.match('/grade3-daily/');
      })
    );
    return;
  }
  // 静态资源：优先缓存
  e.respondWith(
    caches.match(req).then(function(res) {
      return res || fetch(req).then(function(r2) {
        var copy = r2.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(req, copy); });
        return r2;
      });
    })
  );
});
