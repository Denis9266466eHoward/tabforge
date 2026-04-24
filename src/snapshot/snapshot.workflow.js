/**
 * snapshot workflow — chains common snapshot lifecycle operations
 * together in a single convenience layer
 */

const { createSnapshot, loadSnapshot } = require('./snapshot');
const { saveSnapshotToDisk, readSnapshotFromDisk } = require('../storage/storage');
const { validateSnapshot } = require('../validate/validate');
const { recordAction } = require('../audit/audit');
const { recordEvent } = require('../history/history');

/**
 * Create a snapshot, validate it, persist it, and record the event.
 * @param {string} name
 * @param {Array} tabs
 * @param {object} [options]
 * @returns {{ snapshot, errors }}
 */
function createAndSave(name, tabs, options = {}) {
  const snapshot = createSnapshot(name, tabs, options);
  const errors = validateSnapshot(snapshot);
  if (errors.length > 0) {
    return { snapshot: null, errors };
  }
  saveSnapshotToDisk(snapshot);
  recordEvent({ type: 'created', snapshotId: snapshot.id });
  recordAction({ action: 'create', snapshotId: snapshot.id, meta: { name } });
  return { snapshot, errors: [] };
}

/**
 * Load a snapshot from disk and record an access event.
 * @param {string} id
 * @returns {object|null}
 */
function loadAndTrack(id) {
  const snapshot = readSnapshotFromDisk(id);
  if (!snapshot) return null;
  recordEvent({ type: 'loaded', snapshotId: id });
  recordAction({ action: 'load', snapshotId: id });
  return loadSnapshot(snapshot);
}

/**
 * Delete a snapshot from disk and record the event.
 * @param {string} id
 * @param {Function} deleteFn  injected so callers can pass deleteSnapshotFromDisk
 * @returns {boolean}
 */
function removeAndRecord(id, deleteFn) {
  const ok = deleteFn(id);
  if (ok) {
    recordEvent({ type: 'deleted', snapshotId: id });
    recordAction({ action: 'delete', snapshotId: id });
  }
  return ok;
}

module.exports = { createAndSave, loadAndTrack, removeAndRecord };
