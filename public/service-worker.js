const CACHE_NAME = 'card-trooper-cache-v1';
const DYNAMIC_CACHE_NAME = 'card-trooper-dynamic-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/styles.css',
  '/assets/main.js',
  '/favicon/favicon.ico',
  '/favicon/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened');
      return Promise.allSettled(
        urlsToCache.map((url) =>
          cache.add(url).catch((err) => console.error('Failed to cache:', url, err)),
        ),
      );
    }),
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch event for ', event.request.url);

  if (
    event.request.url.startsWith('chrome-extension://') ||
    event.request.url.includes('extension://')
  ) {
    return; // Ignore chrome-extension and other extension requests
  }

  if (event.request.method !== 'GET') {
    // For non-GET requests, go to the network
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.url.includes('/api/')) {
    // For API GET requests, try the network first, then fall back to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response because we're going to use it twice
          const responseToCache = response.clone();

          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        }),
    );
  } else {
    // For non-API requests, try the cache first, then fall back to network
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          if (response) {
            return response; // If found in cache, return the cached version
          }

          // If not in cache, fetch from network
          return fetch(event.request).then((fetchResponse) => {
            // Check if we received a valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response because we're going to use it twice
            const responseToCache = fetchResponse.clone();

            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return fetchResponse;
          });
        })
        .catch(() => {
          // If both cache and network fail, show an offline page for navigate requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        }),
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
