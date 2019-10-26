//var dataCacheName = 'connect4-org-v1';
var cacheName = 'connect4-org-v1';
var precacheResources = [
  '/',
  '/offline.html',
  '/Ads.js',
  '/AI.js',
  '/Board.js',
  '/Game.js',
  '/Menu.js',
  '/Player.js',
  '/Tile.js',
  '/UI.js',
  '/Window.js',
  '/resources/style.css',
  '/resources/images/crown.png',
  '/resources/images/add.png',
  '/resources/images/sub.png',
  '/resources/images/AI_Disabled.png',
  '/resources/images/AI_Enabled.png',
  '/resources/images/icons/android-icon-36x36.png',
  '/resources/images/icons/android-icon-48x48.png',
  '/resources/images/icons/android-icon-72x72.png',
  '/resources/images/icons/android-icon-96x96.png',
  '/resources/images/icons/android-icon-144x144.png',
  '/resources/images/icons/android-icon-192x192.png',
  '/resources/images/icons/android-icon-512x512.png',
  '/resources/images/icons/apple-icon-57x57.png',
  '/resources/images/icons/apple-icon-60x60.png',
  '/resources/images/icons/apple-icon-72x72.png',
  '/resources/images/icons/apple-icon-76x76.png',
  '/resources/images/icons/apple-icon-114x114.png',
  '/resources/images/icons/apple-icon-120x120.png',
  '/resources/images/icons/apple-icon-144x144.png',
  '/resources/images/icons/apple-icon-152x152.png',
  '/resources/images/icons/apple-icon-180x180.png',
  '/resources/images/icons/apple-icon-precomposed.png',
  '/resources/images/icons/apple-icon.png',
  '/resources/images/icons/browserconfig.xml',
  '/resources/images/icons/favicon-16x16.png',
  '/resources/images/icons/favicon-32x32.png',
  '/resources/images/icons/favicon-96x96.png',
  '/resources/images/icons/favicon.ico',
  '/resources/images/icons/ms-icon-70x70.png',
  '/resources/images/icons/ms-icon-144x144.png',
  '/resources/images/icons/ms-icon-150x150.png',
  '/resources/images/icons/ms-icon-310x310.png',

  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/p5.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.dom.min.js',
  'https://fonts.googleapis.com/css?family=Roboto'
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});
