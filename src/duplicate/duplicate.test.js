const { duplicateSnapshot, bulkDuplicate } = require('./duplicate');

function makeSnapshot(name, tabs = [], tags = []) {
  return {
    id: `id-${name}`,
    name,
    tabs,
    tags,
    createdAt: new Date('2024-01-01').toISOString(),
  };
}

describe('duplicateSnapshot', () => {
  test('returns a new snapshot with a different id', () => {
    const original = makeSnapshot('work', [{ url: 'https://example.com', title: 'Example' }]);
    const copy = duplicateSnapshot(original);
    expect(copy.id).not.toBe(original.id);
  });

  test('default name appends (copy)', () => {
    const original = makeSnapshot('work');
    const copy = duplicateSnapshot(original);
    expect(copy.name).toBe('work (copy)');
  });

  test('respects name override', () => {
    const original = makeSnapshot('work');
    const copy = duplicateSnapshot(original, { name: 'work-backup' });
    expect(copy.name).toBe('work-backup');
  });

  test('tabs are cloned, not shared by reference', () => {
    const tab = { url: 'https://a.com', title: 'A' };
    const original = makeSnapshot('s', [tab]);
    const copy = duplicateSnapshot(original);
    expect(copy.tabs[0]).not.toBe(original.tabs[0]);
    expect(copy.tabs[0]).toEqual(original.tabs[0]);
  });

  test('tags are copied', () => {
    const original = makeSnapshot('s', [], ['dev', 'node']);
    const copy = duplicateSnapshot(original);
    expect(copy.tags).toEqual(['dev', 'node']);
    expect(copy.tags).not.toBe(original.tags);
  });

  test('tags can be overridden', () => {
    const original = makeSnapshot('s', [], ['dev']);
    const copy = duplicateSnapshot(original, { tags: ['prod'] });
    expect(copy.tags).toEqual(['prod']);
  });

  test('throws on invalid input', () => {
    expect(() => duplicateSnapshot(null)).toThrow();
    expect(() => duplicateSnapshot('bad')).toThrow();
  });
});

describe('bulkDuplicate', () => {
  test('duplicates all snapshots', () => {
    const snaps = [makeSnapshot('a'), makeSnapshot('b')];
    const copies = bulkDuplicate(snaps);
    expect(copies).toHaveLength(2);
    copies.forEach((c, i) => {
      expect(c.id).not.toBe(snaps[i].id);
    });
  });

  test('uses nameFn when provided', () => {
    const snaps = [makeSnapshot('alpha')];
    const copies = bulkDuplicate(snaps, s => `${s.name}-clone`);
    expect(copies[0].name).toBe('alpha-clone');
  });

  test('throws on non-array input', () => {
    expect(() => bulkDuplicate(null)).toThrow();
  });
});
