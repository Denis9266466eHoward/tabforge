/**
 * history.js
 * Tracks snapshot access and modification history for a session.
 */

const { readSnapshotFromDisk, saveSnapshotToDisk } = require('../storage/storage');

const MAX_HISTORY_ENTRIES = 50;

/**
 * Records a history event on a snapshot.
 * @param {object} snapshot - The snapshot object
 * @param {string} action - e.g. 'created', 'opened', 'merged', 'exported'
 * @returns {object} Updated snapshot with new history entry
 */
function recordEvent(snapshot, action) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Invalid snapshot provided to recordEvent');
  }
  if (!action || typeof action !== 'string') {
    throw new Error('Invalid action provided to recordEvent');
  }

  const history = Array.isArray(snapshot.history) ? snapshot.history : [];

  const entry = {
    action,
    timestamp: new Date().toISOString(),
  };

  const updatedHistory = [...history, entry].slice(-MAX_HISTORY_ENTRIES);

  return { ...snapshot, history: updatedHistory };
}

/**
 * Returns the history log of a snapshot.
 * @param {object} snapshot
 * @returns {Array} Array of history entries
 */
function getHistory(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Invalid snapshot provided to getHistory');
  }
  return Array.isArray(snapshot.history) ? snapshot.history : [];
}

/**
 * Clears the history of a snapshot.
 * @param {object} snapshot
 * @returns {object} Snapshot with empty history
 */
function clearHistory(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Invalid snapshot provided to clearHistory');
  }
  return { ...snapshot, history: [] };
}

module.exports = { recordEvent, getHistory, clearHistory, MAX_HISTORY_ENTRIES };
