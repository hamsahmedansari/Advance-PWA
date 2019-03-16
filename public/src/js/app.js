if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("[Service Worker] Registerr"))
    .catch(err => console.error("[Service Worker] has Error", err));
}
