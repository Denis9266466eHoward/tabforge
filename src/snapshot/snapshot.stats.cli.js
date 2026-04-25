#!/usr/bin/env node
/**
 * snapshot.stats.cli.js
 * CLI entry point: print statistics for a set of snapshots loaded from disk.
 *
 * Usage:
 *   node snapshot.stats.cli.js [--ids id1,id2,...]
 *   node snapshot.stats.cli.js --all
 */

const { listSnapshotIds, readSnapshotFromDisk } = require('../storage/storage');
const { computeStats } = require('./snapshot.stats');

function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { all: false, ids: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--all') {
      result.all = true;
    } else if (args[i] === '--ids' && args[i + 1]) {
      result.ids = args[i + 1].split(',').map(s => s.trim()).filter(Boolean);
      i++;
    }
  }
  return result;
}

async function main(argv = process.argv, out = console) {
  const args = parseArgs(argv);

  let ids = args.ids;
  if (args.all) {
    ids = await listSnapshotIds();
  }

  if (!ids.length) {
    out.error('No snapshot IDs specified. Use --all or --ids id1,id2,...');
    process.exitCode = 1;
    return;
  }

  const snapshots = [];
  for (const id of ids) {
    try {
      const snap = await readSnapshotFromDisk(id);
      snapshots.push(snap);
    } catch {
      out.warn ? out.warn(`Warning: could not load snapshot "${id}"`) :
        out.log(`Warning: could not load snapshot "${id}"`);
    }
  }

  const stats = computeStats(snapshots);

  out.log('Snapshot Statistics');
  out.log('-------------------');
  out.log(`Snapshots loaded : ${stats.count}`);
  out.log(`Total tabs       : ${stats.totalTabs}`);
  out.log(`Average tabs     : ${stats.averageTabs.toFixed(2)}`);
  out.log(`Median tabs      : ${stats.medianTabs}`);
  out.log(`Largest snapshot : ${stats.largestId ?? 'n/a'}`);
  out.log(`Smallest snapshot: ${stats.smallestId ?? 'n/a'}`);
}

module.exports = { parseArgs, main };

if (require.main === module) {
  main().catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
