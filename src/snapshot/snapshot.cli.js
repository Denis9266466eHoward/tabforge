#!/usr/bin/env node
'use strict';

const { createSnapshot, loadSnapshot } = require('./snapshot');
const { saveSnapshotToDisk, readSnapshotFromDisk, listSnapshotIds, deleteSnapshotFromDisk } = require('../storage/storage');

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = {};
  const positional = [];

  for (let i = 0; i < rest.length; i++) {
    if (rest[i].startsWith('--')) {
      const key = rest[i].slice(2);
      const next = rest[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(rest[i]);
    }
  }

  return { command, flags, positional };
}

async function main(argv = process.argv.slice(2)) {
  const { command, flags, positional } = parseArgs(argv);

  switch (command) {
    case 'create': {
      const name = flags.name || positional[0] || 'untitled';
      const tabs = flags.tabs ? JSON.parse(flags.tabs) : [];
      const snapshot = createSnapshot({ name, tabs });
      await saveSnapshotToDisk(snapshot);
      console.log(`Snapshot created: ${snapshot.id}`);
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
    case 'show': {
      const id = positional[0] || flags.id;
      if (!id) { console.error('Error: snapshot id required'); process.exit(1); }
      const raw = await readSnapshotFromDisk(id);
      const snapshot = loadSnapshot(raw);
      console.log(JSON.stringify(snapshot, null, 2));
      break;
    }
    case 'delete': {
      const id = positional[0] || flags.id;
      if (!id) { console.error('Error: snapshot id required'); process.exit(1); }
      await deleteSnapshotFromDisk(id);
      console.log(`Snapshot deleted: ${id}`);
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Usage: snapshot <create|list|show|delete> [options]');
      process.exit(1);
  }
}

module.exports = { parseArgs, main };
