/**
 * pin.js — manage pinned snapshots in tabforge
 * Pinned snapshots are protected from bulk deletion and shown first in listings.
 */

/**
 * Pin a snapshot by adding a `pinned: true` flag.
 * @param {object} snapshot
 * @returns {object} updated snapshot
 */
function pinSnapshot(snapshot) {
  if (!snapshot || !snapshot.id) {
    throw new Error('Invalid snapshot: must have an id');
  }
  return { ...snapshot, pinned: true };
}

/**
 * Unpin a snapshot by setting `pinned: false`.
 * @param {object} snapshot
 * @returns {object} updated snapshot
 */
function unpinSnapshot(snapshot) {
  if (!snapshot || !snapshot.id) {
    throw new Error('Invalid snapshot: must have an id');
  }
  return { ...snapshot, pinned: false };
}

/**
 * Check whether a snapshot is pinned.
 * @param {object} snapshot
 * @returns {boolean}
 */
function isPinned(snapshot) {
  return snapshot != null && snapshot.pinned === true;
}

/**
 * Filter a list of snapshots to only pinned ones.
 * @param {object[]} snapshots
 * @returns {object[]}
 */
function listPinned(snapshots) {
  if (!Array.isArray(snapshots)) {
    throw new Error('snapshots must be an array');
  }
  return snapshots.filter(isPinned);
}

/**
 * Sort snapshots so pinned ones appear first, preserving relative order.
 * @param {object[]} snapshots
 * @returns {object[]}
 */
function sortWithPinnedFirst(snapshots) {
  if (!Array.isArray(snapshots)) {
    throw new Error('snapshots must be an array');
  }
  return [...snapshots].sort((a, b) => {
    const aPinned = isPinned(a) ? 0 : 1;
    const bPinned = isPinned(b) ? 0 : 1;
    return aPinned - bPinned;
  });
}

module.exports = { pinSnapshot, unpinSnapshot, isPinned, listPinned, sortWithPinnedFirst };
