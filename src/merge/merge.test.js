const { mergeSnapshots, MERGE_STRATEGIES } = require('./merge');

const tabA1 = { url: 'https://github.com', title: 'GitHub' };
const tabA2 = { url: 'https://npmjs.com',  title: 'npm' };
const tabB1 = { url: 'https://github.com', title: 'GitHub (B)' };
const tabB2 = { url: 'https://nodejs.org', title: 'Node.js' };

const snapA = { name: 'alpha', tabs: [tabA1, tabA2], createdAt: new Date().toISOString() };
const snapB = { name: 'beta',  tabs: [tabB1, tabB2], createdAt: new Date().toISOString() };

describe('mergeSnapshots', () => {
  test('exports MERGE_STRATEGIES array', () => {
    expect(Array.isArray(MERGE_STRATEGIES)).toBe(true);
    expect(MERGE_STRATEGIES).toContain('keep-all');
    expect(MERGE_STRATEGIES).toContain('keep-left');
    expect(MERGE_STRATEGIES).toContain('keep-right');
  });

  test('keep-all includes all tabs including duplicates', () => {
    const merged = mergeSnapshots(snapA, snapB, { strategy: 'keep-all' });
    expect(merged.tabs).toHaveLength(4);
    const urls = merged.tabs.map(t => t.url);
    expect(urls.filter(u => u === 'https://github.com')).toHaveLength(2);
  });

  test('keep-left prefers tabs from snapshotA on URL conflict', () => {
    const merged = mergeSnapshots(snapA, snapB, { strategy: 'keep-left' });
    const githubTab = merged.tabs.find(t => t.url === 'https://github.com');
    expect(githubTab.title).toBe('GitHub');
    expect(merged.tabs).toHaveLength(3);
  });

  test('keep-right prefers tabs from snapshotB on URL conflict', () => {
    const merged = mergeSnapshots(snapA, snapB, { strategy: 'keep-right' });
    const githubTab = merged.tabs.find(t => t.url === 'https://github.com');
    expect(githubTab.title).toBe('GitHub (B)');
    expect(merged.tabs).toHaveLength(3);
  });

  test('default strategy is keep-all', () => {
    const merged = mergeSnapshots(snapA, snapB);
    expect(merged.tabs).toHaveLength(4);
  });

  test('uses custom name when provided', () => {
    const merged = mergeSnapshots(snapA, snapB, { name: 'my-merge' });
    expect(merged.name).toBe('my-merge');
  });

  test('auto-generates name from both snapshots', () => {
    const merged = mergeSnapshots(snapA, snapB);
    expect(merged.name).toBe('alpha+beta');
  });

  test('throws on unknown strategy', () => {
    expect(() => mergeSnapshots(snapA, snapB, { strategy: 'invalid' })).toThrow(/Unknown merge strategy/);
  });

  test('throws when snapshotA is invalid', () => {
    expect(() => mergeSnapshots(null, snapB)).toThrow(/snapshotA is invalid/);
  });

  test('throws when snapshotB is invalid', () => {
    expect(() => mergeSnapshots(snapA, { name: 'bad' })).toThrow(/snapshotB is invalid/);
  });

  test('returned snapshot has required fields', () => {
    const merged = mergeSnapshots(snapA, snapB);
    expect(merged).toHaveProperty('name');
    expect(merged).toHaveProperty('tabs');
    expect(merged).toHaveProperty('createdAt');
  });
});
