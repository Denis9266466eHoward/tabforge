'use strict';

const {
  createStore,
  recordAccess,
  getLastAccessed,
  removeActivity,
  listByRecency,
  neverAccessed,
  summarizeActivity,
} = require('./activity');

function makeSnapshot(id) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: Date.now() };
}

test('recordAccess stores timestamp', () => {
  const store = createStore();
  recordAccess(store, 'abc', 1000);
  expect(getLastAccessed(store, 'abc')).toBe(1000);
});

test('getLastAccessed returns null for unknown id', () => {
  const store = createStore();
  expect(getLastAccessed(store, 'nope')).toBeNull();
});

test('recordAccess defaults to now', () => {
  const store = createStore();
  const before = Date.now();
  recordAccess(store, 'x');
  expect(getLastAccessed(store, 'x')).toBeGreaterThanOrEqual(before);
});

test('removeActivity clears entry', () => {
  const store = createStore();
  recordAccess(store, 'abc', 999);
  removeActivity(store, 'abc');
  expect(getLastAccessed(store, 'abc')).toBeNull();
});

test('listByRecency sorts newest first', () => {
  const store = createStore();
  const snaps = ['a', 'b', 'c'].map(makeSnapshot);
  recordAccess(store, 'a', 100);
  recordAccess(store, 'b', 300);
  recordAccess(store, 'c', 200);
  const sorted = listByRecency(store, snaps);
  expect(sorted.map(s => s.id)).toEqual(['b', 'c', 'a']);
});

test('neverAccessed returns snapshots with no record', () => {
  const store = createStore();
  const snaps = ['a', 'b', 'c'].map(makeSnapshot);
  recordAccess(store, 'a', 100);
  const result = neverAccessed(store, snaps);
  expect(result.map(s => s.id)).toEqual(['b', 'c']);
});

test('summarizeActivity on empty store', () => {
  const store = createStore();
  expect(summarizeActivity(store)).toEqual({ count: 0, mostRecent: null, oldest: null });
});

test('summarizeActivity returns correct values', () => {
  const store = createStore();
  recordAccess(store, 'a', 100);
  recordAccess(store, 'b', 500);
  const summary = summarizeActivity(store);
  expect(summary.count).toBe(2);
  expect(summary.mostRecent).toBe(500);
  expect(summary.oldest).toBe(100);
});
