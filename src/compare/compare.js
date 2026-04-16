// compare.js — side-by-side snapshot comparison

/**
 * Returns a comparison summary between two snapshots.
 * @param {object} snapshotA
 * @param {object} snapshotB
 * @returns {object} comparison result
 */
function compareSnapshots(snapshotA, snapshotB) {
  if (!snapshotA || !snapshotB) throw new Error('Both snapshots are required');

  const urlsA = new Set(snapshotA.tabs.map(t => t.url));
  const urlsB = new Set(snapshotB.tabs.map(t => t.url));

  const onlyInA = snapshotA.tabs.filter(t => !urlsB.has(t.url));
  const onlyInB = snapshotB.tabs.filter(t => !urlsA.has(t.url));
  const inBoth = snapshotA.tabs.filter(t => urlsB.has(t.url));

  return {
    snapshotAId: snapshotA.id,
    snapshotBId: snapshotB.id,
    onlyInA,
    onlyInB,
    inBoth,
    tabCountA: snapshotA.tabs.length,
    tabCountB: snapshotB.tabs.length,
    similarity: inBoth.length / Math.max(urlsA.size, urlsB.size),
  };
}

/**
 * Returns true if two snapshots are identical in tab URLs.
 */
function snapshotsEqual(snapshotA, snapshotB) {
  const urlsA = snapshotA.tabs.map(t => t.url).sort();
  const urlsB = snapshotB.tabs.map(t => t.url).sort();
  if (urlsA.length !== urlsB.length) return false;
  return urlsA.every((url, i) => url === urlsB[i]);
}

/**
 * Ranks a list of snapshots by similarity to a reference snapshot.
 */
function rankBySimilarity(reference, snapshots) {
  return snapshots
    .map(s => ({ snapshot: s, ...compareSnapshots(reference, s) }))
    .sort((a, b) => b.similarity - a.similarity);
}

module.exports = { compareSnapshots, snapshotsEqual, rankBySimilarity };
