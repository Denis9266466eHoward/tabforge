'use strict';

const {
  createStore,
  archiveSnapshot,
  unarchiveSnapshot,
  isArchived,
  listArchived,
  purgeArchive,
} = require('./archive');

function makeSnapshot(id = 'snap-1') {
  return { id, name: `Snapshot ${id}`, tabs: [], createdAt: new Date().toISOString() };
}

describe('archiveSnapshot', () => {
  it('adds snapshot to archive', () => {
    const store = createStore();
    archiveSnapshot(store, makeSnapshot('a'));
    expect(isArchived(store, 'a')).toBe(true);
  });

  it('throws on duplicate archive', () => {
    const store = createStore();
    archiveSnapshot(store, makeSnapshot('a'));
    expect(() => archiveSnapshot(store, makeSnapshot('a'))).toThrow('already archived');
  });

  it('throws on invalid snapshot', () => {
    const store = createStore();
    expect(() => archiveSnapshot(store, null)).toThrow('Invalid snapshot');
  });
});

describe('unarchiveSnapshot', () => {
  it('removes and returns snapshot', () => {
    const store = createStore();
    const snap = makeSnapshot('b');
    archiveSnapshot(store, snap);
    const result = unarchiveSnapshot(store, 'b');
    expect(result.id).toBe('b');
    expect(isArchived(store, 'b')).toBe(false);
  });

  it('throws if not archived', () => {
    const store = createStore();
    expect(() => unarchiveSnapshot(store, 'missing')).toThrow('not found in archive');
  });
});

describe('listArchived', () => {
  it('returns all archived snapshots with archivedAt', () => {
    const store = createStore();
    archiveSnapshot(store, makeSnapshot('x'));
    archiveSnapshot(store, makeSnapshot('y'));
    const list = listArchived(store);
    expect(list).toHaveLength(2);
    expect(list[0]).toHaveProperty('archivedAt');
  });
});

describe('purgeArchive', () => {
  it('clears all archived snapshots', () => {
    const store = createStore();
    archiveSnapshot(store, makeSnapshot('z'));
    purgeArchive(store);
    expect(listArchived(store)).toHaveLength(0);
  });
});
