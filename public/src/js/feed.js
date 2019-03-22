var shareImageButton = document.querySelector("#share-image-button");
var createPostArea = document.querySelector("#create-post");
var closeCreatePostModalButton = document.querySelector(
  "#close-create-post-modal-btn"
);
var sharedMomentsArea = document.querySelector("#shared-moments");
var form = document.querySelector("form");
var titleInput = document.querySelector("#title");
var locationInput = document.querySelector("#location");
var videoPlayer = document.querySelector("#player");
var canvasElement = document.querySelector("#canvas");
var captureButton = document.querySelector("#capture-btn");
var imagePicker = document.querySelector("#image-picker");
var imagePickerArea = document.querySelector("#pick-image");

function initializeMedia() {
  if (!("mediaDevices" in navigator)) {
    navigator.mediaDevices = {};
  }

  if (!("getUserMedia" in navigator.mediaDevices)) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(new Error("getUserMedia is not implemented!"));
      }

      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function(stream) {
      videoPlayer.srcObject = stream;
      videoPlayer.style.display = "block";
    })
    .catch(function(err) {
      imagePickerArea.style.display = "block";
    });
}

captureButton.addEventListener("click", function(event) {
  canvasElement.style.display = "block";
  videoPlayer.style.display = "none";
  captureButton.style.display = "none";
  var context = canvasElement.getContext("2d");
  context.drawImage(
    videoPlayer,
    0,
    0,
    canvas.width,
    videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width)
  );
  videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
    track.stop();
  });
});

function openCreatePostModal() {
  // createPostArea.style.display = "block";
  //
  createPostArea.style.transform = "translateY(0)";
  initializeMedia();

  // if (deferredPrompt) {
  //   deferredPrompt.prompt();

  //   deferredPrompt.userChoice.then(function(choiceResult) {
  //     console.log(choiceResult.outcome);

  //     if (choiceResult.outcome === "dismissed") {
  //       console.log("User cancelled installation");
  //     } else {
  //       console.log("User added to home screen");
  //     }
  //   });

  //   deferredPrompt = null;
  // }
}

function closeCreatePostModal() {
  createPostArea.style.transform = "translateY(100vh)";
  imagePickerArea.style.display = "none";
  videoPlayer.style.display = "none";
  canvasElement.style.display = "none";
  videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
    track.stop();
  });
  // createPostArea.style.display = "none";
}

shareImageButton.addEventListener("click", openCreatePostModal);

closeCreatePostModalButton.addEventListener("click", closeCreatePostModal);

function onSaveButtonClicked(event) {
  if ("caches" in window) {
    caches.open("userSave").then(cache => {
      cache.add("https://httpbin.org/get");
      console.log("[Feed] added to Cache");
    });
  }
}

function clearCard() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(data) {
  var cardWrapper = document.createElement("div");
  cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp";
  var cardTitle = document.createElement("div");
  cardTitle.className = "mdl-card__title";
  cardTitle.style.backgroundImage = `url("${data.image}")`;
  cardTitle.style.backgroundSize = "cover";
  cardTitle.style.height = "180px";
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement("h2");
  cardTitleTextElement.style.color = "white";
  cardTitleTextElement.className = "mdl-card__title-text";
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement("div");
  cardSupportingText.className = "mdl-card__supporting-text";
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = "center";
  var cardSaveButton = document.createElement("button");
  // cardSaveButton.textContent = "Save";
  // cardSaveButton.addEventListener("click", onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}
function addNotification(params) {
  let snackbarContainer = document.querySelector("#confirmation-toast");
  let data = { message: params };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}
function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}
var url = config() + "/post";
var isNetworkReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    isNetworkReceived = true;
    console.log("[Feed] loading from web ...", data);
    updateUI(data.data);
  });

if ("indexedDB" in window) {
  readDB("post").then(res => {
    if (!isNetworkReceived) {
      console.log("[Feed] loading from cache ...", res);
      updateUI(res);
    }
  });
  // caches
  //   .match(url)
  //   .then(res => {
  //     if (res) return res.json();
  //   })
  //   .then(res => {
  //     if (!isNetworkReceived) {
  //       console.log("[Feed] loading from cache ...", res);
  //       updateUI(res.data);
  //     }
  //   });
}
function sendData() {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      image:
        "https://www.samaa.tv/wp-content/uploads/2017/09/Karachi-640x405.jpg",
      title: titleInput.value,
      location: locationInput.value
    })
  })
    .then(function(res) {
      console.log("Sent data", res);
      return res.json();
    })
    .then(({ data }) => {
      createCard(data);
      addNotification("Your Post was saved for syncing!");
    });
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  if (titleInput.value.trim() === "" || locationInput.value.trim() === "") {
    alert("Please enter valid data!");
    return;
  }

  closeCreatePostModal();

  // syncManager
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then(sw => {
      let post = {
        _id: new Date().toISOString(),
        image:
          "https://www.samaa.tv/wp-content/uploads/2017/09/Karachi-640x405.jpg",
        title: titleInput.value,
        location: locationInput.value
      };
      writeDb("sync-post", post)
        .then(() => {
          return sw.sync.register("sync-new-post");
        })
        .then(() => {
          createCard(post);
          addNotification("Your Post was saved for syncing!");
        })
        .catch(err => console.log(err));
    });
  } else {
    sendData();
  }
});
