// clipboard.js — copy/paste snapshots via system clipboard (JSON)

/**
 * Serialize a snapshot to a clipboard-friendly JSON string.
 * @param {object} snapshot
 * @returns {string}
 */
function copySnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('copySnapshot: invalid snapshot');
  }
  return JSON.stringify({ __tabforge: true, snapshot });
}

/**
 * Deserialize a snapshot from a clipboard string.
 * @param {string} text
 * @returns {object}
 */
function pasteSnapshot(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('pasteSnapshot: empty or invalid input');
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('pasteSnapshot: input is not valid JSON');
  }
  if (!parsed.__tabforge || !parsed.snapshot) {
    throw new Error('pasteSnapshot: not a tabforge clipboard payload');
  }
  return parsed.snapshot;
}

/**
 * Check whether a string looks like a tabforge clipboard payload.
 * @param {string} text
 * @returns {boolean}
 */
function isClipboardPayload(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed.__tabforge === true && !!parsed.snapshot;
  } catch {
    return false;
  }
}

module.exports = { copySnapshot, pasteSnapshot, isClipboardPayload };
