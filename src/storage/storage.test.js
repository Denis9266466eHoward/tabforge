const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  ensureStorageDir,
  saveSnapshotToDisk,
  readSnapshotFromDisk,
  listSnapshotIds,
  deleteSnapshotFromDisk,
} = require('./storage');

let testDir;

beforeEach(() => {
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-test-'));
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

describe('ensureStorageDir', () => {
  it('creates the directory if it does not exist', () => {
    const newDir = path.join(testDir, 'new-subdir');
    expect(fs.existsSync(newDir)).toBe(false);
    ensureStorageDir(newDir);
    expect(fs.existsSync(newDir)).toBe(true);
  });

  it('does not throw if directory already exists', () => {
    expect(() => ensureStorageDir(testDir)).not.toThrow();
  });
});

describe('saveSnapshotToDisk', () => {
  it('writes a snapshot file and returns the file path', () => {
    const snapshot = { id: 'snap-001', tabs: [], createdAt: Date.now() };
    const filePath = saveSnapshotToDisk(snapshot, testDir);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(filePath).toContain('snap-001.json');
  });

  it('throws if snapshot has no id', () => {
    expect(() => saveSnapshotToDisk({ tabs: [] }, testDir)).toThrow(
      'Invalid snapshot: missing required id field'
    );
  });

  it('persists valid JSON content', () => {
    const snapshot = { id: 'snap-002', tabs: ['http://example.com'], createdAt: 0 };
    const filePath = saveSnapshotToDisk(snapshot, testDir);
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(parsed).toEqual(snapshot);
  });
});

describe('readSnapshotFromDisk', () => {
  it('reads and returns a saved snapshot', () => {
    const snapshot = { id: 'snap-003', tabs: [], createdAt: 123 };
    saveSnapshotToDisk(snapshot, testDir);
    const result = readSnapshotFromDisk('snap-003', testDir);
    expect(result).toEqual(snapshot);
  });

  it('throws if snapshot does not exist', () => {
    expect(() => readSnapshotFromDisk('nonexistent', testDir)).toThrow(
      'Snapshot not found: nonexistent'
    );
  });
});

describe('listSnapshotIds', () => {
  it('returns empty array when directory does not exist', () => {
    const missing = path.join(testDir, 'ghost');
    expect(listSnapshotIds(missing)).toEqual([]);
  });

  it('returns ids of all saved snapshots', () => {
    saveSnapshotToDisk({ id: 'a1', tabs: [] }, testDir);
    saveSnapshotToDisk({ id: 'b2', tabs: [] }, testDir);
    const ids = listSnapshotIds(testDir);
    expect(ids).toContain('a1');
    expect(ids).toContain('b2');
    expect(ids.length).toBe(2);
  });
});

describe('deleteSnapshotFromDisk', () => {
  it('deletes an existing snapshot and returns true', () => {
    saveSnapshotToDisk({ id: 'del-1', tabs: [] }, testDir);
    const result = deleteSnapshotFromDisk('del-1', testDir);
    expect(result).toBe(true);
    expect(listSnapshotIds(testDir)).not.toContain('del-1');
  });

  it('returns false when snapshot does not exist', () => {
    const result = deleteSnapshotFromDisk('ghost-id', testDir);
    expect(result).toBe(false);
  });
});
