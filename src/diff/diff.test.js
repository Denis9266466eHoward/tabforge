const { diffTabs, diffSnapshots } = require('./diff');

const tabA = { url: 'https://example.com', title: 'Example', pinned: false };
const tabB = { url: 'https://github.com', title: 'GitHub', pinned: false };
const tabC = { url: 'https://example.com', title: 'Example Updated', pinned: true };

describe('diffTabs', () => {
  it('detects added tabs', () => {
    const result = diffTabs([tabA], [tabA, tabB]);
    expect(result.added).toHaveLength(1);
    expect(result.added[0].url).toBe(tabB.url);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  it('detects removed tabs', () => {
    const result = diffTabs([tabA, tabB], [tabA]);
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0].url).toBe(tabB.url);
    expect(result.added).toHaveLength(0);
  });

  it('detects changed tabs', () => {
    const result = diffTabs([tabA], [tabC]);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].url).toBe(tabA.url);
    expect(result.changed[0].before.title).toBe('Example');
    expect(result.changed[0].after.title).toBe('Example Updated');
  });

  it('returns empty diff for identical tab lists', () => {
    const result = diffTabs([tabA, tabB], [tabA, tabB]);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  it('handles empty tab lists', () => {
    const result = diffTabs([], []);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });
});

describe('diffSnapshots', () => {
  const snapshotA = { id: 'snap-001', tabs: [tabA] };
  const snapshotB = { id: 'snap-002', tabs: [tabA, tabB] };

  it('returns a structured diff between two snapshots', () => {
    const result = diffSnapshots(snapshotA, snapshotB);
    expect(result.from).toBe('snap-001');
    expect(result.to).toBe('snap-002');
    expect(result.summary.added).toBe(1);
    expect(result.summary.removed).toBe(0);
    expect(result.tabs.added[0].url).toBe(tabB.url);
  });

  it('throws if a snapshot is missing', () => {
    expect(() => diffSnapshots(null, snapshotB)).toThrow();
    expect(() => diffSnapshots(snapshotA, null)).toThrow();
  });

  it('includes a createdAt timestamp', () => {
    const result = diffSnapshots(snapshotA, snapshotB);
    expect(typeof result.createdAt).toBe('string');
    expect(new Date(result.createdAt).toString()).not.toBe('Invalid Date');
  });
});
