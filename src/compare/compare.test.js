const { compareSnapshots, snapshotsEqual, rankBySimilarity } = require('./compare');

function makeSnapshot(id, urls) {
  return { id, tabs: urls.map(url => ({ url, title: url })), createdAt: new Date().toISOString() };
}

describe('compareSnapshots', () => {
  test('identifies tabs only in A', () => {
    const a = makeSnapshot('a', ['http://a.com', 'http://b.com']);
    const b = makeSnapshot('b', ['http://b.com', 'http://c.com']);
    const result = compareSnapshots(a, b);
    expect(result.onlyInA).toHaveLength(1);
    expect(result.onlyInA[0].url).toBe('http://a.com');
  });

  test('identifies tabs only in B', () => {
    const a = makeSnapshot('a', ['http://a.com']);
    const b = makeSnapshot('b', ['http://a.com', 'http://b.com']);
    const result = compareSnapshots(a, b);
    expect(result.onlyInB).toHaveLength(1);
    expect(result.onlyInB[0].url).toBe('http://b.com');
  });

  test('identifies shared tabs', () => {
    const a = makeSnapshot('a', ['http://a.com', 'http://shared.com']);
    const b = makeSnapshot('b', ['http://b.com', 'http://shared.com']);
    const result = compareSnapshots(a, b);
    expect(result.inBoth).toHaveLength(1);
    expect(result.inBoth[0].url).toBe('http://shared.com');
  });

  test('similarity is 1 for identical snapshots', () => {
    const a = makeSnapshot('a', ['http://a.com', 'http://b.com']);
    const b = makeSnapshot('b', ['http://a.com', 'http://b.com']);
    expect(compareSnapshots(a, b).similarity).toBe(1);
  });

  test('throws if a snapshot is missing', () => {
    expect(() => compareSnapshots(null, makeSnapshot('b', []))).toThrow();
  });
});

describe('snapshotsEqual', () => {
  test('returns true for same urls', () => {
    const a = makeSnapshot('a', ['http://x.com', 'http://y.com']);
    const b = makeSnapshot('b', ['http://y.com', 'http://x.com']);
    expect(snapshotsEqual(a, b)).toBe(true);
  });

  test('returns false for different urls', () => {
    const a = makeSnapshot('a', ['http://x.com']);
    const b = makeSnapshot('b', ['http://y.com']);
    expect(snapshotsEqual(a, b)).toBe(false);
  });
});

describe('rankBySimilarity', () => {
  test('ranks most similar first', () => {
    const ref = makeSnapshot('ref', ['http://a.com', 'http://b.com']);
    const s1 = makeSnapshot('s1', ['http://a.com']);
    const s2 = makeSnapshot('s2', ['http://a.com', 'http://b.com']);
    const s3 = makeSnapshot('s3', ['http://z.com']);
    const ranked = rankBySimilarity(ref, [s1, s2, s3]);
    expect(ranked[0].snapshot.id).toBe('s2');
  });
});
