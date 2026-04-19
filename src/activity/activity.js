// activity.js — track last-accessed timestamps for snapshots

'use strict';

function createStore() {
  return { activity: {} };
}

function recordAccess(store, snapshotId, timestamp = Date.now()) {
  if (!snapshotId) throw new Error('snapshotId is required');
  store.activity[snapshotId] = timestamp;
  return store;
}

function getLastAccessed(store, snapshotId) {
  return store.activity[snapshotId] ?? null;
}

function removeActivity(store, snapshotId) {
  delete store.activity[snapshotId];
  return store;
}

function listByRecency(store, snapshots) {
  return [...snapshots].sort((a, b) => {
    const ta = store.activity[a.id] ?? 0;
    const tb = store.activity[b.id] ?? 0;
    return tb - ta;
  });
}

function neverAccessed(store, snapshots) {
  return snapshots.filter(s => store.activity[s.id] == null);
}

function summarizeActivity(store) {
  const entries = Object.entries(store.activity);
  if (entries.length === 0) return { count: 0, mostRecent: null, oldest: null };
  const timestamps = entries.map(([, t]) => t);
  return {
    count: entries.length,
    mostRecent: Math.max(...timestamps),
    oldest: Math.min(...timestamps),
  };
}

module.exports = {
  createStore,
  recordAccess,
  getLastAccessed,
  removeActivity,
  listByRecency,
  neverAccessed,
  summarizeActivity,
};
