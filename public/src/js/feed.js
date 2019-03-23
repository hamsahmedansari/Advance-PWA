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
var RetakeButton = document.querySelector("#retake-btn");
var RandomButton = document.querySelector("#random-btn");
var imagePicker = document.querySelector("#image-picker");
var imagePickerArea = document.querySelector("#pick-image");
var locationBtn = document.querySelector("#location-btn");
var locationLoader = document.querySelector("#location-loader");
//
locationBtn.addEventListener("click", function(event) {
  if (!("geolocation" in navigator)) {
    return;
  }

  locationBtn.style.display = "none";
  locationLoader.style.display = "inline-block";

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationBtn.style.display = "inline";
      locationLoader.style.display = "none";
      let fetchedLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(fetchedLocation);

      addNotification(
        `Your Location Lat:${fetchedLocation.lat} & Lng:${fetchedLocation.lng}`
      );

      locationInput.value = "Karachi";
      document.querySelector("#manual-location").classList.add("is-focused");
    },
    function(err) {
      console.log(err);
      locationBtn.style.display = "inline";
      locationLoader.style.display = "none";
      alert("Couldn't fetch location, please enter manually!");
      fetchedLocation = { lat: null, lng: null };
    },
    { timeout: 5000 }
  );
});

function initializeLocation() {
  if (!("geolocation" in navigator)) {
    locationBtn.style.display = "none";
  }
}

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

  addNotification(
    "Note Your Image is Not Uploading to anywhere & We Use Random Image"
  );
}

captureButton.addEventListener("click", function(event) {
  canvasElement.style.display = "block";
  videoPlayer.style.display = "none";
  captureButton.style.display = "none";
  RetakeButton.style.display = "inline-block";
  var context = canvasElement.getContext("2d");
  context.drawImage(
    videoPlayer,
    0,
    0,
    canvas.width,
    videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width)
  );
  try {
    videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
      track.stop();
    });
  } catch (error) {
    console.log(error);
  }
  addNotification(
    "Note Your Image is Not Uploading to anywhere & We Use Random Image"
  );
});

RetakeButton.addEventListener("click", function(event) {
  canvasElement.style.display = "none";
  RetakeButton.style.display = "none";
  videoPlayer.style.display = "block";
  captureButton.style.display = "inline-block";
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function(stream) {
      videoPlayer.srcObject = stream;
      videoPlayer.style.display = "block";
    })
    .catch(function(err) {
      imagePickerArea.style.display = "block";
    });
  addNotification(
    "Note Your Image is Not Uploading to anywhere & We Use Random Image"
  );
});

RandomButton.addEventListener("click", function(event) {
  canvasElement.style.display = "block";
  videoPlayer.style.display = "none";
  captureButton.style.display = "none";
  RetakeButton.style.display = "inline-block";
  var context = canvasElement.getContext("2d");
  let image = document.getElementById("randomIMG");
  context.drawImage(image, 0, 0, 400, 200);
  try {
    videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
      track.stop();
    });
  } catch (error) {
    console.log(error);
  }
  document.getElementById("randomDiv").removeChild(image);
  let random = Math.floor(Math.random() * 99) + 1;
  let img = document.createElement("img");
  img.src = `https://picsum.photos/400/200/?image=${random}`;
  img.id = "randomIMG";
  document.getElementById("randomDiv").appendChild(img);
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
  try {
    videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
      track.stop();
    });
  } catch (error) {
    console.log(error);
  }

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
  let image = document.getElementById("randomIMG").getAttribute("src");
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      image: image,
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
      let image = document.getElementById("randomIMG").getAttribute("src");
      let post = {
        _id: new Date().toISOString(),
        image: image,
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
