//------------PROGRAMACION PRINCIPAL DE SERVICE WORKER-----------------------

const { cache } = require("react");

// Asignar nombre y version de cache
const CACHE_NAME= 'v1.2_cache_Mariana_Muñoz_PWA';

//Ficheros a cachear en la App
var urlsTocCache=[
    './',
    './index.html',
    './manifest.json',
    './recetas.css',
    './sw.js',
    './main.js'
    

];

//------------------------------------Evento de instalacion: cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        self.skipWaiting();
      })
      .catch(err => {
        console.log('Error al cachear', err);
      })
  );
});

//siempre usas rutas relativas (./archivo.html, ./css/styles.css),
//no absolutas (http://...)

//cada vez que actualices archivos importantes, cambia la version del cache (v2_cache_...) para que el navegador descargue la nueva version

//-----------------------------Evento de activacion: limpiar cache antiguo--------------

self.addEventListener('activate', e =>{ // el evento activate se activa cuando el service worker toma el control
    const cachewhitelist = [CACHE_NAME]; //lista blanca de cache que deben conservarse
    e.waitUntil( //waitUntil() asegura que el service worker no se considere activo hasta que la promesa dentro de el se resuelva
        caches.keys() //obtiene todas las claves (nombres) de las caches existentes
        .then(cacheNames => { //una vez que se obtienen las claves se ejecuta esta funcion
            return Promise.all( //promise.all() espera que todas las promesas dentro del array se resuelvan
                cacheNames.map(cacheName => { //itera sobre cada nombre de cache
                    if (cachewhitelist.indexOf(cacheName) === -1) { //si el nombre de la cache no esta en la lista blanca...
                        return caches.delete(cacheName); //...elimina esa cache
                    }
                })
            ); 
        })
        .then(() => {
            self.clients.claim() //hace que el serive worker tome el control de todas las paginas bajo
        })
    );
});

//----------------Evento fetch: responder con cache o red----------------
self.addEventListener('fetch', e => { // el evento fetch se activa para cada solicitud 
    e.repondWith( //repondWith() permite al servidor worker proporcionar una respuesta
        caches.match(e.request) //busca en la cache una respuesta que coincidacon la 
        .then(res => { //una vez que se obtiene la respuesta de la cache (si existe)
            if (res) { //si se encontro una respuesta en la cache...
                return res; //...devuelvela
            }
            return fetch(e.request); //si no se encontro en la cache, realizala la
        })
    );
});

//-----------------fin programacion principal de service worker---------------------
self.addEventListener('message', event => {
    if (event.data.action === 'skipWainting'){
        self.skipWainting();
    }
});



