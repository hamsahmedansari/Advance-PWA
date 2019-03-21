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

function createNotification(title, body = null) {
  // if (Notification.permission == 'granted') {
  //   navigator.serviceWorker.getRegistration().then(function(reg) {
  //     var options = {
  //       body: 'Here is a notification body!',
  //       icon: 'images/example.png',
  //       vibrate: [100, 50, 100],
  //       data: {
  //         dateOfArrival: Date.now(),
  //         primaryKey: 1
  //       },
  //       actions: [
  //         {action: 'explore', title: 'Explore this new world',
  //           icon: '/src/images/icons/apple-icon-57x57.png'},
  //         {action: 'close', title: 'Close notification',
  //           icon: '/src/images/icons/apple-icon-57x57.png'},
  //       ]
  //     };
  //     reg.showNotification('Hello world!', options);
  //   });
  // }
  if ("serviceWorker" in navigator) {
    let option = { body };
    navigator.serviceWorker.ready.then(sw => {
      sw.showNotification(title, option);
    });
  }
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log("User Choice", result);
    if (result !== "granted") {
      console.log("No notification permission granted!");
    } else {
      createNotification(
        "Successfully Subscribe",
        "You Have Successfully Subscribe To Notification"
      );
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
