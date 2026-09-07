const CACHE_NAME = 'sinavsaatin-v8';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Always network-first for API calls; return offline JSON on failure
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'Çevrimdışı mod' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  if (event.request.method !== 'GET') return;

  // Network-first for HTML — always fetch fresh index.html on deploy
    if (url.pathname === '/' || url.pathname.endsWith('.html') || !url.pathname.match(/\.\w{2,5}$/)) {
      event.respondWith(
        fetch(event.request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        }).catch(() =>
          caches.match(event.request)
            .then((r) => r || caches.match('/index.html'))
            .then((r) => r || new Response('Çevrimdışı', {status:503,headers:{'Content-Type':'text/plain'}}))
        )
      );
      return;
    }

      // Network-first for JS/CSS assets — ensures fresh files after every deploy
    if (url.pathname.match(/\.(js|css|mjs)$/)) {
      event.respondWith(
        fetch(event.request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        }).catch(() => caches.match(event.request).then((r) => r || new Response('',{status:503})))
      );
      return;
    }

      // Cache-first for static assets, stale-while-revalidate for pages
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      });
      return cached || fetchPromise;
    })
  );
});

// ── Push notification received ────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'SınavSaatin', body: event.data.text(), url: '/' };
  }

  const title = payload.title || 'SınavSaatin';
  const options = {
    body: payload.body || '',
    icon: '/icon-192.svg',
    badge: '/favicon.svg',
    data: { url: payload.url || '/' },
    tag: payload.tag || 'sinavsaatin-notification',
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    Promise.all([
      // 1) OS bildirimini göster
      self.registration.showNotification(title, options),
      // 2) Açık sekmelere in-app toast için mesaj gönder
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PUSH_RECEIVED',
            title,
            body: options.body,
            url: payload.url || '/',
          });
        });
      }),
    ])
  );
});

// ── Notification clicked ──────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus an existing tab if one is already open on this origin
      for (const client of clients) {
        const clientUrl = new URL(client.url);
        if (clientUrl.origin === self.location.origin) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open a new tab
      return self.clients.openWindow(targetUrl);
    })
  );
});
