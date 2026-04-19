const {
  createStore,
  setQuota,
  getQuota,
  removeQuota,
  hasQuota,
  checkSnapshotQuota,
  checkTabQuota,
  listQuotas
} = require('./quota');

let store;
beforeEach(() => { store = createStore(); });

test('setQuota and getQuota round-trip', () => {
  setQuota(store, 'user:alice', { maxSnapshots: 10, maxTabs: 50 });
  expect(getQuota(store, 'user:alice')).toEqual({ maxSnapshots: 10, maxTabs: 50 });
});

test('getQuota returns null for unknown scope', () => {
  expect(getQuota(store, 'unknown')).toBeNull();
});

test('hasQuota', () => {
  expect(hasQuota(store, 'team:dev')).toBe(false);
  setQuota(store, 'team:dev', { maxSnapshots: 5 });
  expect(hasQuota(store, 'team:dev')).toBe(true);
});

test('removeQuota removes scope', () => {
  setQuota(store, 'team:dev', { maxSnapshots: 5 });
  removeQuota(store, 'team:dev');
  expect(hasQuota(store, 'team:dev')).toBe(false);
});

test('checkSnapshotQuota allows when under limit', () => {
  setQuota(store, 'user:alice', { maxSnapshots: 5 });
  expect(checkSnapshotQuota(store, 'user:alice', 4).allowed).toBe(true);
});

test('checkSnapshotQuota blocks when at limit', () => {
  setQuota(store, 'user:alice', { maxSnapshots: 5 });
  const result = checkSnapshotQuota(store, 'user:alice', 5);
  expect(result.allowed).toBe(false);
  expect(result.reason).toMatch(/5/);
});

test('checkSnapshotQuota allows when no quota set', () => {
  expect(checkSnapshotQuota(store, 'no-scope', 999).allowed).toBe(true);
});

test('checkTabQuota allows when under limit', () => {
  setQuota(store, 'global', { maxTabs: 20 });
  expect(checkTabQuota(store, 'global', 20).allowed).toBe(true);
});

test('checkTabQuota blocks when over limit', () => {
  setQuota(store, 'global', { maxTabs: 20 });
  const result = checkTabQuota(store, 'global', 21);
  expect(result.allowed).toBe(false);
  expect(result.reason).toMatch(/20/);
});

test('listQuotas returns all scopes', () => {
  setQuota(store, 'a', { maxSnapshots: 3 });
  setQuota(store, 'b', { maxTabs: 10 });
  const list = listQuotas(store);
  expect(list).toHaveLength(2);
  expect(list.map(q => q.scope)).toContain('a');
});
