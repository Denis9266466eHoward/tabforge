/**
 * label.js — attach freeform labels (key:value) to snapshots
 */

function createStore() {
  return {}; // { snapshotId: { key: value, ... } }
}

function setLabel(store, snapshotId, key, value) {
  if (!snapshotId || !key) throw new Error('snapshotId and key are required');
  if (!store[snapshotId]) store[snapshotId] = {};
  store[snapshotId][key] = value;
  return store;
}

function removeLabel(store, snapshotId, key) {
  if (!store[snapshotId]) return store;
  delete store[snapshotId][key];
  if (Object.keys(store[snapshotId]).length === 0) delete store[snapshotId];
  return store;
}

function getLabels(store, snapshotId) {
  return store[snapshotId] ? { ...store[snapshotId] } : {};
}

function hasLabel(store, snapshotId, key, value) {
  const labels = store[snapshotId];
  if (!labels) return false;
  return value !== undefined ? labels[key] === value : key in labels;
}

function filterByLabel(store, snapshots, key, value) {
  return snapshots.filter(s => hasLabel(store, s.id, key, value));
}

function clearLabels(store, snapshotId) {
  delete store[snapshotId];
  return store;
}

module.exports = {
  createStore,
  setLabel,
  removeLabel,
  getLabels,
  hasLabel,
  filterByLabel,
  clearLabels,
};
