const runTime = 'runtime'
const preCache = 'precache-v1'


const cacheFiles = [
  '/',
  'index.js',
  'index.html',
  'style.css',
]


console.log('The Service Worker is up and running!');


self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(preCache).then((caches) => caches.addAll(cacheFiles)).then(self.skipWaiting()))
})


self.addEventListener('activate', (e) => {
  const currentCaches = [preCache, runTime]
  e.waitUntil(caches.keys().then((cacheNames) => {
    return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))}).then((cachesToDelete) => {
    return Promise.all(cachesToDelete.map((cacheToDelete) => {return caches.delete(cacheToDelete)}))}).then(() => self.clients.claim()))
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


self.addEventListener('fetch', function (e) {
    console.log('Service worker is now fetching', e.request.url)
    e.respondWith(caches.match(e.request).then(function(response){
            
            if (response) {
                console.log(e.request.url)
                return response
            }

            const reqClone = e.request.clone()

            fetch(reqClone).then(function (responce) {  
                
                if (!responce) {
                    console.log('fetch has not responded')
                    return responce
                }

                const respClone = responce.clone()

                caches.open(cacheName).then(function(cache){
                    cache.put(e.request, respClone)
                    return responce
                })
            })
            
            .catch(function(error) {
                console.log('There was an error', error);
            })
        })
    )
})