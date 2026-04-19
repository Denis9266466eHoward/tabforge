const {
  VALID_COLORS,
  createStore,
  setColor,
  getColor,
  removeColor,
  hasColor,
  filterByColor,
  groupByColor,
} = require('./color');

function makeSnapshot(id, name = 'snap') {
  return { id, name, tabs: [], createdAt: new Date().toISOString() };
}

describe('color', () => {
  test('createStore returns empty object', () => {
    expect(createStore()).toEqual({});
  });

  test('setColor and getColor round-trip', () => {
    let store = createStore();
    store = setColor(store, 'snap-1', 'blue');
    expect(getColor(store, 'snap-1')).toBe('blue');
  });

  test('setColor throws on invalid color', () => {
    const store = createStore();
    expect(() => setColor(store, 'snap-1', 'magenta')).toThrow('Invalid color');
  });

  test('getColor returns null when not set', () => {
    expect(getColor(createStore(), 'nope')).toBeNull();
  });

  test('hasColor returns true/false correctly', () => {
    let store = createStore();
    expect(hasColor(store, 'snap-1')).toBe(false);
    store = setColor(store, 'snap-1', 'green');
    expect(hasColor(store, 'snap-1')).toBe(true);
  });

  test('removeColor removes the entry', () => {
    let store = createStore();
    store = setColor(store, 'snap-1', 'red');
    store = removeColor(store, 'snap-1');
    expect(hasColor(store, 'snap-1')).toBe(false);
  });

  test('filterByColor returns matching snapshots', () => {
    let store = createStore();
    const s1 = makeSnapshot('s1');
    const s2 = makeSnapshot('s2');
    const s3 = makeSnapshot('s3');
    store = setColor(store, 's1', 'blue');
    store = setColor(store, 's2', 'red');
    store = setColor(store, 's3', 'blue');
    const result = filterByColor(store, [s1, s2, s3], 'blue');
    expect(result).toHaveLength(2);
    expect(result.map(s => s.id)).toEqual(['s1', 's3']);
  });

  test('filterByColor throws on invalid color', () => {
    expect(() => filterByColor({}, [], 'neon')).toThrow('Invalid color');
  });

  test('groupByColor groups correctly including none', () => {
    let store = createStore();
    const s1 = makeSnapshot('s1');
    const s2 = makeSnapshot('s2');
    const s3 = makeSnapshot('s3');
    store = setColor(store, 's1', 'purple');
    store = setColor(store, 's2', 'purple');
    const groups = groupByColor(store, [s1, s2, s3]);
    expect(groups.purple).toHaveLength(2);
    expect(groups.none).toHaveLength(1);
    expect(groups.none[0].id).toBe('s3');
  });

  test('VALID_COLORS contains expected values', () => {
    expect(VALID_COLORS).toContain('blue');
    expect(VALID_COLORS).toContain('red');
    expect(VALID_COLORS.length).toBeGreaterThan(0);
  });
});
