// group.js — organize snapshots into named groups

/**
 * Create a new group with optional initial snapshot IDs.
 * @param {string} name
 * @param {string[]} snapshotIds
 * @returns {object}
 */
function createGroup(name, snapshotIds = []) {
  if (!name || typeof name !== 'string') throw new Error('Group name is required');
  return {
    id: `group_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    snapshotIds: [...new Set(snapshotIds)],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Add snapshot IDs to a group (no duplicates).
 */
function addToGroup(group, snapshotIds) {
  const updated = new Set([...group.snapshotIds, ...snapshotIds]);
  return { ...group, snapshotIds: [...updated] };
}

/**
 * Remove snapshot IDs from a group.
 */
function removeFromGroup(group, snapshotIds) {
  const remove = new Set(snapshotIds);
  return { ...group, snapshotIds: group.snapshotIds.filter(id => !remove.has(id)) };
}

/**
 * Filter a list of groups to find those containing a snapshot ID.
 */
function groupsForSnapshot(groups, snapshotId) {
  return groups.filter(g => g.snapshotIds.includes(snapshotId));
}

/**
 * Rename a group.
 */
function renameGroup(group, newName) {
  if (!newName || typeof newName !== 'string') throw new Error('New name is required');
  return { ...group, name: newName.trim() };
}

/**
 * List all unique snapshot IDs across all groups.
 */
function listGroupedSnapshotIds(groups) {
  const all = groups.flatMap(g => g.snapshotIds);
  return [...new Set(all)];
}

module.exports = {
  createGroup,
  addToGroup,
  removeFromGroup,
  groupsForSnapshot,
  renameGroup,
  listGroupedSnapshotIds,
};
