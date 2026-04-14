import { randomUUID } from 'crypto';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DEFAULT_SNAPSHOT_DIR = '.tabforge';

/**
 * Creates a new session snapshot from a list of tabs.
 * @param {string} name - Human-readable name for the snapshot
 * @param {Array<{url: string, title?: string}>} tabs - Array of tab objects
 * @param {string} [dir] - Directory to save the snapshot
 * @returns {object} The created snapshot object
 */
export function createSnapshot(name, tabs, dir = DEFAULT_SNAPSHOT_DIR) {
  if (!name || typeof name !== 'string') {
    throw new Error('Snapshot name must be a non-empty string');
  }

  if (!Array.isArray(tabs) || tabs.length === 0) {
    throw new Error('Tabs must be a non-empty array');
  }

  const snapshot = {
    id: randomUUID(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    tabs: tabs.map((tab) => ({
      url: tab.url,
      title: tab.title || '',
    })),
  };

  const filePath = resolve(dir, `${snapshot.id}.json`);
  writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');

  return snapshot;
}

/**
 * Loads a snapshot by ID from the given directory.
 * @param {string} id - UUID of the snapshot
 * @param {string} [dir] - Directory to read from
 * @returns {object} The snapshot object
 */
export function loadSnapshot(id, dir = DEFAULT_SNAPSHOT_DIR) {
  const filePath = resolve(dir, `${id}.json`);

  if (!existsSync(filePath)) {
    throw new Error(`Snapshot not found: ${id}`);
  }

  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}
