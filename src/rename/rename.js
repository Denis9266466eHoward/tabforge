/**
 * rename.js — rename snapshots and keep alias/history in sync
 */

/**
 * Rename a snapshot by updating its name field.
 * Returns a new snapshot object (immutable style).
 */
function renameSnapshot(snapshot, newName) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Invalid snapshot');
  }
  if (!newName || typeof newName !== 'string' || !newName.trim()) {
    throw new Error('New name must be a non-empty string');
  }
  const trimmed = newName.trim();
  if (trimmed === snapshot.name) {
    return snapshot;
  }
  return { ...snapshot, name: trimmed, updatedAt: new Date().toISOString() };
}

/**
 * Bulk rename snapshots matching a predicate.
 * nameFn receives the snapshot and returns the new name.
 */
function bulkRename(snapshots, predicate, nameFn) {
  if (!Array.isArray(snapshots)) throw new Error('snapshots must be an array');
  return snapshots.map(snap => {
    if (predicate(snap)) {
      const newName = nameFn(snap);
      return renameSnapshot(snap, newName);
    }
    return snap;
  });
}

/**
 * Build a rename history entry.
 */
function buildRenameRecord(snapshot, oldName, newName) {
  return {
    snapshotId: snapshot.id,
    oldName,
    newName,
    renamedAt: new Date().toISOString(),
  };
}

module.exports = { renameSnapshot, bulkRename, buildRenameRecord };
