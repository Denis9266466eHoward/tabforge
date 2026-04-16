/**
 * sort.js — utilities for ordering snapshot collections
 */

/**
 * Sort snapshots by creation date.
 * @param {object[]} snapshots
 * @param {'asc'|'desc'} direction
 */
function sortByDate(snapshots, direction = 'desc') {
  const factor = direction === 'asc' ? 1 : -1;
  return [...snapshots].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    return factor * (ta - tb);
  });
}

/**
 * Sort snapshots alphabetically by name.
 * @param {object[]} snapshots
 * @param {'asc'|'desc'} direction
 */
function sortByName(snapshots, direction = 'asc') {
  const factor = direction === 'asc' ? 1 : -1;
  return [...snapshots].sort((a, b) =>
    factor * a.name.localeCompare(b.name)
  );
}

/**
 * Sort snapshots by number of tabs.
 * @param {object[]} snapshots
 * @param {'asc'|'desc'} direction
 */
function sortByTabCount(snapshots, direction = 'desc') {
  const factor = direction === 'asc' ? 1 : -1;
  return [...snapshots].sort((a, b) =>
    factor * ((a.tabs?.length ?? 0) - (b.tabs?.length ?? 0))
  );
}

/**
 * Generic sort dispatcher.
 * @param {object[]} snapshots
 * @param {'date'|'name'|'tabCount'} field
 * @param {'asc'|'desc'} direction
 */
function sortSnapshots(snapshots, field = 'date', direction = 'desc') {
  switch (field) {
    case 'name':     return sortByName(snapshots, direction);
    case 'tabCount': return sortByTabCount(snapshots, direction);
    case 'date':
    default:         return sortByDate(snapshots, direction);
  }
}

module.exports = { sortByDate, sortByName, sortByTabCount, sortSnapshots };
