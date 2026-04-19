#!/usr/bin/env node
'use strict';

const { createSnapshot, loadSnapshot } = require('./snapshot');
const { saveSnapshotToDisk, readSnapshotFromDisk, listSnapshotIds } = require('../storage/storage');

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  return { cmd, args: rest };
}

async function main(argv = process.argv.slice(2)) {
  const { cmd, args } = parseArgs(argv);

  switch (cmd) {
    case 'create': {
      const [name, ...urls] = args;
      if (!name || urls.length === 0) {
        console.error('Usage: snapshot create <name> <url1> [url2 ...]');
        process.exit(1);
      }
      const tabs = urls.map((url, i) => ({ id: `tab-${i + 1}`, url, title: url }));
      const snapshot = createSnapshot(name, tabs);
      await saveSnapshotToDisk(snapshot);
      console.log(`Created snapshot "${name}" with ${tabs.length} tab(s). ID: ${snapshot.id}`);
      break;
    }

    case 'load': {
      const [id] = args;
      if (!id) {
        console.error('Usage: snapshot load <id>');
        process.exit(1);
      }
      const raw = await readSnapshotFromDisk(id);
      const snapshot = loadSnapshot(raw);
      console.log(`Snapshot: ${snapshot.name} (${snapshot.tabs.length} tabs)`);
      snapshot.tabs.forEach((t, i) => console.log(`  ${i + 1}. ${t.url}`));
      break;
    }

    case 'list': {
      const ids = await listSnapshotIds();
      if (ids.length === 0) {
        console.log('No snapshots found.');
      } else {
        ids.forEach(id => console.log(id));
      }
      break;
    }

    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Commands: create, load, list');
      process.exit(1);
  }
}

module.exports = { parseArgs, main };
