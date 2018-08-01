var CACHE_NAME = 'neighborhood-map-cache-v1';
var urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/fb_logo.svg',
  '/www_logo.svg',
  '/places.json',
  '/src/App.css',
  '/src/App.js',
  '/src/Map.js',
  '/src/PlacesList.js',
  '/src/QueryBox.js',
  '/src/DBHelper.js',
  '/src/FoursquareAPI.js',
  '/src/index.js',
  '/src/index.css',
  '/src/NytApi.js',
  '/src/UnsplashAPI.js',
  '/src/sw_support.js'
];


self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        //console.log('Service Worker: opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  //console.log('Service Worker: in fetch event handler');
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // response found in cache - return it
        if (response) {
          //console.log('Service Worker: served response from cache');
          return response;
        }

        // Cloning the request stream in order to
        // provide it both to cache and browser.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              //console.log('Service Worker: response received, but with issue. Not to be cached.');
              return response;
            }
            // Cloning the response stream in order to
            // provide it both to browser and to cache.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                //console.log('Service Worker: response received, to be cached');
                cache.put(event.request, responseToCache);
              })
              .catch(err => console.log(err));
            return response;
          }
        ).catch(function(error){
          //console.log('Service Worker: could not download data.');
          return new Response('Service Worker: could not load data. Possibly network outage. Please try again later.');
        });
      }).catch(function(){
        //console.log('Service Worker: the cache.match promise failed');
      })
    );
});
