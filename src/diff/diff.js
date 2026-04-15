/**
 * Snapshot diffing utilities
 * Compares two snapshots and returns a structured diff
 */

/**
 * Diff two snapshot tab arrays
 * @param {object[]} tabsA - tabs from snapshot A
 * @param {object[]} tabsB - tabs from snapshot B
 * @returns {{ added: object[], removed: object[], changed: object[] }}
 */
function diffTabs(tabsA, tabsB) {
  const urlsA = new Map(tabsA.map((t) => [t.url, t]));
  const urlsB = new Map(tabsB.map((t) => [t.url, t]));

  const added = tabsB.filter((t) => !urlsA.has(t.url));
  const removed = tabsA.filter((t) => !urlsB.has(t.url));

  const changed = tabsB.filter((t) => {
    if (!urlsA.has(t.url)) return false;
    const prev = urlsA.get(t.url);
    return prev.title !== t.title || prev.pinned !== t.pinned;
  }).map((t) => ({
    url: t.url,
    before: urlsA.get(t.url),
    after: t,
  }));

  return { added, removed, changed };
}

/**
 * Diff two full snapshots
 * @param {object} snapshotA
 * @param {object} snapshotB
 * @returns {object} structured diff result
 */
function diffSnapshots(snapshotA, snapshotB) {
  if (!snapshotA || !snapshotB) {
    throw new Error('Both snapshots are required for diffing');
  }

  const tabDiff = diffTabs(
    snapshotA.tabs ?? [],
    snapshotB.tabs ?? []
  );

  return {
    from: snapshotA.id,
    to: snapshotB.id,
    createdAt: new Date().toISOString(),
    summary: {
      added: tabDiff.added.length,
      removed: tabDiff.removed.length,
      changed: tabDiff.changed.length,
    },
    tabs: tabDiff,
  };
}

module.exports = { diffTabs, diffSnapshots };
