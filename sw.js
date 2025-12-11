/// ------------------------
// SERVICE WORKER PWA RECETARIO
// ------------------------

// Nombre del caché (cámbialo cuando actualices archivos)
const CACHE_NAME = 'v1.3_cache_recetario';

// Archivos a cachear
const urlsToCache = [
    './',
    './index.html',
    './recetas.css',
    './main.js',
    './manifest.json',
    './imagenes/fav.png'
];

// ---------------------------
// INSTALACIÓN: Cachear archivos
// ---------------------------
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
            .catch(err => console.log('❌ Error durante la instalación del SW:', err))
    );
});

// ---------------------------
// ACTIVACIÓN: Limpiar cachés viejos
// ---------------------------
self.addEventListener('activate', event => {
    const whiteList = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (!whiteList.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// ---------------------------
// FETCH: Respuesta con caché o red
// ---------------------------
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(res => res || fetch(event.request))
    );
});

// ---------------------------
// Notificaciones Push Locales
// ---------------------------
self.addEventListener('push', e => {
    const data = e.data ? e.data.json() : {};

    self.registration.showNotification(data.title || "Notificación", {
        body: data.body || "",
        
       
    });
});

// ---------------------------
// Eventos del SW
// ---------------------------
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});