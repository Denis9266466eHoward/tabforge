const {
  setAlias,
  resolveAlias,
  removeAlias,
  listAliases,
  aliasesForSnapshot,
  clearAliases,
} = require('./alias');

beforeEach(() => clearAliases());

describe('setAlias', () => {
  test('creates an alias entry', () => {
    const result = setAlias('work', 'snap-001');
    expect(result).toEqual({ alias: 'work', snapshotId: 'snap-001' });
  });

  test('normalizes alias to lowercase', () => {
    setAlias('MyAlias', 'snap-002');
    expect(resolveAlias('myalias')).toBe('snap-002');
  });

  test('overwrites existing alias', () => {
    setAlias('dev', 'snap-001');
    setAlias('dev', 'snap-099');
    expect(resolveAlias('dev')).toBe('snap-099');
  });

  test('throws on invalid alias', () => {
    expect(() => setAlias('', 'snap-001')).toThrow();
    expect(() => setAlias(null, 'snap-001')).toThrow();
  });

  test('throws on invalid snapshotId', () => {
    expect(() => setAlias('dev', '')).toThrow();
    expect(() => setAlias('dev', null)).toThrow();
  });
});

describe('resolveAlias', () => {
  test('returns snapshotId for known alias', () => {
    setAlias('staging', 'snap-010');
    expect(resolveAlias('staging')).toBe('snap-010');
  });

  test('returns null for unknown alias', () => {
    expect(resolveAlias('unknown')).toBeNull();
  });

  test('returns null for invalid input', () => {
    expect(resolveAlias(null)).toBeNull();
    expect(resolveAlias('')).toBeNull();
  });
});

describe('removeAlias', () => {
  test('removes an existing alias', () => {
    setAlias('temp', 'snap-005');
    expect(removeAlias('temp')).toBe(true);
    expect(resolveAlias('temp')).toBeNull();
  });

  test('returns false for non-existent alias', () => {
    expect(removeAlias('nope')).toBe(false);
  });
});

describe('listAliases', () => {
  test('returns all aliases', () => {
    setAlias('alpha', 'snap-001');
    setAlias('beta', 'snap-002');
    const list = listAliases();
    expect(list).toHaveLength(2);
    expect(list).toContainEqual({ alias: 'alpha', snapshotId: 'snap-001' });
    expect(list).toContainEqual({ alias: 'beta', snapshotId: 'snap-002' });
  });

  test('returns empty array when no aliases', () => {
    expect(listAliases()).toEqual([]);
  });
});

describe('aliasesForSnapshot', () => {
  test('returns all aliases for a snapshot', () => {
    setAlias('dev', 'snap-007');
    setAlias('local', 'snap-007');
    setAlias('prod', 'snap-999');
    expect(aliasesForSnapshot('snap-007')).toEqual(expect.arrayContaining(['dev', 'local']));
    expect(aliasesForSnapshot('snap-007')).toHaveLength(2);
  });

  test('returns empty array if no aliases match', () => {
    expect(aliasesForSnapshot('snap-xyz')).toEqual([]);
  });
});
