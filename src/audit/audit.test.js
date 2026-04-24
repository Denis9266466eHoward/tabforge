'use strict';

const {
  createStore,
  recordAction,
  getAuditLog,
  filterByAction,
  clearAuditLog,
  summarizeActions,
} = require('./audit');

describe('audit', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  test('createStore returns empty entries array', () => {
    expect(store.entries).toEqual([]);
  });

  test('recordAction adds an entry with expected fields', () => {
    const entry = recordAction(store, 'snap-1', 'create', { actor: 'cli' });
    expect(entry.snapshotId).toBe('snap-1');
    expect(entry.action).toBe('create');
    expect(entry.actor).toBe('cli');
    expect(entry.id).toBeDefined();
    expect(entry.timestamp).toBeDefined();
    expect(store.entries).toHaveLength(1);
  });

  test('recordAction throws on missing snapshotId', () => {
    expect(() => recordAction(store, '', 'create')).toThrow('snapshotId');
  });

  test('recordAction throws on missing action', () => {
    expect(() => recordAction(store, 'snap-1', '')).toThrow('action');
  });

  test('getAuditLog returns only entries for given snapshot, newest first', () => {
    recordAction(store, 'snap-1', 'create');
    recordAction(store, 'snap-2', 'export');
    recordAction(store, 'snap-1', 'rename');

    const log = getAuditLog(store, 'snap-1');
    expect(log).toHaveLength(2);
    expect(log.every(e => e.snapshotId === 'snap-1')).toBe(true);
    // newest first
    expect(log[0].action).toBe('rename');
  });

  test('getAuditLog returns empty array for unknown snapshot', () => {
    expect(getAuditLog(store, 'nope')).toEqual([]);
  });

  test('filterByAction returns only matching entries', () => {
    recordAction(store, 'snap-1', 'create');
    recordAction(store, 'snap-2', 'delete');
    recordAction(store, 'snap-3', 'create');

    const creates = filterByAction(store, 'create');
    expect(creates).toHaveLength(2);
    expect(creates.every(e => e.action === 'create')).toBe(true);
  });

  test('clearAuditLog removes entries for that snapshot only', () => {
    recordAction(store, 'snap-1', 'create');
    recordAction(store, 'snap-2', 'create');
    clearAuditLog(store, 'snap-1');

    expect(getAuditLog(store, 'snap-1')).toHaveLength(0);
    expect(getAuditLog(store, 'snap-2')).toHaveLength(1);
  });

  test('summarizeActions counts actions across all snapshots', () => {
    recordAction(store, 'snap-1', 'create');
    recordAction(store, 'snap-2', 'create');
    recordAction(store, 'snap-1', 'delete');

    const summary = summarizeActions(store);
    expect(summary.create).toBe(2);
    expect(summary.delete).toBe(1);
  });

  test('summarizeActions returns empty object for empty store', () => {
    expect(summarizeActions(store)).toEqual({});
  });
});
