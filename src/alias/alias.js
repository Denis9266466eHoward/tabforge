/**
 * alias.js — Manage human-friendly aliases for snapshot IDs
 */

const aliases = new Map();

/**
 * Assign an alias to a snapshot ID.
 * @param {string} alias
 * @param {string} snapshotId
 * @returns {{ alias: string, snapshotId: string }}
 */
function setAlias(alias, snapshotId) {
  if (!alias || typeof alias !== 'string') throw new Error('alias must be a non-empty string');
  if (!snapshotId || typeof snapshotId !== 'string') throw new Error('snapshotId must be a non-empty string');
  const key = alias.trim().toLowerCase();
  aliases.set(key, snapshotId);
  return { alias: key, snapshotId };
}

/**
 * Resolve an alias to its snapshot ID.
 * Returns null if not found.
 * @param {string} alias
 * @returns {string|null}
 */
function resolveAlias(alias) {
  if (!alias || typeof alias !== 'string') return null;
  return aliases.get(alias.trim().toLowerCase()) ?? null;
}

/**
 * Remove an alias.
 * @param {string} alias
 * @returns {boolean} true if removed, false if it didn't exist
 */
function removeAlias(alias) {
  if (!alias || typeof alias !== 'string') return false;
  return aliases.delete(alias.trim().toLowerCase());
}

/**
 * List all current aliases.
 * @returns {Array<{ alias: string, snapshotId: string }>}
 */
function listAliases() {
  return Array.from(aliases.entries()).map(([alias, snapshotId]) => ({ alias, snapshotId }));
}

/**
 * Find all aliases pointing to a given snapshot ID.
 * @param {string} snapshotId
 * @returns {string[]}
 */
function aliasesForSnapshot(snapshotId) {
  return Array.from(aliases.entries())
    .filter(([, id]) => id === snapshotId)
    .map(([alias]) => alias);
}

/** Clear all aliases (useful for testing). */
function clearAliases() {
  aliases.clear();
}

module.exports = { setAlias, resolveAlias, removeAlias, listAliases, aliasesForSnapshot, clearAliases };
