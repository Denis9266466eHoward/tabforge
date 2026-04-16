#!/usr/bin/env node
// compare.cli.js — CLI interface for snapshot comparison

const { compareSnapshots } = require('./compare');

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: compare <snapshotA-json> <snapshotB-json>');
    process.exit(1);
  }
  return { fileA: args[0], fileB: args[1] };
}

function main(argv = process.argv) {
  const { fileA, fileB } = parseArgs(argv);
  let snapshotA, snapshotB;
  try {
    snapshotA = JSON.parse(require('fs').readFileSync(fileA, 'utf8'));
    snapshotB = JSON.parse(require('fs').readFileSync(fileB, 'utf8'));
  } catch (e) {
    console.error('Failed to read snapshot files:', e.message);
    process.exit(1);
  }

  const result = compareSnapshots(snapshotA, snapshotB);
  console.log(`Comparing ${result.snapshotAId} <-> ${result.snapshotBId}`);
  console.log(`  Tabs only in A (${result.onlyInA.length}):`, result.onlyInA.map(t => t.url));
  console.log(`  Tabs only in B (${result.onlyInB.length}):`, result.onlyInB.map(t => t.url));
  console.log(`  Shared tabs   (${result.inBoth.length})`);
  console.log(`  Similarity: ${(result.similarity * 100).toFixed(1)}%`);
}

if (require.main === module) main();
module.exports = { parseArgs, main };
