const fs = require('fs');
const path = require('path');

/**
 * Export a snapshot to a portable JSON file at the given output path.
 * @param {object} snapshot - The snapshot object to export.
 * @param {string} outputPath - Destination file path.
 * @returns {string} The resolved output path.
 */
function exportSnapshot(snapshot, outputPath) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Invalid snapshot: must be a non-null object');
  }
  if (!outputPath || typeof outputPath !== 'string') {
    throw new Error('Invalid outputPath: must be a non-empty string');
  }

  const resolved = path.resolve(outputPath) = path.dirname(resolved);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    snapshot,
  };

  fs.writeFileSync(resolved, JSON.stringify(payload, null, 2), 'utf8');
  return resolved;
}

/**
 * Import a snapshot from a previously exported JSON file.
 * @param {string} filePath - Path to the exported JSON file.
 * @returns {object} The snapshot object.
 */
function importSnapshot(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid filePath: must be a non-empty string');
  }

  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  let raw;
  try {
    raw = fs.readFileSync(resolved, 'utf8');
  } catch (err) {
    throw new Error(`Failed to read file: ${err.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err.message}`);
  }

  if (!parsed.snapshot || typeof parsed.snapshot !== 'object') {
    throw new Error('Invalid export file: missing snapshot field');
  }

  return parsed.snapshot;
}

module.exports = { exportSnapshot, importSnapshot };
