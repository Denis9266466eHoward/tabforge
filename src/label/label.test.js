const {
  createStore,
  setLabel,
  removeLabel,
  getLabels,
  hasLabel,
  filterByLabel,
  clearLabels,
} = require('./label');

function makeSnapshot(id, name) {
  return { id, name, tabs: [], createdAt: new Date().toISOString() };
}

describe('label', () => {
  let store;
  beforeEach(() => { store = createStore(); });

  test('setLabel adds a label to a snapshot', () => {
    setLabel(store, 'snap1', 'env', 'production');
    expect(getLabels(store, 'snap1')).toEqual({ env: 'production' });
  });

  test('setLabel overwrites existing key', () => {
    setLabel(store, 'snap1', 'env', 'dev');
    setLabel(store, 'snap1', 'env', 'staging');
    expect(getLabels(store, 'snap1').env).toBe('staging');
  });

  test('getLabels returns empty object for unknown snapshot', () => {
    expect(getLabels(store, 'nope')).toEqual({});
  });

  test('removeLabel removes a specific key', () => {
    setLabel(store, 'snap1', 'env', 'dev');
    setLabel(store, 'snap1', 'team', 'frontend');
    removeLabel(store, 'snap1', 'env');
    expect(getLabels(store, 'snap1')).toEqual({ team: 'frontend' });
  });

  test('removeLabel cleans up empty entries', () => {
    setLabel(store, 'snap1', 'env', 'dev');
    removeLabel(store, 'snap1', 'env');
    expect(store['snap1']).toBeUndefined();
  });

  test('hasLabel checks key existence', () => {
    setLabel(store, 'snap1', 'env', 'dev');
    expect(hasLabel(store, 'snap1', 'env')).toBe(true);
    expect(hasLabel(store, 'snap1', 'team')).toBe(false);
  });

  test('hasLabel checks key+value', () => {
    setLabel(store, 'snap1', 'env', 'dev');
    expect(hasLabel(store, 'snap1', 'env', 'dev')).toBe(true);
    expect(hasLabel(store, 'snap1', 'env', 'prod')).toBe(false);
  });

  test('filterByLabel returns matching snapshots', () => {
    const snaps = [makeSnapshot('a'), makeSnapshot('b'), makeSnapshot('c')];
    setLabel(store, 'a', 'env', 'dev');
    setLabel(store, 'c', 'env', 'dev');
    setLabel(store, 'b', 'env', 'prod');
    const result = filterByLabel(store, snaps, 'env', 'dev');
    expect(result.map(s => s.id)).toEqual(['a', 'c']);
  });

  test('clearLabels removes all labels for a snapshot', () => {
    setLabel(store, 'snap1', 'env', 'dev');
    setLabel(store, 'snap1', 'team', 'backend');
    clearLabels(store, 'snap1');
    expect(getLabels(store, 'snap1')).toEqual({});
  });

  test('setLabel throws without snapshotId', () => {
    expect(() => setLabel(store, '', 'env', 'dev')).toThrow();
  });
});
