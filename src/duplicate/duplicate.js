/**
 * duplicate.js — clone snapshots with a new id/name
 */

const { createSnapshot } = require('../snapshot/snapshot');

/**
 * Duplicate a snapshot, optionally overriding name and tags.
 * Returns a new snapshot with a fresh id and createdAt.
 */
function duplicateSnapshot(snapshot, overrides = {}) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('duplicateSnapshot: invalid snapshot');
  }

  const clonedTabs = snapshot.tabs.map(tab => ({ ...tab }));

  const base = {
    name: overrides.name ?? `${snapshot.name} (copy)`,
    tabs: clonedTabs,
    tags: overrides.tags ?? [...(snapshot.tags || [])],
  };

  return createSnapshot(base.name, base.tabs, base.tags);
}

/**
 * Bulk duplicate an array of snapshots.
 * Each copy gets " (copy)" appended unless nameFn is provided.
 */
function bulkDuplicate(snapshots, nameFn) {
  if (!Array.isArray(snapshots)) {
    throw new Error('bulkDuplicate: expected an array of snapshots');
  }

  return snapshots.map(snapshot => {
    const name = nameFn ? nameFn(snapshot) : undefined;
    return duplicateSnapshot(snapshot, name ? { name } : {});
  });
}

module.exports = { duplicateSnapshot, bulkDuplicate };
