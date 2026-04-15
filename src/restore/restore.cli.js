#!/usr/bin/env node
'use strict';

/**
 * CLI entry point for the restore module.
 * Usage:
 *   node restore.cli.js <snapshotId> [--tag <tag>] [--pinned]
 */

const { restoreSnapshot, restoreByTag, restorePinnedTabs } = require('./restore');

function parseArgs(argv) {
  const args = argv.slice(2);
  const snapshotId = args[0];
  const tagIndex = args.indexOf('--tag');
  const tag = tagIndex !== -1 ? args[tagIndex + 1] : null;
  const pinned = args.includes('--pinned');
  return { snapshotId, tag, pinned };
}

function main() {
  const { snapshotId, tag, pinned } = parseArgs(process.argv);

  if (!snapshotId) {
    console.error('Error: snapshotId is required.');
    console.error('Usage: restore.cli.js <snapshotId> [--tag <tag>] [--pinned]');
    process.exit(1);
  }

  let result;

  if (pinned) {
    result = restorePinnedTabs(snapshotId);
  } else if (tag) {
    result = restoreByTag(snapshotId, tag);
  } else {
    result = restoreSnapshot(snapshotId);
  }

  console.log(`Restored ${result.tabs.length} tab(s) at ${result.restoredAt}`);
  result.tabs.forEach((tab, i) => {
    console.log(`  [${i + 1}] ${tab.title || '(no title)'} — ${tab.url}`);
  });
}

main();
