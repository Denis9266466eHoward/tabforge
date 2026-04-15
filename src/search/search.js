/**
 * search.js — search and filter snapshots by various criteria
 */

/**
 * Search snapshots by matching tab URLs or titles against a query string.
 * @param {object[]} snapshots - array of snapshot objects
 * @param {string} query - search string (case-insensitive)
 * @returns {object[]} snapshots that contain at least one matching tab
 */
function searchSnapshots(snapshots, query) {
  if (!query || typeof query !== 'string') {
    throw new Error('query must be a non-empty string');
  }
  const lower = query.toLowerCase();
  return snapshots.filter((snapshot) => {
    if (!Array.isArray(snapshot.tabs)) return false;
    return snapshot.tabs.some(
      (tab) =>
        (tab.url && tab.url.toLowerCase().includes(lower)) ||
        (tab.title && tab.title.toLowerCase().includes(lower))
    );
  });
}

/**
 * Search snapshots by their name or id.
 * @param {object[]} snapshots - array of snapshot objects
 * @param {string} query - search string (case-insensitive)
 * @returns {object[]} matching snapshots
 */
function searchByName(snapshots, query) {
  if (!query || typeof query !== 'string') {
    throw new Error('query must be a non-empty string');
  }
  const lower = query.toLowerCase();
  return snapshots.filter(
    (snapshot) =>
      (snapshot.name && snapshot.name.toLowerCase().includes(lower)) ||
      (snapshot.id && snapshot.id.toLowerCase().includes(lower))
  );
}

/**
 * Search snapshots created within a date range.
 * @param {object[]} snapshots - array of snapshot objects
 * @param {Date|string} from - start date (inclusive)
 * @param {Date|string} to - end date (inclusive)
 * @returns {object[]} snapshots within the date range
 */
function searchByDateRange(snapshots, from, to) {
  const fromTs = new Date(from).getTime();
  const toTs = new Date(to).getTime();
  if (isNaN(fromTs) || isNaN(toTs)) {
    throw new Error('from and to must be valid dates');
  }
  return snapshots.filter((snapshot) => {
    const created = new Date(snapshot.createdAt).getTime();
    return !isNaN(created) && created >= fromTs && created <= toTs;
  });
}

module.exports = { searchSnapshots, searchByName, searchByDateRange };
