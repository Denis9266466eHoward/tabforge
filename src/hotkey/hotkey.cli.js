#!/usr/bin/env node
// hotkey.cli.js — CLI interface for hotkey management

const { createStore, setHotkey, removeHotkey, listHotkeys, getSnapshotForHotkey } = require('./hotkey');

// In a real app, store would be persisted; here we demo with in-memory
const store = createStore();

function parseArgs(argv) {
  const [,, command, ...rest] = argv;
  return { command, args: rest };
}

function main(argv) {
  const { command, args } = parseArgs(argv);

  if (command === 'set') {
    const [key, snapshotId] = args;
    if (!key || !snapshotId) {
      console.error('Usage: hotkey set <key> <snapshotId>');
      process.exit(1);
    }
    try {
      setHotkey(store, key, snapshotId);
      console.log(`Hotkey "${key}" assigned to snapshot "${snapshotId}"`);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  } else if (command === 'remove') {
    const [key] = args;
    removeHotkey(store, key);
    console.log(`Hotkey "${key}" removed`);
  } else if (command === 'list') {
    const list = listHotkeys(store);
    if (list.length === 0) {
      console.log('No hotkeys assigned.');
    } else {
      list.forEach(({ key, snapshotId }) => console.log(`${key} -> ${snapshotId}`));
    }
  } else if (command === 'resolve') {
    const [key] = args;
    const id = getSnapshotForHotkey(store, key);
    console.log(id ? `${key} -> ${id}` : `No snapshot for hotkey "${key}"`);
  } else {
    console.error('Commands: set, remove, list, resolve');
    process.exit(1);
  }
}

if (require.main === module) main(process.argv);

module.exports = { parseArgs, main };
