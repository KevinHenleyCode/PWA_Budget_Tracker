const cacheName = 'v1'
const cacheFiles = [
  '/',
  'index.js',
  'index.html',
  'style.css',
]


self.addEventListener('install', function(e) {
    console.log('Service worker is working');

    e.waitUntil(
        caches.open(cacheName)
        .then(function (cache) {  
            console.log('Caching files')
            return cache.addAll(cacheFiles)
        })
    )
})

self.addEventListener('acrive', function(e) {
    console.log('Service worker is now activated')

    e.waitUntil(
        caches.keys()
        .then(function (cacheNames) {  
            return Promise.all(cacheNames.map(function (thisCacheName) {
                if (thisCacheName !== cacheName) {
                    console.log('Removing files from cache')
                    return caches.delete(thisCacheName)
                } 
            }))
        })
    )
})

self.addEventListener('fetch', function (e) {
    console.log('Service worker is now fetching', e.request.url)
    e.respondWith(
        caches.match(e.request)
        .then(function(response){
            if (response) {
                console.log(e.request.url)
                return response
            }

            const reqClone = e.request.clone()

            fetch(reqClone)
            .then(function (responce) {  
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