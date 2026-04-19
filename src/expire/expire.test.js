const {
  createStore,
  setExpiry,
  getExpiry,
  removeExpiry,
  isExpired,
  listExpired,
  listActive,
  purgeExpired,
} = require('./expire');

function makeSnapshot(id) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: new Date().toISOString() };
}

const PAST = new Date('2000-01-01T00:00:00Z');
const FUTURE = new Date('2099-01-01T00:00:00Z');
const NOW = new Date('2024-06-01T00:00:00Z');

describe('expire', () => {
  test('setExpiry and getExpiry round-trip', () => {
    const store = createStore();
    setExpiry(store, 'a', FUTURE);
    expect(getExpiry(store, 'a')).toEqual(FUTURE);
  });

  test('getExpiry returns null for unknown id', () => {
    const store = createStore();
    expect(getExpiry(store, 'nope')).toBeNull();
  });

  test('setExpiry throws on invalid date', () => {
    const store = createStore();
    expect(() => setExpiry(store, 'a', 'not-a-date')).toThrow();
    expect(() => setExpiry(store, 'a', new Date('invalid'))).toThrow();
  });

  test('removeExpiry clears the entry', () => {
    const store = createStore();
    setExpiry(store, 'a', FUTURE);
    removeExpiry(store, 'a');
    expect(getExpiry(store, 'a')).toBeNull();
  });

  test('isExpired returns true for past expiry', () => {
    const store = createStore();
    setExpiry(store, 'a', PAST);
    expect(isExpired(store, 'a', NOW)).toBe(true);
  });

  test('isExpired returns false for future expiry', () => {
    const store = createStore();
    setExpiry(store, 'a', FUTURE);
    expect(isExpired(store, 'a', NOW)).toBe(false);
  });

  test('isExpired returns false when no expiry set', () => {
    const store = createStore();
    expect(isExpired(store, 'a', NOW)).toBe(false);
  });

  test('listExpired filters correctly', () => {
    const store = createStore();
    const s1 = makeSnapshot('s1');
    const s2 = makeSnapshot('s2');
    setExpiry(store, 's1', PAST);
    setExpiry(store, 's2', FUTURE);
    expect(listExpired(store, [s1, s2], NOW)).toEqual([s1]);
  });

  test('listActive excludes expired', () => {
    const store = createStore();
    const s1 = makeSnapshot('s1');
    const s2 = makeSnapshot('s2');
    setExpiry(store, 's1', PAST);
    expect(listActive(store, [s1, s2], NOW)).toEqual([s2]);
  });

  test('purgeExpired removes expired entries from store and returns ids', () => {
    const store = createStore();
    const s1 = makeSnapshot('s1');
    const s2 = makeSnapshot('s2');
    setExpiry(store, 's1', PAST);
    setExpiry(store, 's2', FUTURE);
    const purged = purgeExpired(store, [s1, s2], NOW);
    expect(purged).toEqual(['s1']);
    expect(getExpiry(store, 's1')).toBeNull();
    expect(getExpiry(store, 's2')).toEqual(FUTURE);
  });
});
