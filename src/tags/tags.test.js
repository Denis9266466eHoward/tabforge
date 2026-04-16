const { addTags, removeTags, filterByTag, listAllTags } = require('./tags');

const makeSnapshot = (id, tags = []) => ({ id, name: `snap-${id}`, tabs: [], tags });

describe('addTags', () => {
  test('adds tags to a snapshot with no existing tags', () => {
    const snap = makeSnapshot('1');
    const result = addTags(snap, ['work', 'frontend']);
    expect(result.tags).toEqual(['work', 'frontend']);
  });

  test('merges with existing tags and deduplicates', () => {
    const snap = makeSnapshot('1', ['work']);
    const result = addTags(snap, ['work', 'backend']);
    expect(result.tags).toEqual(['work', 'backend']);
  });

  test('does not mutate the original snapshot', () => {
    const snap = makeSnapshot('1', ['work']);
    addTags(snap, ['backend']);
    expect(snap.tags).toEqual(['work']);
  });

  test('trims whitespace from tags', () => {
    const snap = makeSnapshot('1');
    const result = addTags(snap, ['  dev  ', 'prod']);
    expect(result.tags).toContain('dev');
  });

  test('throws on invalid snapshot', () => {
    expect(() => addTags(null, ['tag'])).toThrow('Invalid snapshot');
  });

  test('throws when tags argument is not an array', () => {
    const snap = makeSnapshot('1');
    expect(() => addTags(snap, 'work')).toThrow();
  });

  test('filters out empty string tags after trimming', () => {
    const snap = makeSnapshot('1');
    const result = addTags(snap, ['  ', 'work']);
    expect(result.tags).not.toContain('');
    expect(result.tags).toContain('work');
  });
});

describe('removeTags', () => {
  test('removes specified tags', () => {
    const snap = makeSnapshot('1', ['work', 'frontend', 'debug']);
    const result = removeTags(snap, ['debug']);
    expect(result.tags).toEqual(['work', 'frontend']);
  });

  test('ignores tags that do not exist', () => {
    const snap = makeSnapshot('1', ['work']);
    const result = removeTags(snap, ['nonexistent']);
    expect(result.tags).toEqual(['work']);
  });

  test('does not mutate original snapshot', () => {
    const snap = makeSnapshot('1', ['work', 'debug']);
    removeTags(snap, ['debug']);
    expect(snap.tags).toEqual(['work', 'debug']);
  });

  test('removes all tags when all are specified', () => {
    const snap = makeSnapshot('1', ['work', 'debug']);
    const result = removeTags(snap, ['work', 'debug']);
    expect(result.tags).toEqual([]);
  });
});

describe('filterByTag', () => {
  const snapshots = [
    makeSnapshot('1', ['work', 'frontend']),
    makeSnapshot('2', ['personal']),
    makeSnapshot('3', ['work', 'backend']),
  ];

  test('returns only snapshots with matching tag', () => {
    const result = filterByTag(snapshots, 'work');
    expect(result).toHaveLength(2);
    expect(result.map(s => s.id)).toEqual(['1', '3']);
  });

  test('returns empty array when no match', () => {
    expect(filterByTag(snapshots, 'debug')).toEqual([]);
  });

  test('throws on invalid inputs', () => {
    expect(() => filterByTag(null, 'work')).toThrow();
    expect(() => filterByTag(snapshots, '')).toThrow();
  });
});

describe('listAllTags', () => {
  test('returns sorted unique tags across all snapshots', () => {
    const snapshots = [
      makeSnapshot('1', ['work', 'frontend']),
      makeSnapshot('2', ['personal', 'work']),
    ];
    expect(listAllTags(snapshots)).toEqual(['frontend', 'personal', 'work']);
  });

  test('returns empty array for snapshots with no tags', () => {
    expect(listAllTags([makeSnapshot('1'), makeSnapshot('2')])).toEqual([]);
  });

  test('throws on non-array input', () => {
    expect(() => listAllTags('bad')).toThrow();
  });
});
