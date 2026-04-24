/**
 * audit.js — track who/what performed actions on snapshots
 */

'use strict';

function createStore() {
  return { entries: [] };
}

/**
 * Record an audit entry for an action performed on a snapshot.
 * @param {object} store
 * @param {string} snapshotId
 * @param {string} action  e.g. 'create', 'delete', 'rename', 'export'
 * @param {object} [meta]  optional extra context (actor, note, etc.)
 * @returns {object} the new audit entry
 */
function recordAction(store, snapshotId, action, meta = {}) {
  if (!snapshotId || typeof snapshotId !== 'string') {
    throw new Error('snapshotId must be a non-empty string');
  }
  if (!action || typeof action !== 'string') {
    throw new Error('action must be a non-empty string');
  }

  const entry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    snapshotId,
    action,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  store.entries.push(entry);
  return entry;
}

/**
 * Return all audit entries for a given snapshot, newest first.
 */
function getAuditLog(store, snapshotId) {
  return store.entries
    .filter(e => e.snapshotId === snapshotId)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

/**
 * Return all entries matching a specific action type.
 */
function filterByAction(store, action) {
  return store.entries.filter(e => e.action === action);
}

/**
 * Remove all audit entries for a given snapshot.
 */
function clearAuditLog(store, snapshotId) {
  store.entries = store.entries.filter(e => e.snapshotId !== snapshotId);
}

/**
 * Return a summary: how many times each action was performed across all snapshots.
 */
function summarizeActions(store) {
  return store.entries.reduce((acc, e) => {
    acc[e.action] = (acc[e.action] || 0) + 1;
    return acc;
  }, {});
}

module.exports = {
  createStore,
  recordAction,
  getAuditLog,
  filterByAction,
  clearAuditLog,
  summarizeActions,
};
