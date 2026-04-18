import {
  createStore,
  setPriority,
  getPriority,
  removePriority,
  filterByPriority,
  sortByPriority,
  listByPriority,
  LEVELS,
} from './priority.js';

function makeSnapshot(id) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: Date.now() };
}

describe('priority', () => {
  test('createStore returns empty object', () => {
    expect(createStore()).toEqual({});
  });

  test('setPriority stores level for snapshot', () => {
    let store = createStore();
    store = setPriority(store, 'abc', 'high');
    expect(getPriority(store, 'abc')).toBe('high');
  });

  test('getPriority defaults to normal', () => {
    const store = createStore();
    expect(getPriority(store, 'missing')).toBe('normal');
  });

  test('setPriority throws on invalid level', () => {
    const store = createStore();
    expect(() => setPriority(store, 'abc', 'urgent')).toThrow('Invalid priority level');
  });

  test('removePriority removes entry', () => {
    let store = createStore();
    store = setPriority(store, 'abc', 'critical');
    store = removePriority(store, 'abc');
    expect(getPriority(store, 'abc')).toBe('normal');
  });

  test('filterByPriority returns matching snapshots', () => {
    let store = createStore();
    const snaps = ['a', 'b', 'c'].map(makeSnapshot);
    store = setPriority(store, 'a', 'high');
    store = setPriority(store, 'b', 'high');
    const result = filterByPriority(store, snaps, 'high');
    expect(result.map(s => s.id)).toEqual(['a', 'b']);
  });

  test('sortByPriority orders highest first', () => {
    let store = createStore();
    const snaps = ['x', 'y', 'z'].map(makeSnapshot);
    store = setPriority(store, 'x', 'low');
    store = setPriority(store, 'y', 'critical');
    store = setPriority(store, 'z', 'high');
    const sorted = sortByPriority(store, snaps);
    expect(sorted.map(s => s.id)).toEqual(['y', 'z', 'x']);
  });

  test('listByPriority groups snapshots by level', () => {
    let store = createStore();
    const snaps = ['p', 'q'].map(makeSnapshot);
    store = setPriority(store, 'p', 'critical');
    const grouped = listByPriority(store, snaps);
    expect(LEVELS.every(l => Array.isArray(grouped[l]))).toBe(true);
    expect(grouped.critical.map(s => s.id)).toContain('p');
    expect(grouped.normal.map(s => s.id)).toContain('q');
  });
});
