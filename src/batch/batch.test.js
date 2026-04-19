const { batchTransform, batchDelete, batchTag, batchFilter } = require('./batch');

function makeSnapshot(id, name, tabs = [], tags = []) {
  return { id, name, tabs, tags, createdAt: new Date().toISOString() };
}

describe('batchTransform', () => {
  it('applies transform to all snapshots', () => {
    const snaps = [makeSnapshot('a', 'A'), makeSnapshot('b', 'B')];
    const { results, errors } = batchTransform(snaps, s => ({ ...s, name: s.name + '!' }));
    expect(results['a'].name).toBe('A!');
    expect(results['b'].name).toBe('B!');
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('captures errors per snapshot', () => {
    const snaps = [makeSnapshot('a', 'A')];
    const { results, errors } = batchTransform(snaps, () => { throw new Error('oops'); });
    expect(results['a']).toBeUndefined();
    expect(errors['a']).toBe('oops');
  });
});

describe('batchDelete', () => {
  it('removes matching snapshots', () => {
    const snaps = [makeSnapshot('a', 'A'), makeSnapshot('b', 'B'), makeSnapshot('c', 'C')];
    const { remaining, deleted, failed } = batchDelete(snaps, ['a', 'c']);
    expect(remaining.map(s => s.id)).toEqual(['b']);
    expect(deleted).toEqual(['a', 'c']);
    expect(failed).toHaveLength(0);
  });

  it('reports ids not found as failed', () => {
    const snaps = [makeSnapshot('a', 'A')];
    const { failed } = batchDelete(snaps, ['z']);
    expect(failed).toContain('z');
  });
});

describe('batchTag', () => {
  it('adds tags to all snapshots', () => {
    const snaps = [makeSnapshot('a', 'A', [], ['old']), makeSnapshot('b', 'B')];
    const tagged = batchTag(snaps, ['new', 'extra']);
    expect(tagged[0].tags).toEqual(expect.arrayContaining(['old', 'new', 'extra']));
    expect(tagged[1].tags).toEqual(expect.arrayContaining(['new', 'extra']));
  });

  it('deduplicates tags', () => {
    const snaps = [makeSnapshot('a', 'A', [], ['dup'])];
    const tagged = batchTag(snaps, ['dup']);
    expect(tagged[0].tags.filter(t => t === 'dup')).toHaveLength(1);
  });
});

describe('batchFilter', () => {
  it('splits snapshots into matched and unmatched', () => {
    const snaps = [
      makeSnapshot('a', 'A', [1, 2]),
      makeSnapshot('b', 'B', []),
      makeSnapshot('c', 'C', [1]),
    ];
    const { matched, unmatched } = batchFilter(snaps, s => s.tabs.length > 0);
    expect(matched.map(s => s.id)).toEqual(['a', 'c']);
    expect(unmatched.map(s => s.id)).toEqual(['b']);
  });
});
