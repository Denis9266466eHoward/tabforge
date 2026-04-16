/**
 * lock.js — Snapshot locking to prevent accidental modification or deletion
 */

const locks = new Map();

/**
 * Lock a snapshot by id.
 * @param {object} snapshot
 * @param {string} [reason]
 * @returns {object} updated snapshot
 */
function lockSnapshot(snapshot, reason = '') {
  if (!snapshot || !snapshot.id) throw new Error('Invalid snapshot');
  locks.set(snapshot.id, { lockedAt: new Date().toISOString(), reason });
  return { ...snapshot, locked: true, lockReason: reason };
}

/**
 * Unlock a snapshot by id.
 * @param {object} snapshot
 * @returns {object} updated snapshot
 */
function unlockSnapshot(snapshot) {
  if (!snapshot || !snapshot.id) throw new Error('Invalid snapshot');
  locks.delete(snapshot.id);
  const updated = { ...snapshot };
  delete updated.locked;
  delete updated.lockReason;
  return updated;
}

/**
 * Check if a snapshot is locked.
 * @param {object} snapshot
 * @returns {boolean}
 */
function isLocked(snapshot) {
  if (!snapshot || !snapshot.id) return false;
  return locks.has(snapshot.id);
}

/**
 * Get lock metadata for a snapshot.
 * @param {object} snapshot
 * @returns {object|null}
 */
function getLockInfo(snapshot) {
  if (!snapshot || !snapshot.id) return null;
  return locks.get(snapshot.id) || null;
}

/**
 * Filter out locked snapshots from a list.
 * @param {object[]} snapshots
 * @returns {object[]}
 */
function filterUnlocked(snapshots) {
  return snapshots.filter(s => !isLocked(s));
}

/**
 * Clear all locks (useful for testing).
 */
function clearAllLocks() {
  locks.clear();
}

module.exports = { lockSnapshot, unlockSnapshot, isLocked, getLockInfo, filterUnlocked, clearAllLocks };
