export { createSnapshot, loadSnapshot } from './snapshot.js';

/**
 * Snapshot module entry point for tabforge.
 *
 * Provides utilities to create and retrieve browser session snapshots.
 * Snapshots are stored as JSON files identified by UUID.
 *
 * Usage:
 *   import { createSnapshot, loadSnapshot } from './src/snapshot/index.js';
 *
 *   const snap = createSnapshot('my-env', [
 *     { url: 'https://localhost:3000', title: 'Dev Server' },
 *     { url: 'https://github.com/myorg/myrepo', title: 'GitHub' },
 *   ]);
 *
 *   const loaded = loadSnapshot(snap.id);
 *   console.log(loaded.tabs);
 */
