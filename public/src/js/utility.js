// DbIndex Create Store
//idb.open(nameStore,version,callback)
var DbPromise = idb.open("post", 1, db => {
  // db.createObjectStore(nameStore, object)
  if (!db.objectStoreNames.contains("post")) {
    db.createObjectStore("post", { keyPath: "_id" });
  }
  // for sync POst
  if (!db.objectStoreNames.contains("sync-post")) {
    db.createObjectStore("sync-post", { keyPath: "_id" });
  }
});

function writeDb(store, data) {
  return DbPromise.then(db => {
    let tx = db.transaction(store, "readwrite");
    let st = tx.objectStore(store);
    st.put(data);
    return tx.complete;
  });
}

function readDB(store) {
  return DbPromise.then(db => {
    let tx = db.transaction(store, "readonly");
    let st = tx.objectStore(store);
    return st.getAll();
  });
}

function clearDb(store) {
  return DbPromise.then(db => {
    let tx = db.transaction(store, "readwrite");
    let st = tx.objectStore(store);
    st.clear();
    return tx.complete;
  });
}

function deleteSingle(store, id) {
  return DbPromise.then(db => {
    let tx = db.transaction(store, "readwrite");
    let st = tx.objectStore(store);
    st.delete(id);
    return tx.complete;
  }).then(console.log("Item Removed"));
}

// Notification

function createNotification(
  title,
  body = null,
  image = null,
  tag = null,
  action = null,
  data = null
) {
  console.log("notification");

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
    if (action) option.actions = action;
    if (data) option.data = data;
    console.log(option);

    navigator.serviceWorker.ready.then(sw => {
      sw.showNotification(title, option);
    });
  }
}
