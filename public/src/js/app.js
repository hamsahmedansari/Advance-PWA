var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll(
  ".enable-notifications"
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("[Service Worker] Registerr"))
    .catch(err => console.error("[Service Worker] has Error", err));
}
function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log("User Choice", result);
    if (result !== "granted") {
      console.log("No notification permission granted!");
    } else {
    }
    for (let i = 0; i < enableNotificationsButtons.length; i++) {
      enableNotificationsButtons[i].style.display = "none";
    }
  });
}
if ("Notification" in window) {
  for (let i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = "inline-block";
    enableNotificationsButtons[i].addEventListener(
      "click",
      askForNotificationPermission
    );
  }
}

// Before Installing/Adding to home this event will fire
// window.addEventListener("beforeinstallprompt", e => {
//   console.log("[AddToHome] before installing prompt is fired ...", e);
//   e.preventDefault();
//   deferredPrompt = e;
//   return false; //false for not installing on chrome smart time
// });
