// DbIndex Create Store
//idb.open(nameStore,version,callback)
var DbPromise = idb.open("post", 1, db => {
  // db.createObjectStore(nameStore, object)
  if (!db.objectStoreNames.contains("post")) {
    db.createObjectStore("post", { keyPath: "_id" });
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
