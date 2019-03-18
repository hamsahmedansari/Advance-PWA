var STATIC_CACHE = "static-v4";
var DYNAMIC_CACHE = "dynamic-v1";
// install
self.addEventListener("install", e => {
  console.log("[Service Worker] is installing ...", e);
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log("[Service Worker] PreCaching is Start");
      cache.addAll([
        "/",
        "/index.html",
        "/offline.html",
        "/src/js/app.js",
        "/src/js/feed.js",
        "/src/js/material.min.js",
        "/src/css/app.css",
        "/src/css/feed.css",
        "/src/images/main-image.jpg",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css"
      ]);
    })
  );
});
// Activating
self.addEventListener("activate", e => {
  console.log("[Service Worker] is activating ...", e);
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log("[SERVICE WORKER] Deleting Old Cache ...", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
// Fetch - its fetch all request i.e HTML,CSS,IMAGE,fetch from server

// FIRST_CHECK_CACHE_THEN_NETWORK
//
// self.addEventListener("fetch", e => {
//   e.respondWith(
//     caches.match(e.request).then(res => {
//       if (res) return res;
//       else
//         return fetch(e.request)
//           .then(response => {
//             return caches.open(DYNAMIC_CACHE).then(cache => {
//               cache.put(e.request.url, response.clone());
//               return response;
//             });
//           })
//           .catch(err => {
//             return caches.open(STATIC_CACHE).then(cache => {
//               return cache.match("offline.html");
//             });
//           });
//     })
//   );
// });

// FIRST_CHECK_NETWORK_THEN_CACHE
//
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
      .catch(err => {
        return caches.match(e.request).then(cache => {
          if (cache) return cache;
          else {
            return caches.open(STATIC_CACHE).then(cache => {
              return cache.match("offline.html");
            });
          }
        });
      })
  );
});

// CACHE_ONLY
//
// self.addEventListener("fetch", e => {
//   e.respondWith(caches.match(e.request));
// });

// NETWORK_ONLY
//
// self.addEventListener("fetch", e => {
//   e.respondWith(fetch(e.request));
// });
