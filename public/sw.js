importScripts("/src/js/idb.js");
importScripts("/src/js/utility.js");

var STATIC_CACHE = "static-v13";
var DYNAMIC_CACHE = "dynamic-v2";
var STATIC_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/src/js/idb.js",
  "/src/js/app.js",
  "/src/js/feed.js",
  "/src/js/material.min.js",
  "/src/css/app.css",
  "/src/css/feed.css",
  "/src/images/main-image.jpg",
  "https://fonts.googleapis.com/css?family=Roboto:400,700",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css"
];

// install
self.addEventListener("install", e => {
  console.log("[Service Worker] is installing ...", e);
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log("[Service Worker] PreCaching is Start");
      cache.addAll(STATIC_FILES);
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

function isInArray(string, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === string) return true;
  }
  return false;
}

self.addEventListener("fetch", e => {
  var url = config() + "/post";
  if (e.request.url.indexOf(url) > -1) {
    e.respondWith(
      fetch(e.request).then(res => {
        let cloneRes = res.clone();
        clearDb("post")
          .then(() => {
            return cloneRes.json();
          })
          .then(({ data }) => {
            data.forEach(element => {
              writeDb("post", element);
            });
          });

        return res;
      })
    );
  } else if (isInArray(e.request.url, STATIC_FILES)) {
    e.respondWith(caches.match(e.request));
  } else {
    e.respondWith(
      caches.match(e.request).then(res => {
        if (res) return res;
        else
          return fetch(e.request)
            .then(response => {
              return caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(e.request.url, response.clone());
                return response;
              });
            })
            .catch(err => {
              return caches.open(STATIC_CACHE).then(cache => {
                if (e.request.headers.get("accept").includes("text/html"))
                  return cache.match("offline.html");
              });
            });
      })
    );
  }
});

// SyncManager

self.addEventListener("sync", e => {
  console.log("[Service Worker] Background Sync ...", e);
  let url = config() + "/post";
  if (e.tag === "sync-new-post") {
    console.log("[Service Worker] Sync-New-Post");
    e.waitUntil(
      readDB("sync-post").then(data => {
        for (const iterator of data) {
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              image: iterator.image,
              title: iterator.title,
              location: iterator.location
            })
          })
            .then(function() {
              deleteSingle("sync-post", iterator._id);
              console.log("delete", iterator._id);
            })
            .catch(err => console.log(err));
        }
      })
    );
  }
});

self.addEventListener("notificationclick", e => {
  let notification = e.notification;
  let action = e.action;
  console.log("[Service Worker] Notification is clicked ", e);
  console.log("[Service Worker] Notification is clicked ", notification);
  console.log("[Service Worker] Notification is clicked ", action);
  
  e.waitUntil(
    console.log("[Service Worker] Notification is clicked ", action);
    clients.matchAll().then(cli => {
      let client = cli.find(c => {
        return c.visibilityState === "visible";
      });

      if (client !== undefined) {
        client.navigate(notification.data.url);
        client.focus();
      } else {
        client.openWindow(notification.data.url);
      }
      notification.close();
    })
  );
});

self.addEventListener("notificationclose", e => {
  console.log("[Service Worker] Notification is closed ", e);
});

self.addEventListener("push", e => {
  console.log("[Service Worker] Notification is push ", e);
  let data = {
    title: "",
    content: "",
    url: "",
    image: ""
  };
  if (e.data) {
    data = JSON.parse(e.data.text());
  }
  let option = {
    body: data.content,
    icon: "/src/images/icons/apple-icon-57x57.png",
    badge: "/src/images/icons/apple-icon-57x57.png",
    dir: "ltr",
    lang: "en-US",
    vibrate: [100, 50, 100],
    image: data.image,
    data: {
      url: data.url
    }
  };
  e.waitUntil(self.registration.showNotification(data.title, option));
});

// FIRST_CHECK_CACHE_THEN_FallBack
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
// self.addEventListener("fetch", e => {
//   e.respondWith(
//     fetch(e.request)
//       .then(response => {
//         return caches.open(DYNAMIC_CACHE).then(cache => {
//           cache.put(e.request.url, response.clone());
//           return response;
//         });
//       })
//       .catch(err => {
//         return caches.match(e.request).then(cache => {
//           if (cache) return cache;
//           else {
//             return caches.open(STATIC_CACHE).then(cache => {
//               return cache.match("offline.html");
//             });
//           }
//         });
//       })
//   );
// });

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
