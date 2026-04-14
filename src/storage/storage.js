const fs = require('fs');
const path = require('path');

const DEFAULT_STORAGE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.tabforge', 'snapshots');

/**
 * Ensures the storage directory exists, creating it if necessary.
 * @param {string} dir - Directory path to ensure exists
 */
function ensureStorageDir(dir = DEFAULT_STORAGE_DIR) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Writes a snapshot object to disk as a JSON file.
 * @param {object} snapshot - The snapshot data to persist
 * @param {string} [dir] - Optional custom storage directory
 * @returns {string} The full path of the saved file
 */
function saveSnapshotToDisk(snapshot, dir = DEFAULT_STORAGE_DIR) {
  if (!snapshot || !snapshot.id) {
    throw new Error('Invalid snapshot: missing required id field');
  }

  ensureStorageDir(dir);

  const filePath = path.join(dir, `${snapshot.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');
  return filePath;
}

/**
 * Reads a snapshot JSON file from disk by its id.
 * @param {string} id - The snapshot id to load
 * @param {string} [dir] - Optional custom storage directory
 * @returns {object} Parsed snapshot object
 */
function readSnapshotFromDisk(id, dir = DEFAULT_STORAGE_DIR) {
  const filePath = path.join(dir, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Snapshot not found: ${id}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Lists all snapshot ids available in the storage directory.
 * @param {string} [dir] - Optional custom storage directory
 * @returns {string[]} Array of snapshot ids
 */
function listSnapshotIds(dir = DEFAULT_STORAGE_DIR) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.basename(file, '.json'));
}

/**
 * Deletes a snapshot file from disk.
 * @param {string} id - The snapshot id to delete
 * @param {string} [dir] - Optional custom storage directory
 * @returns {boolean} True if deleted, false if not found
 */
function deleteSnapshotFromDisk(id, dir = DEFAULT_STORAGE_DIR) {
  const filePath = path.join(dir, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return false;
  }

  fs.unlinkSync(filePath);
  return true;
}

module.exports = {
  DEFAULT_STORAGE_DIR,
  ensureStorageDir,
  saveSnapshotToDisk,
  readSnapshotFromDisk,
  listSnapshotIds,
  deleteSnapshotFromDisk,
};
