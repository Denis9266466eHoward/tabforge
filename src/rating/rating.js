// rating.js — attach a numeric rating (1–5) to snapshots

function createStore() {
  return {};
}

function rateSnapshot(store, snapshotId, rating) {
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    throw new Error('Rating must be a number between 1 and 5');
  }
  if (!snapshotId) throw new Error('snapshotId is required');
  store[snapshotId] = Math.round(rating);
  return store;
}

function getRating(store, snapshotId) {
  return store[snapshotId] ?? null;
}

function removeRating(store, snapshotId) {
  const existed = snapshotId in store;
  delete store[snapshotId];
  return existed;
}

function listRated(store, snapshots) {
  return snapshots.filter(s => s.id in store);
}

function sortByRating(store, snapshots, order = 'desc') {
  return [...snapshots].sort((a, b) => {
    const ra = store[a.id] ?? 0;
    const rb = store[b.id] ?? 0;
    return order === 'asc' ? ra - rb : rb - ra;
  });
}

function averageRating(store) {
  const values = Object.values(store);
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

module.exports = {
  createStore,
  rateSnapshot,
  getRating,
  removeRating,
  listRated,
  sortByRating,
  averageRating,
};
