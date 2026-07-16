const CACHE_NAME = 'card-trooper-cache-v7';
const DYNAMIC_CACHE_NAME = 'card-trooper-dynamic-cache-v7';

// How long a navigation waits for the network before falling back to the
// cached shell — keeps flaky connections (lie-fi) from blocking startup.
const NAV_TIMEOUT_MS = 2000;

const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon/favicon.ico',
  '/favicon/apple-touch-icon.png',
  '/logo/favicon.svg',
  '/icons/wallet.png',
  '/icons/qr-code.png',
  '/fonts/manrope-latin.woff2',
  '/fonts/manrope-latin-ext.woff2',
  '/fonts/manrope-greek.woff2',
];

// Precache the hashed bundles referenced by the app shell, so the app works
// offline after the very first visit (the initial page load's asset requests
// race service-worker activation and would otherwise miss the cache).
async function precacheShellAssets(cache) {
  try {
    const shell = await cache.match('/');
    if (!shell) return;
    const html = await shell.clone().text();
    const assets = new Set(html.match(/\/_astro\/[^"']+/g) || []);
    await Promise.allSettled([...assets].map((url) => cache.add(url)));

    // The entry modules statically import hashed chunks that never appear in
    // the HTML — scan one level of `import "./chunk.js"` specifiers so those
    // are precached too.
    for (const url of [...assets].filter((u) => u.endsWith('.js'))) {
      const res = await cache.match(url);
      if (!res) continue;
      const js = await res.clone().text();
      const deps = [...new Set(js.match(/["']\.\/[^"']+\.js["']/g) || [])]
        .map((m) => `/_astro/${m.slice(3, -1)}`)
        .filter((d) => !assets.has(d));
      await Promise.allSettled(deps.map((d) => cache.add(d)));
    }
  } catch {
    // Best effort — assets still get cached on use by the fetch handler
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        await Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch((err) => console.error('Failed to cache:', url, err)),
          ),
        );
        await precacheShellAssets(cache);
      }),
  );
  // No skipWaiting() here — the app shows an update banner and the new worker
  // activates only when the user accepts (SKIP_WAITING message below).
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Navigations (HTML): network-first with a short timeout, so online loads stay
// fresh while offline/flaky loads fall back to the cached shell instantly.
async function handleNavigation(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NAV_TIMEOUT_MS);
  try {
    // Fetch by URL: passing an init alongside a navigate-mode Request throws in Safari
    const response = await fetch(request.url, { signal: controller.signal });
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = (await caches.match(request)) || (await caches.match('/'));
    return cached || caches.match('/offline.html');
  } finally {
    clearTimeout(timer);
  }
}

// Static assets (hashed JS/CSS, images, fonts): cache-first — they never
// change under the same URL.
async function handleAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  // Never intercept API or auth requests — let the browser handle them
  // natively with full cookie/credential support.
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  event.respondWith(handleAsset(request));
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
