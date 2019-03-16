var deferredPrompt;
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("[Service Worker] Registerr"))
    .catch(err => console.error("[Service Worker] has Error", err));
}

// Before Installing/Adding to home this event will fire
window.addEventListener("beforeinstallprompt", e => {
  console.log("[AddToHome] before installing prompt is fired ...", e);
  e.preventDefault();
  deferredPrompt = e;
  return false; //false for not installing on chrome smart time
});
