const { createStore, addFavorite, removeFavorite, isFavorite, listFavorites, filterFavorites } = require('./favorite');

function makeSnapshot(id) {
  return { id, name: `Snapshot ${id}`, tabs: [], createdAt: new Date().toISOString() };
}

describe('favorite', () => {
  let store;
  beforeEach(() => { store = createStore(); });

  test('createStore returns empty favorites', () => {
    expect(store.favorites).toEqual({});
  });

  test('addFavorite marks a snapshot as favorite', () => {
    const s = addFavorite(store, 'snap-1');
    expect(s.favorites['snap-1']).toBe(true);
  });

  test('addFavorite does not mutate original store', () => {
    addFavorite(store, 'snap-1');
    expect(store.favorites['snap-1']).toBeUndefined();
  });

  test('addFavorite throws without snapshotId', () => {
    expect(() => addFavorite(store, '')).toThrow('snapshotId is required');
  });

  test('removeFavorite removes a snapshot from favorites', () => {
    let s = addFavorite(store, 'snap-1');
    s = removeFavorite(s, 'snap-1');
    expect(s.favorites['snap-1']).toBeUndefined();
  });

  test('removeFavorite is a no-op for unknown id', () => {
    const s = removeFavorite(store, 'unknown');
    expect(s.favorites).toEqual({});
  });

  test('isFavorite returns true for favorited snapshot', () => {
    const s = addFavorite(store, 'snap-2');
    expect(isFavorite(s, 'snap-2')).toBe(true);
  });

  test('isFavorite returns false for non-favorited snapshot', () => {
    expect(isFavorite(store, 'snap-2')).toBe(false);
  });

  test('listFavorites returns all favorite ids', () => {
    let s = addFavorite(store, 'snap-1');
    s = addFavorite(s, 'snap-2');
    expect(listFavorites(s).sort()).toEqual(['snap-1', 'snap-2']);
  });

  test('listFavorites returns empty array when none', () => {
    expect(listFavorites(store)).toEqual([]);
  });

  test('filterFavorites returns only favorited snapshots', () => {
    let s = addFavorite(store, 'snap-1');
    const snaps = [makeSnapshot('snap-1'), makeSnapshot('snap-2'), makeSnapshot('snap-3')];
    const result = filterFavorites(s, snaps);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('snap-1');
  });

  test('filterFavorites returns empty when no favorites match', () => {
    const snaps = [makeSnapshot('snap-x')];
    expect(filterFavorites(store, snaps)).toEqual([]);
  });
});
