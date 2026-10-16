const CACHE_NAME = 'mindsprintai-cache-v65';
const MATH_FONTS = [
  'AMS-Regular', 'Caligraphic-Bold', 'Caligraphic-Regular', 'Fraktur-Bold', 'Fraktur-Regular',
  'Main-Bold', 'Main-BoldItalic', 'Main-Italic', 'Main-Regular', 'Math-BoldItalic', 'Math-Italic',
  'SansSerif-Bold', 'SansSerif-Italic', 'SansSerif-Regular', 'Script-Regular',
  'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular', 'Typewriter-Regular'
];
const ASSETS = [
  './',
  './index.html',
  './tokens.css?v=39',
  './style.css?v=63',
  './ui-refresh.css?v=2',
  './script.js?v=63',
  './ui.js?v=59',
  './vocab_data.js?v=24',
  './api.js?v=56',
  './kanban.js?v=54',
  './kanban.css?v=54',
  './auth.js?v=43',
  './dialogs.js?v=45',
  './notebook.js?v=62',
  './text-renderer.js?v=33',
  './vendor/katex/katex.min.css',
  './vendor/katex/katex.min.js',
  './vendor/katex/contrib/auto-render.min.js',
  ...MATH_FONTS.map(name => `./vendor/katex/fonts/KaTeX_${name}.woff2`),
  './manifest.json',
  './icon-192.jpg',
  './icon-512.jpg',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if ((key.startsWith('mindsprint-cache-') || key.startsWith('mindsprintai-cache-')) && key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Service Worker
self.addEventListener('fetch', (e) => {
  if (new URL(e.request.url).origin === 'https://accounts.google.com') return;
  if (e.request.url.includes('/api/')) return; // luôn gọi mạng cho API
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isAppFile = url.origin === self.location.origin &&
    (e.request.mode === 'navigate' || /\.(html|js|css)$/.test(url.pathname));
  if (isAppFile) {
    e.respondWith(
      fetch(e.request).then((response) => {
        if (response.ok) {
          e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(e.request, response.clone())));
        }
        return response;
      }).catch(async (error) => {
        const cached = await caches.match(e.request);
        if (cached) return cached;
        if (e.request.mode === 'navigate') {
          const offlinePage = await caches.match('./index.html');
          if (offlinePage) return offlinePage;
        }
        throw error;
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).then((networkResponse) => {
        if (e.request.url.startsWith(self.location.origin) && e.request.method === 'GET') {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      if ((e.request.headers.get('accept') || '').includes('text/html')) {
        return caches.match('./index.html');
      }
    })
  );
});

// Handle Notification Clicks (Focus web app & handle action buttons)
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  
  let targetUrl = './index.html';
  if (e.action === 'disable') {
    targetUrl = './index.html?action=disable-notifications';
  }
  
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('navigate' in client && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
