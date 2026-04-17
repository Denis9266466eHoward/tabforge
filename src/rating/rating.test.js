const {
  createStore,
  rateSnapshot,
  getRating,
  removeRating,
  listRated,
  sortByRating,
  averageRating,
} = require('./rating');

function makeSnapshot(id) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: Date.now() };
}

describe('rating', () => {
  let store;
  beforeEach(() => { store = createStore(); });

  test('rateSnapshot stores a valid rating', () => {
    rateSnapshot(store, 'a', 4);
    expect(getRating(store, 'a')).toBe(4);
  });

  test('rateSnapshot rounds decimals', () => {
    rateSnapshot(store, 'b', 3.6);
    expect(getRating(store, 'b')).toBe(4);
  });

  test('rateSnapshot throws on out-of-range value', () => {
    expect(() => rateSnapshot(store, 'c', 6)).toThrow();
    expect(() => rateSnapshot(store, 'c', 0)).toThrow();
  });

  test('getRating returns null for unrated snapshot', () => {
    expect(getRating(store, 'unknown')).toBeNull();
  });

  test('removeRating deletes entry and returns true', () => {
    rateSnapshot(store, 'd', 2);
    expect(removeRating(store, 'd')).toBe(true);
    expect(getRating(store, 'd')).toBeNull();
  });

  test('removeRating returns false when not present', () => {
    expect(removeRating(store, 'ghost')).toBe(false);
  });

  test('listRated filters only rated snapshots', () => {
    rateSnapshot(store, 'x', 5);
    const snaps = [makeSnapshot('x'), makeSnapshot('y')];
    expect(listRated(store, snaps)).toHaveLength(1);
    expect(listRated(store, snaps)[0].id).toBe('x');
  });

  test('sortByRating desc orders highest first', () => {
    rateSnapshot(store, 'p', 2);
    rateSnapshot(store, 'q', 5);
    const snaps = [makeSnapshot('p'), makeSnapshot('q')];
    const sorted = sortByRating(store, snaps);
    expect(sorted[0].id).toBe('q');
  });

  test('sortByRating asc orders lowest first', () => {
    rateSnapshot(store, 'p', 2);
    rateSnapshot(store, 'q', 5);
    const snaps = [makeSnapshot('p'), makeSnapshot('q')];
    const sorted = sortByRating(store, snaps, 'asc');
    expect(sorted[0].id).toBe('p');
  });

  test('averageRating returns null for empty store', () => {
    expect(averageRating(store)).toBeNull();
  });

  test('averageRating computes correctly', () => {
    rateSnapshot(store, 'a', 4);
    rateSnapshot(store, 'b', 2);
    expect(averageRating(store)).toBe(3);
  });
});
