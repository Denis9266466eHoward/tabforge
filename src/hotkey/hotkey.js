// hotkey.js — assign keyboard shortcuts to snapshots

function createStore() {
  return { hotkeys: {} };
}

function setHotkey(store, key, snapshotId) {
  if (!key || typeof key !== 'string') throw new Error('Invalid hotkey key');
  if (!snapshotId) throw new Error('snapshotId is required');
  const existing = getSnapshotForHotkey(store, key);
  if (existing && existing !== snapshotId) {
    throw new Error(`Hotkey "${key}" already assigned to ${existing}`);
  }
  store.hotkeys[key] = snapshotId;
  return store;
}

function removeHotkey(store, key) {
  delete store.hotkeys[key];
  return store;
}

function getHotkey(store, snapshotId) {
  return Object.entries(store.hotkeys).find(([, id]) => id === snapshotId)?.[0] ?? null;
}

function getSnapshotForHotkey(store, key) {
  return store.hotkeys[key] ?? null;
}

function listHotkeys(store) {
  return Object.entries(store.hotkeys).map(([key, snapshotId]) => ({ key, snapshotId }));
}

function clearHotkeysForSnapshot(store, snapshotId) {
  for (const [key, id] of Object.entries(store.hotkeys)) {
    if (id === snapshotId) delete store.hotkeys[key];
  }
  return store;
}

module.exports = {
  createStore,
  setHotkey,
  removeHotkey,
  getHotkey,
  getSnapshotForHotkey,
  listHotkeys,
  clearHotkeysForSnapshot,
};
