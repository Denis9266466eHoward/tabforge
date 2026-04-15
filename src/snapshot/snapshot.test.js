import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createSnapshot, loadSnapshot } from './snapshot.js';

const TEST_DIR = resolve('.tabforge-test');

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('createSnapshot', () => {
  it('creates a snapshot with valid data', () => {
    const tabs = [{ url: 'https://example.com', title: 'Example' }];
    const snap = createSnapshot('my-session', tabs, TEST_DIR);

    expect(snap.name).toBe('my-session');
    expect(snap.tabs).toHaveLength(1);
    expect(snap.tabs[0].url).toBe('https://example.com');
    expect(snap.id).toBeTruthy();
    expect(snap.createdAt).toBeTruthy();
  });

  it('writes snapshot file to disk', () => {
    const tabs = [{ url: 'https://github.com' }];
    const snap = createSnapshot('dev-session', tabs, TEST_DIR);
    const filePath = resolve(TEST_DIR, `${snap.id}.json`);

    expect(existsSync(filePath)).toBe(true);
  });

  it('throws if name is empty', () => {
    expect(() => createSnapshot('', [{ url: 'https://a.com' }], TEST_DIR)).toThrow(
      'Snapshot name must be a non-empty string'
    );
  });

  it('throws if name is not a string', () => {
    expect(() => createSnapshot(42, [{ url: 'https://a.com' }], TEST_DIR)).toThrow(
      'Snapshot name must be a non-empty string'
    );
  });

  it('throws if tabs array is empty', () => {
    expect(() => createSnapshot('test', [], TEST_DIR)).toThrow(
      'Tabs must be a non-empty array'
    );
  });

  it('throws if tabs is not an array', () => {
    expect(() => createSnapshot('test', null, TEST_DIR)).toThrow(
      'Tabs must be a non-empty array'
    );
  });
});

describe('loadSnapshot', () => {
  it('loads a previously created snapshot', () => {
    const tabs = [{ url: 'https://docs.example.com', title: 'Docs' }];
    const created = createSnapshot('load-test', tabs, TEST_DIR);
    const loaded = loadSnapshot(created.id, TEST_DIR);

    expect(loaded.id).toBe(created.id);
    expect(loaded.name).toBe('load-test');
    expect(loaded.tabs[0].url).toBe('https://docs.example.com');
  });

  it('throws if snapshot does not exist', () => {
    expect(() => loadSnapshot('nonexistent-id', TEST_DIR)).toThrow(
      'Snapshot not found: nonexistent-id'
    );
  });
});
