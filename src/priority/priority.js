/**
 * Priority module — assign and query priority levels for snapshots.
 * Levels: 'low' | 'normal' | 'high' | 'critical'
 */

const LEVELS = ['low', 'normal', 'high', 'critical'];

export function createStore() {
  return {};
}

export function setPriority(store, snapshotId, level) {
  if (!LEVELS.includes(level)) {
    throw new Error(`Invalid priority level "${level}". Must be one of: ${LEVELS.join(', ')}`);
  }
  return { ...store, [snapshotId]: level };
}

export function getPriority(store, snapshotId) {
  return store[snapshotId] ?? 'normal';
}

export function removePriority(store, snapshotId) {
  const next = { ...store };
  delete next[snapshotId];
  return next;
}

export function filterByPriority(store, snapshots, level) {
  if (!LEVELS.includes(level)) {
    throw new Error(`Invalid priority level "${level}"`);
  }
  return snapshots.filter(s => getPriority(store, s.id) === level);
}

export function sortByPriority(store, snapshots) {
  return [...snapshots].sort((a, b) => {
    return LEVELS.indexOf(getPriority(store, b.id)) - LEVELS.indexOf(getPriority(store, a.id));
  });
}

export function listByPriority(store, snapshots) {
  return LEVELS.reduce((acc, level) => {
    acc[level] = filterByPriority(store, snapshots, level);
    return acc;
  }, {});
}

export { LEVELS };
