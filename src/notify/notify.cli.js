#!/usr/bin/env node
/**
 * CLI utility: listen for tabforge notify events and print them to stdout.
 * Usage: node notify.cli.js [--event <eventName>] [--json]
 *
 * In practice this is wired into the main tabforge CLI process via IPC or
 * by importing and calling subscribe() before other operations.
 */

const { subscribe, EVENTS } = require('./notify');

function parseArgs(argv = process.argv.slice(2)) {
  const args = { event: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--event' && argv[i + 1]) {
      args.event = argv[++i];
    } else if (argv[i] === '--json') {
      args.json = true;
    }
  }
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  const targetEvents = args.event
    ? [args.event]
    : Object.values(EVENTS);

  for (const event of targetEvents) {
    subscribe(event, (payload) => {
      if (args.json) {
        process.stdout.write(JSON.stringify(payload) + '\n');
      } else {
        const { event: ev, timestamp, ...rest } = payload;
        const detail = Object.entries(rest)
          .map(([k, v]) => `${k}=${v}`)
          .join(' ');
        process.stdout.write(`[${timestamp}] ${ev}${detail ? ' ' + detail : ''}\n`);
      }
    });
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs, main };
