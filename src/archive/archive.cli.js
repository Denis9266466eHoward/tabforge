'use strict';

const { createStore, archiveSnapshot, unarchiveSnapshot, listArchived, purgeArchive } = require('./archive');

// Minimal in-memory store for CLI demo purposes
const store = createStore();

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  return { cmd, args: rest };
}

function main(argv = process.argv.slice(2)) {
  const { cmd, args } = parseArgs(argv);

  if (cmd === 'archive') {
    const [id, name] = args;
    if (!id) { console.error('Usage: archive <id> [name]'); process.exit(1); }
    archiveSnapshot(store, { id, name: name || id, tabs: [], createdAt: new Date().toISOString() });
    console.log(`Archived snapshot: ${id}`);
    return;
  }

  if (cmd === 'unarchive') {
    const [id] = args;
    if (!id) { console.error('Usage: unarchive <id>'); process.exit(1); }
    const snap = unarchiveSnapshot(store, id);
    console.log(`Unarchived snapshot: ${snap.id}`);
    return;
  }

  if (cmd === 'list') {
    const list = listArchived(store);
    if (!list.length) { console.log('No archived snapshots.'); return; }
    list.forEach((s) => console.log(`${s.id}  ${s.name}  (archived: ${s.archivedAt})`));
    return;
  }

  if (cmd === 'purge') {
    purgeArchive(store);
    console.log('Archive purged.');
    return;
  }

  console.error('Commands: archive <id> [name] | unarchive <id> | list | purge');
  process.exit(1);
}

if (require.main === module) main();
module.exports = { parseArgs, main };
