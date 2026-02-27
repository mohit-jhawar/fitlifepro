// ─── Cache Version ────────────────────────────────────────────────────────────
// Bump this number every deploy to wipe old caches automatically.
const CACHE_VERSION = 'v5';
const CACHE_NAME = `fitlife-cache-${CACHE_VERSION}`;
const API_CACHE_NAME = `fitlife-api-cache-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `fitlife-static-cache-${CACHE_VERSION}`;

// Only truly static files that never change between deploys.
const IMMUTABLE_ASSETS = [
  '/favicon.png',
  '/manifest.json',
  '/assets/images/fitlife-logo.png',
];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(IMMUTABLE_ASSETS))
      .then(() => self.skipWaiting())   // Activate immediately, don't wait for old SW to die
      .catch((err) => console.warn('[SW] Pre-cache failed:', err))
  );
});

// ─── Activate ─────────────────────────────────────────────────────────────────
// Delete ALL old caches (any cache whose name doesn't match current version).
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.endsWith(CACHE_VERSION))
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())  // Take control of all open tabs immediately
  );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and non-http(s)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // ── 1. API calls → Network First (always fresh data, fallback to cache offline)
  if (url.href.includes('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE_NAME));
    return;
  }

  // ── 2. External APIs (OpenFoodFacts, etc.) → Network First, no cache fallback
  if (url.hostname !== self.location.hostname) {
    event.respondWith(networkOnly(request));
    return;
  }

  // ── 3. Navigation (HTML page loads) → Network First → fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the latest HTML
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // ── 4. JS / CSS bundles → Network First (CRITICAL: ensures latest code always loads)
  //    These are hashed by CRA so technically immutable per filename,
  //    but Network First ensures new filenames referencing new bundles always load.
  if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(networkFirst(request, CACHE_NAME));
    return;
  }

  // ── 5. Images & fonts → Cache First (genuinely static, safe to cache long-term)
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|ico)$/)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }

  // ── 6. Everything else → Network First
  event.respondWith(networkFirst(request, CACHE_NAME));
});

// ─── Strategy: Network First ──────────────────────────────────────────────────
// Try network → on success update cache → on failure serve cache → last resort 503
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok || response.status === 0) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    // If it's a JS/CSS file and we're offline, return empty so the app gracefully fails
    if (request.url.match(/\.(js|css)$/)) {
      return new Response('', { status: 503, statusText: 'Offline' });
    }
    return new Response(
      JSON.stringify({ offline: true, error: 'You are offline.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ─── Strategy: Cache First ────────────────────────────────────────────────────
// Serve from cache → on miss fetch & cache → on network error return 503
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

// ─── Strategy: Network Only ───────────────────────────────────────────────────
// Always hit network, never cache (for external 3rd party APIs)
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch {
    return new Response(
      JSON.stringify({ offline: true, error: 'External service unavailable offline.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ─── Auto-reload on SW update ─────────────────────────────────────────────────
// When this SW takes control, tell all open tabs to reload so they get fresh app code.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
