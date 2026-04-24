/**
 * timeline.js — build and query a chronological view of snapshots
 */

/**
 * Build a timeline from an array of snapshots, sorted oldest-first.
 * @param {object[]} snapshots
 * @returns {object[]}
 */
function buildTimeline(snapshots) {
  if (!Array.isArray(snapshots)) throw new TypeError('snapshots must be an array');
  return [...snapshots].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    return ta - tb;
  });
}

/**
 * Get the snapshot immediately before the given snapshot in the timeline.
 * @param {object[]} snapshots
 * @param {string} snapshotId
 * @returns {object|null}
 */
function getPrevious(snapshots, snapshotId) {
  const timeline = buildTimeline(snapshots);
  const idx = timeline.findIndex(s => s.id === snapshotId);
  if (idx <= 0) return null;
  return timeline[idx - 1];
}

/**
 * Get the snapshot immediately after the given snapshot in the timeline.
 * @param {object[]} snapshots
 * @param {string} snapshotId
 * @returns {object|null}
 */
function getNext(snapshots, snapshotId) {
  const timeline = buildTimeline(snapshots);
  const idx = timeline.findIndex(s => s.id === snapshotId);
  if (idx === -1 || idx === timeline.length - 1) return null;
  return timeline[idx + 1];
}

/**
 * Slice a timeline between two dates (inclusive).
 * @param {object[]} snapshots
 * @param {string|Date} from
 * @param {string|Date} to
 * @returns {object[]}
 */
function sliceTimeline(snapshots, from, to) {
  const fromMs = new Date(from).getTime();
  const toMs = new Date(to).getTime();
  if (isNaN(fromMs) || isNaN(toMs)) throw new RangeError('Invalid date range');
  return buildTimeline(snapshots).filter(s => {
    const t = new Date(s.createdAt).getTime();
    return t >= fromMs && t <= toMs;
  });
}

/**
 * Return the most recent snapshot in the list.
 * @param {object[]} snapshots
 * @returns {object|null}
 */
function latest(snapshots) {
  if (!snapshots || snapshots.length === 0) return null;
  return buildTimeline(snapshots).at(-1);
}

/**
 * Return the oldest snapshot in the list.
 * @param {object[]} snapshots
 * @returns {object|null}
 */
function earliest(snapshots) {
  if (!snapshots || snapshots.length === 0) return null;
  return buildTimeline(snapshots)[0];
}

module.exports = { buildTimeline, getPrevious, getNext, sliceTimeline, latest, earliest };
