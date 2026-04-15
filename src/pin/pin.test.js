const { pinSnapshot, unpinSnapshot, isPinned, listPinned, sortWithPinnedFirst } = require('./pin');

function makeSnapshot(id, extra = {}) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: new Date().toISOString(), ...extra };
}

describe('pinSnapshot', () => {
  it('sets pinned to true on a valid snapshot', () => {
    const snap = makeSnapshot('a1');
    const result = pinSnapshot(snap);
    expect(result.pinned).toBe(true);
  });

  it('does not mutate the original snapshot', () => {
    const snap = makeSnapshot('a2');
    pinSnapshot(snap);
    expect(snap.pinned).toBeUndefined();
  });

  it('throws when snapshot is invalid', () => {
    expect(() => pinSnapshot(null)).toThrow('Invalid snapshot');
    expect(() => pinSnapshot({})).toThrow('Invalid snapshot');
  });
});

describe('unpinSnapshot', () => {
  it('sets pinned to false', () => {
    const snap = makeSnapshot('b1', { pinned: true });
    const result = unpinSnapshot(snap);
    expect(result.pinned).toBe(false);
  });

  it('throws when snapshot is invalid', () => {
    expect(() => unpinSnapshot(undefined)).toThrow('Invalid snapshot');
  });
});

describe('isPinned', () => {
  it('returns true for pinned snapshots', () => {
    expect(isPinned(makeSnapshot('c1', { pinned: true }))).toBe(true);
  });

  it('returns false for unpinned snapshots', () => {
    expect(isPinned(makeSnapshot('c2'))).toBe(false);
    expect(isPinned(makeSnapshot('c3', { pinned: false }))).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isPinned(null)).toBe(false);
    expect(isPinned(undefined)).toBe(false);
  });
});

describe('listPinned', () => {
  it('returns only pinned snapshots', () => {
    const snaps = [
      makeSnapshot('d1', { pinned: true }),
      makeSnapshot('d2'),
      makeSnapshot('d3', { pinned: true }),
    ];
    const result = listPinned(snaps);
    expect(result).toHaveLength(2);
    expect(result.every(s => s.pinned)).toBe(true);
  });

  it('returns empty array when none are pinned', () => {
    expect(listPinned([makeSnapshot('d4'), makeSnapshot('d5')])).toEqual([]);
  });

  it('throws when input is not an array', () => {
    expect(() => listPinned('nope')).toThrow('snapshots must be an array');
  });
});

describe('sortWithPinnedFirst', () => {
  it('moves pinned snapshots to the front', () => {
    const snaps = [
      makeSnapshot('e1'),
      makeSnapshot('e2', { pinned: true }),
      makeSnapshot('e3'),
      makeSnapshot('e4', { pinned: true }),
    ];
    const sorted = sortWithPinnedFirst(snaps);
    expect(sorted[0].pinned).toBe(true);
    expect(sorted[1].pinned).toBe(true);
    expect(sorted[2].pinned).toBeFalsy();
    expect(sorted[3].pinned).toBeFalsy();
  });

  it('does not mutate the original array', () => {
    const snaps = [makeSnapshot('e5'), makeSnapshot('e6', { pinned: true })];
    sortWithPinnedFirst(snaps);
    expect(snaps[0].id).toBe('e5');
  });

  it('throws when input is not an array', () => {
    expect(() => sortWithPinnedFirst(null)).toThrow('snapshots must be an array');
  });
});
