// Color tagging for snapshots — visual organization

const VALID_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'];

function createStore() {
  return {};
}

function setColor(store, snapshotId, color) {
  if (!VALID_COLORS.includes(color)) {
    throw new Error(`Invalid color "${color}". Must be one of: ${VALID_COLORS.join(', ')}`);
  }
  return { ...store, [snapshotId]: color };
}

function getColor(store, snapshotId) {
  return store[snapshotId] ?? null;
}

function removeColor(store, snapshotId) {
  const next = { ...store };
  delete next[snapshotId];
  return next;
}

function hasColor(store, snapshotId) {
  return snapshotId in store;
}

function filterByColor(store, snapshots, color) {
  if (!VALID_COLORS.includes(color)) {
    throw new Error(`Invalid color "${color}"`);
  }
  return snapshots.filter(s => store[s.id] === color);
}

function groupByColor(store, snapshots) {
  const groups = {};
  for (const s of snapshots) {
    const color = store[s.id] ?? 'none';
    if (!groups[color]) groups[color] = [];
    groups[color].push(s);
  }
  return groups;
}

module.exports = {
  VALID_COLORS,
  createStore,
  setColor,
  getColor,
  removeColor,
  hasColor,
  filterByColor,
  groupByColor,
};
