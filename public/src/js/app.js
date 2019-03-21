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
      configPush();
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

function configPush() {
  let reg;
  navigator.serviceWorker.ready
    .then(sw => {
      reg = sw;
      return sw.pushManager.getSubscription();
    })
    .then(sub => {
      if (sub) {
        // We have subscription
      } else {
        // create new
        let key =
          "BFxOH3BqZRmBcbqunY0kcv5OqJQt-RxAnRmyPjBIXaCwaHQR0uGd_bFH3D6K8oY4FGNLhMVmqFmoMkZYYHogZU0";
        let newKey = urlBase64ToUint8Array(key);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: newKey
        });
      }
    })
    .then(newSub => {
      fetch("https://hamsahmedansari-todo-server.herokuapp.com/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(newSub)
      })
        .then(function(res) {
          console.log("Sent data", res);
          if (res.ok) {
            createNotification(
              "Successfully Subscribe",
              "You Have Successfully Subscribe To Notification",
              "https://pixabay.com/static/img/no_hotlinking.png",
              "welcome",
              [
                {
                  action: "explore",
                  title: "Explore",
                  icon: "/src/images/icons/apple-icon-57x57.png"
                }
              ]
            );
          }
        })
        .catch(err => console.log(err));
    });
}

// Before Installing/Adding to home this event will fire
// window.addEventListener("beforeinstallprompt", e => {
//   console.log("[AddToHome] before installing prompt is fired ...", e);
//   e.preventDefault();
//   deferredPrompt = e;
//   return false; //false for not installing on chrome smart time
// });
