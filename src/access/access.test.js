import { createStore, setAccess, getAccess, removeAccess, hasAccess, listAccess, filterByAccess } from './access.js';

function makeSnapshot(id) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: Date.now() };
}

let store;
beforeEach(() => { store = createStore(); });

test('setAccess assigns a role', () => {
  setAccess(store, 's1', 'alice', 'editor');
  expect(getAccess(store, 's1', 'alice')).toBe('editor');
});

test('setAccess rejects invalid role', () => {
  expect(() => setAccess(store, 's1', 'alice', 'superadmin')).toThrow();
});

test('getAccess returns null for unknown user', () => {
  expect(getAccess(store, 's1', 'bob')).toBeNull();
});

test('removeAccess removes a user', () => {
  setAccess(store, 's1', 'alice', 'viewer');
  expect(removeAccess(store, 's1', 'alice')).toBe(true);
  expect(getAccess(store, 's1', 'alice')).toBeNull();
});

test('removeAccess returns false if not present', () => {
  expect(removeAccess(store, 's1', 'nobody')).toBe(false);
});

test('hasAccess respects role hierarchy', () => {
  setAccess(store, 's1', 'alice', 'editor');
  expect(hasAccess(store, 's1', 'alice', 'viewer')).toBe(true);
  expect(hasAccess(store, 's1', 'alice', 'editor')).toBe(true);
  expect(hasAccess(store, 's1', 'alice', 'owner')).toBe(false);
});

test('listAccess returns all users for snapshot', () => {
  setAccess(store, 's1', 'alice', 'owner');
  setAccess(store, 's1', 'bob', 'viewer');
  const result = listAccess(store, 's1');
  expect(result).toEqual({ alice: 'owner', bob: 'viewer' });
});

test('filterByAccess returns only accessible snapshots', () => {
  const snaps = [makeSnapshot('s1'), makeSnapshot('s2'), makeSnapshot('s3')];
  setAccess(store, 's1', 'alice', 'viewer');
  setAccess(store, 's3', 'alice', 'editor');
  const result = filterByAccess(store, snaps, 'alice', 'viewer');
  expect(result.map(s => s.id)).toEqual(['s1', 's3']);
});
