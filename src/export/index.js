'use strict';

/**
 * export module
 *
 * Provides utilities to export snapshots to portable JSON files
 * and import them back, enabling sharing and archiving of
 * browser session snapshots outside of the local tabforge store.
 *
 * Usage:
 *   const { exportSnapshot, importSnapshot, listExports } = require('./src/export');
 *
 *   // Save a snapshot to disk as a shareable file
 *   exportSnapshot(snapshot, './exports/my-session.json');
 *
 *   // Load it back later or on another machine
 *   const snapshot = importSnapshot('./exports/my-session.json');
 *
 *   // List all exported snapshot files in a directory
 *   const files = listExports('./exports');
 */

const { exportSnapshot, importSnapshot, listExports } = require('./export');

module.exports = { exportSnapshot, importSnapshot, listExports };
