const runTime = 'runtime'
const preCache = 'precache-v1'
const cacheFiles = [
  '/',
  'index.js',
  'index.html',
  'style.css',
]


console.log('Service worker up and running!');


self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(preCache).then((caches) => caches.addAll(cacheFiles)).then(self.skipWaiting()))
})


self.addEventListener('activate', (e) => {
  const currentCaches = [preCache, runTime]
  
  e.waitUntil(caches.keys().then((cacheNames) => {
        
    return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))})
    .then((cachesToDelete) => {

    return Promise.all(cachesToDelete.map((cacheToDelete) => {return caches.delete(cacheToDelete)}))})
    .then(() => self.clients.claim()))
})


self.addEventListener('fetch', (e) => {
  if (e.req.url.startsWith(self.location.origin)) {
    e.respondWith(caches.match(e.req).then((res) => {
        
        if (res) {
          return response;
        }

        return caches.open(runTime).then((cache) => {
          return fetch(e.req).then((res) => {
            return cache.put(e.req, res.clone()).then(() => {
              return res
            })
          })
        })
      })
    )
  }
})