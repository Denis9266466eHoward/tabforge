/**
 * Tag management for snapshots.
 * Allows labeling, filtering, and organizing snapshots by tags.
 */

/**
 * Add one or more tags to a snapshot object.
 * Returns a new snapshot with updated tags.
 * @param {object} snapshot
 * @param {string[]} tags
 * @returns {object}
 */
function addTags(snapshot, tags) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Invalid snapshot');
  }
  const existing = Array.isArray(snapshot.tags) ? snapshot.tags : [];
  const merged = Array.from(new Set([...existing, ...tags.map(t => t.trim()).filter(Boolean)]));
  return { ...snapshot, tags: merged };
}

/**
 * Remove one or more tags from a snapshot object.
 * Returns a new snapshot with updated tags.
 * @param {object} snapshot
 * @param {string[]} tags
 * @returns {object}
 */
function removeTags(snapshot, tags) {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error('Invalid snapshot');
  }
  const existing = Array.isArray(snapshot.tags) ? snapshot.tags : [];
  const toRemove = new Set(tags.map(t => t.trim()));
  return { ...snapshot, tags: existing.filter(t => !toRemove.has(t)) };
}

/**
 * Filter an array of snapshots by a required tag.
 * @param {object[]} snapshots
 * @param {string} tag
 * @returns {object[]}
 */
function filterByTag(snapshots, tag) {
  if (!Array.isArray(snapshots)) throw new Error('snapshots must be an array');
  if (!tag || typeof tag !== 'string') throw new Error('tag must be a non-empty string');
  return snapshots.filter(s => Array.isArray(s.tags) && s.tags.includes(tag.trim()));
}

/**
 * Return all unique tags across an array of snapshots.
 * @param {object[]} snapshots
 * @returns {string[]}
 */
function listAllTags(snapshots) {
  if (!Array.isArray(snapshots)) throw new Error('snapshots must be an array');
  const set = new Set();
  for (const s of snapshots) {
    if (Array.isArray(s.tags)) s.tags.forEach(t => set.add(t));
  }
  return Array.from(set).sort();
}

module.exports = { addTags, removeTags, filterByTag, listAllTags };
