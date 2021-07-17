const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";


const FILES_TO_CACHE = [
  '/',
  'index.js',
  'index.html',
  'styles.css',
  'db.js'
]


console.log('The Service Worker is up and running!');


self.addEventListener("install", function(evt) {
  evt.waitUntil(caches.open(DATA_CACHE_NAME).then((cache) => cache.add('/api/transaction')))
  evt.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)))
  self.skipWaiting()
})

self.addEventListener("activate", function(evt) {
  evt.waitUntil(caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Deleting cache", key)
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener("fetch", function(evt) {
  if (evt.request.url.includes("/api")) {
    evt.respondWith(caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request).then(res => {
            if (res.status === 200) {cache.put(evt.request.url, res.clone())}
            return res
          }).catch(err => {
            return cache.match(evt.request);
          })
      }).catch(err => console.log(`This is the error ${err}`)))
    return
  }
  evt.respondWith(caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(res => {
        return res || fetch(evt.request)
      })
    })
  )
})