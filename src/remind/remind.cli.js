#!/usr/bin/env node
// remind.cli.js — CLI interface for managing snapshot reminders

const { createStore, setReminder, getDueReminders, dismissReminder, listReminders } = require('./remind');

function parseArgs(argv) {
  const [command, ...rest] = argv;
  return { command, args: rest };
}

function printReminder(r) {
  const status = r.dismissed ? '[dismissed]' : new Date(r.remindAt) <= new Date() ? '[DUE]' : '[pending]';
  console.log(`  ${status} ${r.id}  snapshot=${r.snapshotId}  at=${r.remindAt}  msg="${r.message}"`);
}

async function main(argv = process.argv.slice(2), store = createStore()) {
  const { command, args } = parseArgs(argv);

  switch (command) {
    case 'set': {
      const [snapshotId, message, isoDate, repeat = null] = args;
      if (!snapshotId || !message || !isoDate) {
        console.error('Usage: remind set <snapshotId> <message> <ISO-date> [repeat]');
        process.exitCode = 1;
        return;
      }
      const r = setReminder(store, snapshotId, { message, remindAt: new Date(isoDate), repeat });
      console.log('Reminder set:', r.id);
      break;
    }
    case 'due': {
      const due = getDueReminders(store);
      if (due.length === 0) { console.log('No due reminders.'); break; }
      console.log(`Due reminders (${due.length}):`);
      due.forEach(printReminder);
      break;
    }
    case 'dismiss': {
      const [id] = args;
      if (!id) { console.error('Usage: remind dismiss <reminderId>'); process.exitCode = 1; return; }
      dismissReminder(store, id);
      console.log('Dismissed:', id);
      break;
    }
    case 'list': {
      const [snapshotId = null] = args;
      const items = listReminders(store, snapshotId);
      if (items.length === 0) { console.log('No reminders.'); break; }
      items.forEach(printReminder);
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Commands: set | due | dismiss | list');
      process.exitCode = 1;
  }
}

module.exports = { parseArgs, main };
if (require.main === module) main();
