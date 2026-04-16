// favorite.js — mark snapshots as favorites for quick access

/**
 * @typedef {Object} FavoriteStore
 * @property {Record<string, boolean>} favorites
 */

/** @returns {FavoriteStore} */
function createStore() {
  return { favorites: {} };
}

/**
 * Mark a snapshot as a favorite.
 * @param {FavoriteStore} store
 * @param {string} snapshotId
 * @returns {FavoriteStore}
 */
function addFavorite(store, snapshotId) {
  if (!snapshotId) throw new Error('snapshotId is required');
  return { favorites: { ...store.favorites, [snapshotId]: true } };
}

/**
 * Remove a snapshot from favorites.
 * @param {FavoriteStore} store
 * @param {string} snapshotId
 * @returns {FavoriteStore}
 */
function removeFavorite(store, snapshotId) {
  const updated = { ...store.favorites };
  delete updated[snapshotId];
  return { favorites: updated };
}

/**
 * Check if a snapshot is a favorite.
 * @param {FavoriteStore} store
 * @param {string} snapshotId
 * @returns {boolean}
 */
function isFavorite(store, snapshotId) {
  return store.favorites[snapshotId] === true;
}

/**
 * List all favorite snapshot IDs.
 * @param {FavoriteStore} store
 * @returns {string[]}
 */
function listFavorites(store) {
  return Object.keys(store.favorites).filter(id => store.favorites[id]);
}

/**
 * Filter an array of snapshots to only favorites.
 * @param {FavoriteStore} store
 * @param {Array<{id: string}>} snapshots
 * @returns {Array<{id: string}>}
 */
function filterFavorites(store, snapshots) {
  return snapshots.filter(s => isFavorite(store, s.id));
}

module.exports = { createStore, addFavorite, removeFavorite, isFavorite, listFavorites, filterFavorites };
