/**
 * merge.js
 * Merges two snapshots into a new combined snapshot.
 */

const { createSnapshot } = require('../snapshot/snapshot');

/**
 * Merge strategies for handling duplicate tab URLs.
 * - 'keep-left': prefer tabs from snapshotA
 * - 'keep-right': prefer tabs from snapshotB
 * - 'keep-all': keep all tabs, including duplicates
 */
const MERGE_STRATEGIES = ['keep-left', 'keep-right', 'keep-all'];

/**
 * Merges two snapshots' tab lists according to a strategy.
 * @param {object} snapshotA
 * @param {object} snapshotB
 * @param {object} options
 * @param {string} options.strategy - One of MERGE_STRATEGIES
 * @param {string} [options.name] - Name for the resulting snapshot
 * @returns {object} merged snapshot
 */
function mergeSnapshots(snapshotA, snapshotB, options = {}) {
  const { strategy = 'keep-all', name } = options;

  if (!MERGE_STRATEGIES.includes(strategy)) {
    throw new Error(`Unknown merge strategy: "${strategy}". Must be one of: ${MERGE_STRATEGIES.join(', ')}`);
  }

  if (!snapshotA || !Array.isArray(snapshotA.tabs)) {
    throw new Error('snapshotA is invalid or missing tabs array');
  }
  if (!snapshotB || !Array.isArray(snapshotB.tabs)) {
    throw new Error('snapshotB is invalid or missing tabs array');
  }

  let mergedTabs;

  if (strategy === 'keep-all') {
    mergedTabs = [...snapshotA.tabs, ...snapshotB.tabs];
  } else {
    const urlMap = new Map();

    const primary   = strategy === 'keep-left'  ? snapshotA.tabs : snapshotB.tabs;
    const secondary = strategy === 'keep-left'  ? snapshotB.tabs : snapshotA.tabs;

    for (const tab of secondary) {
      urlMap.set(tab.url, tab);
    }
    for (const tab of primary) {
      urlMap.set(tab.url, tab);
    }

    mergedTabs = Array.from(urlMap.values());
  }

  const mergedName = name || `${snapshotA.name}+${snapshotB.name}`;
  return createSnapshot(mergedName, mergedTabs);
}

module.exports = { mergeSnapshots, MERGE_STRATEGIES };
