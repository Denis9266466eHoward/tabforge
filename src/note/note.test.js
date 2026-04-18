'use strict';

const {
  createStore,
  setNote,
  getNote,
  removeNote,
  hasNote,
  listNotes,
  filterWithNotes,
} = require('./note');

function makeSnapshot(id) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: new Date().toISOString() };
}

describe('note', () => {
  let store;
  beforeEach(() => { store = createStore(); });

  test('setNote stores text with updatedAt', () => {
    const result = setNote(store, 'abc', 'remember this');
    expect(result.text).toBe('remember this');
    expect(typeof result.updatedAt).toBe('string');
  });

  test('getNote returns stored note', () => {
    setNote(store, 'abc', 'hello');
    expect(getNote(store, 'abc').text).toBe('hello');
  });

  test('getNote returns null for unknown id', () => {
    expect(getNote(store, 'nope')).toBeNull();
  });

  test('hasNote returns true after set', () => {
    setNote(store, 'abc', 'hi');
    expect(hasNote(store, 'abc')).toBe(true);
  });

  test('hasNote returns false for unknown id', () => {
    expect(hasNote(store, 'xyz')).toBe(false);
  });

  test('removeNote deletes note and returns true', () => {
    setNote(store, 'abc', 'bye');
    expect(removeNote(store, 'abc')).toBe(true);
    expect(getNote(store, 'abc')).toBeNull();
  });

  test('removeNote returns false when note does not exist', () => {
    expect(removeNote(store, 'ghost')).toBe(false);
  });

  test('listNotes returns all entries with snapshotId', () => {
    setNote(store, 'a', 'note a');
    setNote(store, 'b', 'note b');
    const list = listNotes(store);
    expect(list).toHaveLength(2);
    expect(list.map((n) => n.snapshotId).sort()).toEqual(['a', 'b']);
  });

  test('filterWithNotes returns only snapshots that have notes', () => {
    setNote(store, 's1', 'yes');
    const snaps = [makeSnapshot('s1'), makeSnapshot('s2')];
    const result = filterWithNotes(store, snaps);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });

  test('setNote throws on invalid snapshotId', () => {
    expect(() => setNote(store, '', 'oops')).toThrow();
  });

  test('setNote throws on non-string text', () => {
    expect(() => setNote(store, 'id', 42)).toThrow();
  });
});
