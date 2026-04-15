/**
 * restore.js
 * Handles restoring browser sessions from snapshots.
 */

'use strict';

const { loadSnapshot } = require('../snapshot/snapshot');
const { readSnapshotFromDisk } = require('../storage/storage');

/**
 * Restore a snapshot by ID, returning the list of tabs to reopen.
 * @param {string} snapshotId
 * @returns {{ tabs: Array, restoredAt: string }}
 */
function restoreSnapshot(snapshotId) {
  const raw = readSnapshotFromDisk(snapshotId);
  const snapshot = loadSnapshot(raw);

  return {
    tabs: snapshot.tabs,
    restoredAt: new Date().toISOString(),
  };
}

/**
 * Restore only tabs matching a given tag.
 * @param {string} snapshotId
 * @param {string} tag
 * @returns {{ tabs: Array, restoredAt: string }}
 */
function restoreByTag(snapshotId, tag) {
  const raw = readSnapshotFromDisk(snapshotId);
  const snapshot = loadSnapshot(raw);

  const filtered = snapshot.tabs.filter(
    (tab) => Array.isArray(tab.tags) && tab.tags.includes(tag)
  );

  return {
    tabs: filtered,
    restoredAt: new Date().toISOString(),
  };
}

/**
 * Restore only pinned tabs from a snapshot.
 * @param {string} snapshotId
 * @returns {{ tabs: Array, restoredAt: string }}
 */
function restorePinnedTabs(snapshotId) {
  const raw = readSnapshotFromDisk(snapshotId);
  const snapshot = loadSnapshot(raw);

  const pinned = snapshot.tabs.filter((tab) => tab.pinned === true);

  return {
    tabs: pinned,
    restoredAt: new Date().toISOString(),
  };
}

module.exports = { restoreSnapshot, restoreByTag, restorePinnedTabs };
