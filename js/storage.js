/*
  storage.js - saving bookmarks in the browser's LocalStorage.

  LocalStorage keeps small pieces of text in the visitor's browser, so bookmarks
  are still there after a page reload. It can fail (private mode, blocked storage),
  so every call is wrapped in try/catch and the site keeps working without it.
*/

const BOOKMARK_KEY = "aigrh.bookmarks.v1";

// Used if LocalStorage is not available: bookmarks then last until the page closes.
let memoryBookmarks = [];
let storageWorks = true;

// Returns an array like [{ type: "publication", id: "pub-compute" }, ...]
function loadBookmarks() {
  try {
    const text = window.localStorage.getItem(BOOKMARK_KEY);
    if (!text) return storageWorks ? [] : memoryBookmarks;
    const list = JSON.parse(text);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    storageWorks = false;
    return memoryBookmarks;
  }
}

function saveBookmarks(list) {
  memoryBookmarks = list;
  try {
    window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list));
  } catch (error) {
    storageWorks = false;
  }
}

function isBookmarked(type, id) {
  return loadBookmarks().some((b) => b.type === type && b.id === id);
}

// Adds the bookmark if missing, removes it if present. Returns true if now bookmarked.
function toggleBookmark(type, id) {
  const list = loadBookmarks();
  const index = list.findIndex((b) => b.type === type && b.id === id);
  if (index >= 0) {
    list.splice(index, 1);
    saveBookmarks(list);
    return false;
  }
  list.push({ type: type, id: id, savedAt: new Date().toISOString() });
  saveBookmarks(list);
  return true;
}

function removeBookmark(type, id) {
  saveBookmarks(loadBookmarks().filter((b) => !(b.type === type && b.id === id)));
}

function isStorageAvailable() {
  loadBookmarks();
  return storageWorks;
}
