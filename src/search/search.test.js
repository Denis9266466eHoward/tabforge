const { searchSnapshots, searchByName, searchByDateRange } = require('./search');

function makeSnapshot(overrides = {}) {
  return {
    id: 'snap-001',
    name: 'My Snapshot',
    createdAt: '2024-03-15T10:00:00.000Z',
    tabs: [
      { url: 'https://github.com/tabforge', title: 'TabForge GitHub' },
      { url: 'https://docs.example.com', title: 'Docs' },
    ],
    tags: [],
    ...overrides,
  };
}

describe('searchSnapshots', () => {
  it('returns snapshots with tabs matching the query URL', () => {
    const snaps = [makeSnapshot(), makeSnapshot({ id: 'snap-002', tabs: [{ url: 'https://other.com', title: 'Other' }] })];
    const results = searchSnapshots(snaps, 'github');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('snap-001');
  });

  it('returns snapshots with tabs matching the query title', () => {
    const snaps = [makeSnapshot()];
    const results = searchSnapshots(snaps, 'docs');
    expect(results).toHaveLength(1);
  });

  it('is case-insensitive', () => {
    const snaps = [makeSnapshot()];
    expect(searchSnapshots(snaps, 'GITHUB')).toHaveLength(1);
  });

  it('returns empty array when no match', () => {
    const snaps = [makeSnapshot()];
    expect(searchSnapshots(snaps, 'nonexistent')).toHaveLength(0);
  });

  it('throws if query is not a string', () => {
    expect(() => searchSnapshots([], null)).toThrow('query must be a non-empty string');
  });
});

describe('searchByName', () => {
  it('matches snapshot by name', () => {
    const snaps = [makeSnapshot(), makeSnapshot({ id: 'snap-002', name: 'Work Tabs' })];
    const results = searchByName(snaps, 'work');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('snap-002');
  });

  it('matches snapshot by id', () => {
    const snaps = [makeSnapshot()];
    expect(searchByName(snaps, 'snap-001')).toHaveLength(1);
  });

  it('throws on empty query', () => {
    expect(() => searchByName([], '')).toThrow();
  });
});

describe('searchByDateRange', () => {
  it('returns snapshots within range', () => {
    const snaps = [
      makeSnapshot({ createdAt: '2024-03-10T00:00:00.000Z' }),
      makeSnapshot({ id: 'snap-002', createdAt: '2024-03-20T00:00:00.000Z' }),
    ];
    const results = searchByDateRange(snaps, '2024-03-08', '2024-03-15');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('snap-001');
  });

  it('returns empty array when nothing in range', () => {
    const snaps = [makeSnapshot({ createdAt: '2024-01-01T00:00:00.000Z' })];
    expect(searchByDateRange(snaps, '2024-06-01', '2024-06-30')).toHaveLength(0);
  });

  it('throws on invalid date', () => {
    expect(() => searchByDateRange([], 'not-a-date', '2024-06-01')).toThrow('from and to must be valid dates');
  });
});
