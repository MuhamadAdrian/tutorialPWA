const staticCacheName = 'site-static-v4';
const dynamicCache = 'site-dynamic-v5';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/style.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
]

//cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

//install events
self.addEventListener('install', event => {
    //console.log('SW has been installed')
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function(cache){
            console.log('caching assets')
            cache.addAll(assets)
        })
    )
})

//actiate events
self.addEventListener('activate', event => {
    //console.log('SW has been activated')
    event.waitUntil(
        caches.keys().then(response => {
            //console.log(response)
            return Promise.all(
                response.filter(key => key !== staticCacheName && key !== dynamicCache).map(key => caches.delete(key))
            )
        })
    )
})

//fetch events
self.addEventListener('fetch', event => {
    //console.log('fetch events', event)
    if (event.request.url.indexOf('firestore.googleapis.com') === -1) {
        event.respondWith(
            caches.match(event.request).then(function(cacheRes){
                if (cacheRes) {        
                    return cacheRes
                }
                    return fetch(event.request).then(fetchRes => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(event.request.url, fetchRes.clone())
                        limitCacheSize(dynamicCache, 15)
                        return fetchRes
                    })
                })
            }).catch(()=>{
                if (event.request.url.indexOf('.html') > -1) {
                    
                    return caches.match('/pages/fallback.html')
                }
            })
        ) 
    }
   
})