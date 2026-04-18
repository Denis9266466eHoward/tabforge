// filter snapshots by various criteria

/**
 * Filter snapshots by minimum tab count
 * @param {object[]} snapshots
 * @param {number} min
 */
function filterByMinTabs(snapshots, min) {
  return snapshots.filter(s => Array.isArray(s.tabs) && s.tabs.length >= min);
}

/**
 * Filter snapshots by maximum tab count
 * @param {object[]} snapshots
 * @param {number} max
 */
function filterByMaxTabs(snapshots, max) {
  return snapshots.filter(s => Array.isArray(s.tabs) && s.tabs.length <= max);
}

/**
 * Filter snapshots whose name matches a pattern (string or regex)
 * @param {object[]} snapshots
 * @param {string|RegExp} pattern
 */
function filterByNamePattern(snapshots, pattern) {
  const re = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
  return snapshots.filter(s => re.test(s.name || ''));
}

/**
 * Filter snapshots created after a given date
 * @param {object[]} snapshots
 * @param {Date|string} after
 */
function filterCreatedAfter(snapshots, after) {
  const ts = new Date(after).getTime();
  return snapshots.filter(s => new Date(s.createdAt).getTime() > ts);
}

/**
 * Filter snapshots created before a given date
 * @param {object[]} snapshots
 * @param {Date|string} before
 */
function filterCreatedBefore(snapshots, before) {
  const ts = new Date(before).getTime();
  return snapshots.filter(s => new Date(s.createdAt).getTime() < ts);
}

/**
 * Apply multiple filter criteria at once
 * @param {object[]} snapshots
 * @param {object} criteria
 */
function filterSnapshots(snapshots, criteria = {}) {
  let result = snapshots;
  if (criteria.minTabs != null) result = filterByMinTabs(result, criteria.minTabs);
  if (criteria.maxTabs != null) result = filterByMaxTabs(result, criteria.maxTabs);
  if (criteria.namePattern != null) result = filterByNamePattern(result, criteria.namePattern);
  if (criteria.after != null) result = filterCreatedAfter(result, criteria.after);
  if (criteria.before != null) result = filterCreatedBefore(result, criteria.before);
  return result;
}

module.exports = {
  filterByMinTabs,
  filterByMaxTabs,
  filterByNamePattern,
  filterCreatedAfter,
  filterCreatedBefore,
  filterSnapshots,
};
