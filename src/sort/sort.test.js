const { sortByDate, sortByName, sortByTabCount, sortSnapshots } = require('./sort');

function makeSnapshot(name, createdAt, tabCount = 2) {
  return {
    id: name,
    name,
    createdAt,
    tabs: Array.from({ length: tabCount }, (_, i) => ({ url: `https://example.com/${i}` })),
  };
}

const A = makeSnapshot('alpha', '2024-01-01T00:00:00Z', 3);
const B = makeSnapshot('beta',  '2024-03-01T00:00:00Z', 1);
const C = makeSnapshot('gamma', '2024-02-01T00:00:00Z', 5);

describe('sortByDate', () => {
  test('desc (default) puts newest first', () => {
    const result = sortByDate([A, B, C]);
    expect(result.map(s => s.id)).toEqual(['beta', 'gamma', 'alpha']);
  });

  test('asc puts oldest first', () => {
    const result = sortByDate([A, B, C], 'asc');
    expect(result.map(s => s.id)).toEqual(['alpha', 'gamma', 'beta']);
  });

  test('does not mutate original array', () => {
    const arr = [A, B, C];
    sortByDate(arr);
    expect(arr[0]).toBe(A);
  });
});

describe('sortByName', () => {
  test('asc (default) is alphabetical', () => {
    const result = sortByName([C, A, B]);
    expect(result.map(s => s.name)).toEqual(['alpha', 'beta', 'gamma']);
  });

  test('desc reverses alphabetical order', () => {
    const result = sortByName([A, B, C], 'desc');
    expect(result.map(s => s.name)).toEqual(['gamma', 'beta', 'alpha']);
  });
});

describe('sortByTabCount', () => {
  test('desc (default) puts most tabs first', () => {
    const result = sortByTabCount([A, B, C]);
    expect(result.map(s => s.id)).toEqual(['gamma', 'alpha', 'beta']);
  });

  test('asc puts fewest tabs first', () => {
    const result = sortByTabCount([A, B, C], 'asc');
    expect(result.map(s => s.id)).toEqual(['beta', 'alpha', 'gamma']);
  });
});

describe('sortSnapshots', () => {
  test('delegates to sortByDate by default', () => {
    const result = sortSnapshots([A, B, C]);
    expect(result[0].id).toBe('beta');
  });

  test('delegates to sortByName', () => {
    const result = sortSnapshots([C, A, B], 'name', 'asc');
    expect(result[0].name).toBe('alpha');
  });

  test('delegates to sortByTabCount', () => {
    const result = sortSnapshots([A, B, C], 'tabCount', 'asc');
    expect(result[0].id).toBe('beta');
  });

  test('unknown field falls back to date sort', () => {
    const result = sortSnapshots([A, B, C], 'unknown');
    expect(result[0].id).toBe('beta');
  });
});
