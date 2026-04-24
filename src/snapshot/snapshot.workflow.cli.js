#!/usr/bin/env node
/**
 * CLI entry point for snapshot workflow commands.
 * Usage:
 *   node snapshot.workflow.cli.js create <name> <url1,url2,...>
 *   node snapshot.workflow.cli.js load   <id>
 *   node snapshot.workflow.cli.js remove <id>
 */

const { createAndSave, loadAndTrack, removeAndRecord } = require('./snapshot.workflow');
const { deleteSnapshotFromDisk } = require('../storage/storage');

function parseArgs(argv) {
  const [,, command, ...rest] = argv;
  return { command, args: rest };
}

function main(argv = process.argv) {
  const { command, args } = parseArgs(argv);

  if (command === 'create') {
    const [name, urlList] = args;
    if (!name || !urlList) {
      console.error('Usage: create <name> <url1,url2,...>');
      process.exit(1);
    }
    const tabs = urlList.split(',').map((url, i) => ({
      id: `t${i}`,
      url: url.trim(),
      title: url.trim(),
    }));
    const { snapshot, errors } = createAndSave(name, tabs);
    if (errors.length) {
      console.error('Validation errors:', errors.join(', '));
      process.exit(1);
    }
    console.log(`Snapshot created: ${snapshot.id}`);
    return;
  }

  if (command === 'load') {
    const [id] = args;
    if (!id) { console.error('Usage: load <id>'); process.exit(1); }
    const snap = loadAndTrack(id);
    if (!snap) { console.error(`Snapshot not found: ${id}`); process.exit(1); }
    console.log(JSON.stringify(snap, null, 2));
    return;
  }

  if (command === 'remove') {
    const [id] = args;
    if (!id) { console.error('Usage: remove <id>'); process.exit(1); }
    const ok = removeAndRecord(id, deleteSnapshotFromDisk);
    if (!ok) { console.error(`Could not remove snapshot: ${id}`); process.exit(1); }
    console.log(`Snapshot removed: ${id}`);
    return;
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

if (require.main === module) main();
module.exports = { parseArgs, main };
