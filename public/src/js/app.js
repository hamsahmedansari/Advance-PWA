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

function createNotification(
  title,
  body = null,
  image = null,
  tag = null,
  action = null,
  data = null
) {
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

  if ("serviceWorker" in navigator) {
    let option = {
      body,
      icon: "/src/images/icons/apple-icon-57x57.png",
      badge: "/src/images/icons/apple-icon-57x57.png",
      dir: "ltr",
      lang: "en-US",
      vibrate: [100, 50, 100],
      renotify: true
    };
    if (image) option.image = image;
    if (tag) option.tag = tag;
    if (action) option.action = action;
    if (data) option.data = data;

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
        "You Have Successfully Subscribe To Notification",
        "https://www.samaa.tv/wp-content/uploads/2017/09/Karachi-640x405.jpg",
        "welcome",
        [
          {
            action: "explore",
            title: "Explore this new world",
            icon: "https://image.flaticon.com/icons/png/512/471/471012.png"
          }
        ]
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
