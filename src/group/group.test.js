const {
  createGroup,
  addToGroup,
  removeFromGroup,
  groupsForSnapshot,
  renameGroup,
  listGroupedSnapshotIds,
} = require('./group');

describe('createGroup', () => {
  test('creates a group with name and empty ids by default', () => {
    const g = createGroup('work');
    expect(g.name).toBe('work');
    expect(g.snapshotIds).toEqual([]);
    expect(g.id).toMatch(/^group_/);
    expect(g.createdAt).toBeDefined();
  });

  test('deduplicates initial snapshot ids', () => {
    const g = createGroup('dev', ['a', 'a', 'b']);
    expect(g.snapshotIds).toEqual(['a', 'b']);
  });

  test('throws if name is missing', () => {
    expect(() => createGroup('')).toThrow();
    expect(() => createGroup(null)).toThrow();
  });
});

describe('addToGroup', () => {
  test('adds ids without duplicates', () => {
    const g = createGroup('test', ['a']);
    const updated = addToGroup(g, ['a', 'b', 'c']);
    expect(updated.snapshotIds).toEqual(['a', 'b', 'c']);
  });

  test('does not mutate original', () => {
    const g = createGroup('test', ['a']);
    addToGroup(g, ['b']);
    expect(g.snapshotIds).toEqual(['a']);
  });
});

describe('removeFromGroup', () => {
  test('removes specified ids', () => {
    const g = createGroup('test', ['a', 'b', 'c']);
    const updated = removeFromGroup(g, ['b']);
    expect(updated.snapshotIds).toEqual(['a', 'c']);
  });

  test('ignores ids not in group', () => {
    const g = createGroup('test', ['a']);
    const updated = removeFromGroup(g, ['z']);
    expect(updated.snapshotIds).toEqual(['a']);
  });
});

describe('groupsForSnapshot', () => {
  test('returns groups containing the snapshot id', () => {
    const g1 = createGroup('g1', ['a', 'b']);
    const g2 = createGroup('g2', ['b', 'c']);
    const result = groupsForSnapshot([g1, g2], 'b');
    expect(result).toHaveLength(2);
  });

  test('returns empty if none match', () => {
    const g1 = createGroup('g1', ['a']);
    expect(groupsForSnapshot([g1], 'z')).toEqual([]);
  });
});

describe('renameGroup', () => {
  test('renames the group', () => {
    const g = createGroup('old');
    const renamed = renameGroup(g, 'new');
    expect(renamed.name).toBe('new');
  });

  test('throws on empty name', () => {
    const g = createGroup('old');
    expect(() => renameGroup(g, '')).toThrow();
  });
});

describe('listGroupedSnapshotIds', () => {
  test('returns all unique ids across groups', () => {
    const g1 = createGroup('g1', ['a', 'b']);
    const g2 = createGroup('g2', ['b', 'c']);
    const ids = listGroupedSnapshotIds([g1, g2]);
    expect(ids.sort()).toEqual(['a', 'b', 'c']);
  });
});
