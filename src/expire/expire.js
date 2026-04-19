// Expiration management for snapshots

function createStore() {
  return new Map();
}

function setExpiry(store, snapshotId, expiresAt) {
  if (!(expiresAt instanceof Date) || isNaN(expiresAt.getTime())) {
    throw new Error('expiresAt must be a valid Date');
  }
  store.set(snapshotId, expiresAt.getTime());
  return store;
}

function getExpiry(store, snapshotId) {
  const ts = store.get(snapshotId);
  return ts !== undefined ? new Date(ts) : null;
}

function removeExpiry(store, snapshotId) {
  store.delete(snapshotId);
  return store;
}

function isExpired(store, snapshotId, now = new Date()) {
  const expiry = getExpiry(store, snapshotId);
  if (!expiry) return false;
  return now.getTime() > expiry.getTime();
}

function listExpired(store, snapshots, now = new Date()) {
  return snapshots.filter(s => isExpired(store, s.id, now));
}

function listActive(store, snapshots, now = new Date()) {
  return snapshots.filter(s => !isExpired(store, s.id, now));
}

function purgeExpired(store, snapshots, now = new Date()) {
  const expired = listExpired(store, snapshots, now);
  expired.forEach(s => store.delete(s.id));
  return expired.map(s => s.id);
}

module.exports = {
  createStore,
  setExpiry,
  getExpiry,
  removeExpiry,
  isExpired,
  listExpired,
  listActive,
  purgeExpired,
};
