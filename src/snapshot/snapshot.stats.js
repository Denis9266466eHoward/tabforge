/**
 * snapshot.stats.js
 * Compute statistics and summaries across a collection of snapshots.
 */

/**
 * Count total tabs across all snapshots.
 * @param {object[]} snapshots
 * @returns {number}
 */
function totalTabCount(snapshots) {
  return snapshots.reduce((sum, s) => sum + (s.tabs ? s.tabs.length : 0), 0);
}

/**
 * Return the average number of tabs per snapshot.
 * @param {object[]} snapshots
 * @returns {number}
 */
function averageTabCount(snapshots) {
  if (!snapshots.length) return 0;
  return totalTabCount(snapshots) / snapshots.length;
}

/**
 * Find the snapshot with the most tabs.
 * @param {object[]} snapshots
 * @returns {object|null}
 */
function largestSnapshot(snapshots) {
  if (!snapshots.length) return null;
  return snapshots.reduce((max, s) =>
    (s.tabs ? s.tabs.length : 0) > (max.tabs ? max.tabs.length : 0) ? s : max
  );
}

/**
 * Find the snapshot with the fewest tabs.
 * @param {object[]} snapshots
 * @returns {object|null}
 */
function smallestSnapshot(snapshots) {
  if (!snapshots.length) return null;
  return snapshots.reduce((min, s) =>
    (s.tabs ? s.tabs.length : 0) < (min.tabs ? min.tabs.length : 0) ? s : min
  );
}

/**
 * Compute a full stats summary for a list of snapshots.
 * @param {object[]} snapshots
 * @returns {object}
 */
function computeStats(snapshots) {
  const count = snapshots.length;
  const total = totalTabCount(snapshots);
  const average = averageTabCount(snapshots);
  const largest = largestSnapshot(snapshots);
  const smallest = smallestSnapshot(snapshots);

  const tabCounts = snapshots.map(s => (s.tabs ? s.tabs.length : 0));
  const sorted = [...tabCounts].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length === 0
      ? 0
      : sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;

  return {
    count,
    totalTabs: total,
    averageTabs: average,
    medianTabs: median,
    largestId: largest ? largest.id : null,
    smallestId: smallest ? smallest.id : null,
  };
}

module.exports = {
  totalTabCount,
  averageTabCount,
  largestSnapshot,
  smallestSnapshot,
  computeStats,
};
