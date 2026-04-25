const {
  totalTabCount,
  averageTabCount,
  largestSnapshot,
  smallestSnapshot,
  computeStats,
} = require('./snapshot.stats');

function makeSnapshot(id, tabCount) {
  return {
    id,
    name: `snap-${id}`,
    createdAt: new Date().toISOString(),
    tabs: Array.from({ length: tabCount }, (_, i) => ({
      id: `t${i}`,
      url: `https://example.com/${i}`,
      title: `Tab ${i}`,
    })),
  };
}

describe('totalTabCount', () => {
  test('returns 0 for empty list', () => {
    expect(totalTabCount([])).toBe(0);
  });

  test('sums tabs across snapshots', () => {
    const snaps = [makeSnapshot('a', 3), makeSnapshot('b', 5)];
    expect(totalTabCount(snaps)).toBe(8);
  });
});

describe('averageTabCount', () => {
  test('returns 0 for empty list', () => {
    expect(averageTabCount([])).toBe(0);
  });

  test('computes correct average', () => {
    const snaps = [makeSnapshot('a', 2), makeSnapshot('b', 4)];
    expect(averageTabCount(snaps)).toBe(3);
  });
});

describe('largestSnapshot', () => {
  test('returns null for empty list', () => {
    expect(largestSnapshot([])).toBeNull();
  });

  test('returns snapshot with most tabs', () => {
    const snaps = [makeSnapshot('a', 2), makeSnapshot('b', 7), makeSnapshot('c', 4)];
    expect(largestSnapshot(snaps).id).toBe('b');
  });
});

describe('smallestSnapshot', () => {
  test('returns null for empty list', () => {
    expect(smallestSnapshot([])).toBeNull();
  });

  test('returns snapshot with fewest tabs', () => {
    const snaps = [makeSnapshot('a', 2), makeSnapshot('b', 7), makeSnapshot('c', 1)];
    expect(smallestSnapshot(snaps).id).toBe('c');
  });
});

describe('computeStats', () => {
  test('returns zeroed stats for empty list', () => {
    const stats = computeStats([]);
    expect(stats.count).toBe(0);
    expect(stats.totalTabs).toBe(0);
    expect(stats.averageTabs).toBe(0);
    expect(stats.medianTabs).toBe(0);
    expect(stats.largestId).toBeNull();
    expect(stats.smallestId).toBeNull();
  });

  test('computes all fields correctly', () => {
    const snaps = [
      makeSnapshot('x', 1),
      makeSnapshot('y', 3),
      makeSnapshot('z', 5),
    ];
    const stats = computeStats(snaps);
    expect(stats.count).toBe(3);
    expect(stats.totalTabs).toBe(9);
    expect(stats.averageTabs).toBe(3);
    expect(stats.medianTabs).toBe(3);
    expect(stats.largestId).toBe('z');
    expect(stats.smallestId).toBe('x');
  });

  test('computes even-length median correctly', () => {
    const snaps = [makeSnapshot('a', 2), makeSnapshot('b', 4)];
    const stats = computeStats(snaps);
    expect(stats.medianTabs).toBe(3);
  });
});
