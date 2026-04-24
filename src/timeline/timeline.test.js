const { buildTimeline, getPrevious, getNext, sliceTimeline, latest, earliest } = require('./timeline');

function makeSnapshot(id, createdAt, name = id) {
  return { id, name, createdAt, tabs: [] };
}

const S1 = makeSnapshot('s1', '2024-01-01T10:00:00Z');
const S2 = makeSnapshot('s2', '2024-03-15T08:30:00Z');
const S3 = makeSnapshot('s3', '2024-06-20T14:00:00Z');
const S4 = makeSnapshot('s4', '2024-09-05T09:00:00Z');

const snapshots = [S3, S1, S4, S2]; // intentionally unordered

describe('buildTimeline', () => {
  test('sorts snapshots oldest-first', () => {
    const result = buildTimeline(snapshots);
    expect(result.map(s => s.id)).toEqual(['s1', 's2', 's3', 's4']);
  });

  test('does not mutate the original array', () => {
    const copy = [...snapshots];
    buildTimeline(snapshots);
    expect(snapshots).toEqual(copy);
  });

  test('throws if argument is not an array', () => {
    expect(() => buildTimeline(null)).toThrow(TypeError);
  });
});

describe('getPrevious', () => {
  test('returns snapshot before the given one', () => {
    expect(getPrevious(snapshots, 's3').id).toBe('s2');
  });

  test('returns null for the oldest snapshot', () => {
    expect(getPrevious(snapshots, 's1')).toBeNull();
  });

  test('returns null for unknown id', () => {
    expect(getPrevious(snapshots, 'unknown')).toBeNull();
  });
});

describe('getNext', () => {
  test('returns snapshot after the given one', () => {
    expect(getNext(snapshots, 's2').id).toBe('s3');
  });

  test('returns null for the newest snapshot', () => {
    expect(getNext(snapshots, 's4')).toBeNull();
  });

  test('returns null for unknown id', () => {
    expect(getNext(snapshots, 'unknown')).toBeNull();
  });
});

describe('sliceTimeline', () => {
  test('returns snapshots within the date range', () => {
    const result = sliceTimeline(snapshots, '2024-02-01', '2024-07-01');
    expect(result.map(s => s.id)).toEqual(['s2', 's3']);
  });

  test('is inclusive on both ends', () => {
    const result = sliceTimeline(snapshots, '2024-01-01T10:00:00Z', '2024-03-15T08:30:00Z');
    expect(result.map(s => s.id)).toEqual(['s1', 's2']);
  });

  test('throws on invalid dates', () => {
    expect(() => sliceTimeline(snapshots, 'bad', '2024-01-01')).toThrow(RangeError);
  });
});

describe('latest', () => {
  test('returns the most recent snapshot', () => {
    expect(latest(snapshots).id).toBe('s4');
  });

  test('returns null for empty array', () => {
    expect(latest([])).toBeNull();
  });
});

describe('earliest', () => {
  test('returns the oldest snapshot', () => {
    expect(earliest(snapshots).id).toBe('s1');
  });

  test('returns null for empty array', () => {
    expect(earliest([])).toBeNull();
  });
});
