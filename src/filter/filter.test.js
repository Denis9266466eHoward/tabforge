const {
  filterByMinTabs,
  filterByMaxTabs,
  filterByNamePattern,
  filterCreatedAfter,
  filterCreatedBefore,
  filterSnapshots,
} = require('./filter');

function makeSnapshot(name, tabCount, createdAt) {
  return {
    id: name,
    name,
    tabs: Array.from({ length: tabCount }, (_, i) => ({ url: `https://example.com/${i}` })),
    createdAt: createdAt || new Date().toISOString(),
  };
}

const snapshots = [
  makeSnapshot('alpha', 2, '2024-01-01T00:00:00Z'),
  makeSnapshot('beta', 5, '2024-03-15T00:00:00Z'),
  makeSnapshot('gamma', 10, '2024-06-01T00:00:00Z'),
  makeSnapshot('delta', 1, '2024-09-20T00:00:00Z'),
];

test('filterByMinTabs returns snapshots with at least n tabs', () => {
  const result = filterByMinTabs(snapshots, 5);
  expect(result.map(s => s.name)).toEqual(['beta', 'gamma']);
});

test('filterByMaxTabs returns snapshots with at most n tabs', () => {
  const result = filterByMaxTabs(snapshots, 2);
  expect(result.map(s => s.name)).toEqual(['alpha', 'delta']);
});

test('filterByNamePattern matches case-insensitively', () => {
  const result = filterByNamePattern(snapshots, 'ALPHA');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('alpha');
});

test('filterByNamePattern accepts a regex', () => {
  const result = filterByNamePattern(snapshots, /^(beta|gamma)$/);
  expect(result.map(s => s.name)).toEqual(['beta', 'gamma']);
});

test('filterCreatedAfter returns snapshots after the date', () => {
  const result = filterCreatedAfter(snapshots, '2024-05-01T00:00:00Z');
  expect(result.map(s => s.name)).toEqual(['gamma', 'delta']);
});

test('filterCreatedBefore returns snapshots before the date', () => {
  const result = filterCreatedBefore(snapshots, '2024-03-01T00:00:00Z');
  expect(result.map(s => s.name)).toEqual(['alpha']);
});

test('filterSnapshots applies multiple criteria', () => {
  const result = filterSnapshots(snapshots, {
    minTabs: 2,
    before: '2024-07-01T00:00:00Z',
    namePattern: /a/,
  });
  expect(result.map(s => s.name)).toEqual(['alpha', 'gamma']);
});

test('filterSnapshots with no criteria returns all', () => {
  expect(filterSnapshots(snapshots)).toHaveLength(4);
});
