const CACHE_NAME = 'rcp-services-v27-mascot';
const ASSETS_TO_CACHE = [
  './',
  './nosotros/',
  './media/',
  './carreras/',
  './servicios/',
  './diagnostico/',
  './checkout/',
  './portal/',
  './styles.css',
  './script.js',
  './icono-rcp.png',
  './Logo RCP  fondo negro.png',
  './Logo RCP Services.png',
  './logo-rcp-master.svg',
  './assets/brand/mascot/rcp-mascot-presenter.png',
  './QR RCP.png',
  './manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA Service Worker] Caching all static assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event (Cache Busting)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[PWA Service Worker] Clearing old cache: ', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: network-first for pages, stale-while-revalidate for static assets.
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS protocols (avoid chrome-extension etc.)
  const isSupabaseAsset = event.request.url.includes('supabase.co/storage/v1/object/public/');
  if (!event.request.url.startsWith(self.location.origin) && !isSupabaseAsset) return;

  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request).then((cachedResponse) => cachedResponse || caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update to keep cache fresh
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch((err) => console.log('[PWA Service Worker] Background fetch failed (probably offline):', err));
        
        return cachedResponse;
      }

      // Network Fallback
      return fetch(event.request).then((networkResponse) => {
        const isAllowedType = networkResponse.type === 'basic' || networkResponse.type === 'cors';
        if (!networkResponse || networkResponse.status !== 200 || !isAllowedType) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
