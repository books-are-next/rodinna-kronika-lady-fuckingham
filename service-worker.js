/* eslint-disable no-restricted-globals */

/* global self, caches, fetch */

const CACHE = 'cache-dd7c206';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./z_rodinne_kroniky_lady_fuckingham_001.html","./z_rodinne_kroniky_lady_fuckingham_002.html","./z_rodinne_kroniky_lady_fuckingham_003.html","./z_rodinne_kroniky_lady_fuckingham_004.html","./z_rodinne_kroniky_lady_fuckingham_005.html","./z_rodinne_kroniky_lady_fuckingham_006.html","./z_rodinne_kroniky_lady_fuckingham_007.html","./z_rodinne_kroniky_lady_fuckingham_008.html","./z_rodinne_kroniky_lady_fuckingham_009.html","./z_rodinne_kroniky_lady_fuckingham_010.html","./z_rodinne_kroniky_lady_fuckingham_011.html","./z_rodinne_kroniky_lady_fuckingham_012.html","./z_rodinne_kroniky_lady_fuckingham_013.html","./z_rodinne_kroniky_lady_fuckingham_014.html","./z_rodinne_kroniky_lady_fuckingham_015.html","./fonts/Literata-Italic-var.woff2","./fonts/Literata-var.woff2","./fonts/LiterataTT-TextItalic.woff2","./fonts/LiterataTT-TextRegular.woff2","./fonts/LiterataTT-TextSemibold.woff2","./fonts/LiterataTT_LICENSE.txt","./fonts/SpaceGroteskVF.woff2","./fonts/SpaceGroteskVF_LICENSE.txt","./resources/image001.jpg","./resources/image002.jpg","./resources/obalka_z_rodinne_kroniky_lady_fuckingham.jpg","./resources/upoutavka_eknihy.jpg","./scripts/bundle.js","./template-images/circles.png","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
