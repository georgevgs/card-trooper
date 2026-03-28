const CACHE_NAME = 'card-trooper-cache-v4';
const DYNAMIC_CACHE_NAME = 'card-trooper-dynamic-cache-v4';

const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon/favicon.ico',
  '/favicon/apple-touch-icon.png',
  // 3D icons (Vercel blob CDN) — precached so they work offline
  'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-r5QxxRu1dvIND6CpaRBYLTnJmCfzNM.png',
  'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-BwCpmJXm80olWn4SbwsWSCKjFch3nc.png',
  'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-hheqtvAvZLesg9WYTVCosfDrtUtC7H.png',
  'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-1kzlhXN3lasEQYBtwdeQrzzhBEwurX.png',
  'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-ptreaSKDFQqhY7oF7Qw6s18YOwh68e.png',
  'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-wNxdFQYtpHI7REu4Ulzsvi37XAhYH4.png',
  'https://lftz25oez4aqbxpq.public.blob.vercel-storage.com/image-6RTw7Ifo1xhDr9ETjDBjMGv5S5YzTi.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        urlsToCache.map((url) =>
          cache.add(url).catch((err) => console.error('Failed to cache:', url, err)),
        ),
      );
    }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never intercept API or auth requests — let the browser handle them
  // natively with full cookie/credential support.
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  if (!url.protocol.startsWith('http')) {
    return;
  }

  if (event.request.method !== 'GET') {
    return;
  }

  // Navigation requests (HTML): network-first for fresh content
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cached) => cached || caches.match('/offline.html'));
        }),
    );
    return;
  }

  // All other assets (JS, CSS, images, fonts): cache-first
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((fetchResponse) => {
          if (
            !fetchResponse ||
            fetchResponse.status !== 200 ||
            (fetchResponse.type !== 'basic' && fetchResponse.type !== 'cors')
          ) {
            return fetchResponse;
          }

          const responseToCache = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return fetchResponse;
        });
      })
      .catch(() => {
        // Asset failed to load and not in cache — fail silently
      }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
