#!/usr/bin/env node
// compare.cli.js — CLI interface for snapshot comparison

const { compareSnapshots } = require('./compare');
const fs = require('fs');

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: compare <snapshotA-json> <snapshotB-json>');
    process.exit(1);
  }
  return { fileA: args[0], fileB: args[1] };
}

function readSnapshot(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Failed to read or parse "${filePath}": ${e.message}`);
    process.exit(1);
  }
}

function main(argv = process.argv) {
  const { fileA, fileB } = parseArgs(argv);
  const snapshotA = readSnapshot(fileA);
  const snapshotB = readSnapshot(fileB);

  const result = compareSnapshots(snapshotA, snapshotB);
  console.log(`Comparing ${result.snapshotAId} <-> ${result.snapshotBId}`);
  console.log(`  Tabs only in A (${result.onlyInA.length}):`, result.onlyInA.map(t => t.url));
  console.log(`  Tabs only in B (${result.onlyInB.length}):`, result.onlyInB.map(t => t.url));
  console.log(`  Shared tabs   (${result.inBoth.length})`);
  console.log(`  Similarity: ${(result.similarity * 100).toFixed(1)}%`);
}

if (require.main === module) main();
module.exports = { parseArgs, readSnapshot, main };
