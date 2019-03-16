// install
self.addEventListener("install", e => {
  console.log("[Service Worker] is installing ...", e);
});
// Activating
self.addEventListener("activate", e => {
  console.log("[Service Worker] is activating ...", e);
});
// Fetch - its fetch all request i.e HTML,CSS,IMAGE,fetch from server
self.addEventListener("fetch", e => {
  console.log("[Service Worker] is fetching ...", e);
  e.respondWith(fetch(e.request));
});
