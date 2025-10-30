const CACHE_NAME = 'mindful-morsel-cache-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/metadata.json',
  
  // Add all app source files for offline functionality
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/services/analysis.ts',
  '/components/EmotionalLog.tsx',
  '/components/FirstAidKit.tsx',
  '/components/Insights.tsx',
  '/components/Journal.tsx',
  
  // PWA assets
  '/pwa-assets/icon-192x192.png',
  '/pwa-assets/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});