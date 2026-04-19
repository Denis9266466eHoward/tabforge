const {
  createStore,
  setHotkey,
  removeHotkey,
  getHotkey,
  getSnapshotForHotkey,
  listHotkeys,
  clearHotkeysForSnapshot,
} = require('./hotkey');

function makeSnapshot(id) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: Date.now() };
}

test('setHotkey assigns a key to a snapshot', () => {
  const store = createStore();
  const snap = makeSnapshot('s1');
  setHotkey(store, 'ctrl+1', snap.id);
  expect(getSnapshotForHotkey(store, 'ctrl+1')).toBe('s1');
});

test('getHotkey returns the key for a snapshot', () => {
  const store = createStore();
  setHotkey(store, 'ctrl+2', 's2');
  expect(getHotkey(store, 's2')).toBe('ctrl+2');
});

test('getHotkey returns null if not assigned', () => {
  const store = createStore();
  expect(getHotkey(store, 'unknown')).toBeNull();
});

test('setHotkey throws if key already taken by different snapshot', () => {
  const store = createStore();
  setHotkey(store, 'ctrl+3', 's1');
  expect(() => setHotkey(store, 'ctrl+3', 's2')).toThrow();
});

test('setHotkey allows reassigning same snapshot to same key', () => {
  const store = createStore();
  setHotkey(store, 'ctrl+4', 's1');
  expect(() => setHotkey(store, 'ctrl+4', 's1')).not.toThrow();
});

test('removeHotkey removes the key', () => {
  const store = createStore();
  setHotkey(store, 'ctrl+5', 's1');
  removeHotkey(store, 'ctrl+5');
  expect(getSnapshotForHotkey(store, 'ctrl+5')).toBeNull();
});

test('listHotkeys returns all entries', () => {
  const store = createStore();
  setHotkey(store, 'ctrl+1', 's1');
  setHotkey(store, 'ctrl+2', 's2');
  const list = listHotkeys(store);
  expect(list).toHaveLength(2);
  expect(list).toEqual(expect.arrayContaining([{ key: 'ctrl+1', snapshotId: 's1' }]));
});

test('clearHotkeysForSnapshot removes all keys for a snapshot', () => {
  const store = createStore();
  setHotkey(store, 'ctrl+9', 's1');
  setHotkey(store, 'ctrl+0', 's2');
  clearHotkeysForSnapshot(store, 's1');
  expect(getHotkey(store, 's1')).toBeNull();
  expect(getSnapshotForHotkey(store, 'ctrl+0')).toBe('s2');
});

test('setHotkey throws on empty key', () => {
  const store = createStore();
  expect(() => setHotkey(store, '', 's1')).toThrow();
});
