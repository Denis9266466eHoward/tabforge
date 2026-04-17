// bookmark.js — mark snapshots as bookmarked with optional notes

function createStore() {
  return { bookmarks: {} };
}

function addBookmark(store, snapshotId, note = '') {
  if (!snapshotId) throw new Error('snapshotId is required');
  store.bookmarks[snapshotId] = {
    snapshotId,
    note,
    bookmarkedAt: new Date().toISOString(),
  };
  return store.bookmarks[snapshotId];
}

function removeBookmark(store, snapshotId) {
  if (!isBookmarked(store, snapshotId)) return false;
  delete store.bookmarks[snapshotId];
  return true;
}

function isBookmarked(store, snapshotId) {
  return Object.prototype.hasOwnProperty.call(store.bookmarks, snapshotId);
}

function getBookmark(store, snapshotId) {
  return store.bookmarks[snapshotId] || null;
}

function listBookmarks(store) {
  return Object.values(store.bookmarks);
}

function updateNote(store, snapshotId, note) {
  if (!isBookmarked(store, snapshotId)) throw new Error(`Snapshot '${snapshotId}' is not bookmarked`);
  store.bookmarks[snapshotId].note = note;
  return store.bookmarks[snapshotId];
}

function filterBookmarked(store, snapshots) {
  return snapshots.filter(s => isBookmarked(store, s.id));
}

module.exports = {
  createStore,
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmark,
  listBookmarks,
  updateNote,
  filterBookmarked,
};
