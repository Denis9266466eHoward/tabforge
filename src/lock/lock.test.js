const {
  lockSnapshot,
  unlockSnapshot,
  isLocked,
  getLockInfo,
  filterUnlocked,
  clearAllLocks,
} = require('./lock');

function makeSnapshot(id = 'snap-1') {
  return { id, name: `Snapshot ${id}`, tabs: [], createdAt: new Date().toISOString() };
}

beforeEach(() => clearAllLocks());

describe('lockSnapshot', () => {
  test('marks snapshot as locked', () => {
    const s = makeSnapshot();
    const locked = lockSnapshot(s, 'do not touch');
    expect(locked.locked).toBe(true);
    expect(locked.lockReason).toBe('do not touch');
  });

  test('registers lock in internal map', () => {
    const s = makeSnapshot('abc');
    lockSnapshot(s);
    expect(isLocked(s)).toBe(true);
  });

  test('throws on invalid snapshot', () => {
    expect(() => lockSnapshot(null)).toThrow('Invalid snapshot');
    expect(() => lockSnapshot({})).toThrow('Invalid snapshot');
  });
});

describe('unlockSnapshot', () => {
  test('removes locked flag', () => {
    const s = makeSnapshot();
    const locked = lockSnapshot(s, 'reason');
    const unlocked = unlockSnapshot(locked);
    expect(unlocked.locked).toBeUndefined();
    expect(unlocked.lockReason).toBeUndefined();
  });

  test('isLocked returns false after unlock', () => {
    const s = makeSnapshot('x1');
    lockSnapshot(s);
    unlockSnapshot(s);
    expect(isLocked(s)).toBe(false);
  });

  test('throws on invalid snapshot', () => {
    expect(() => unlockSnapshot(undefined)).toThrow('Invalid snapshot');
  });
});

describe('getLockInfo', () => {
  test('returns lock metadata', () => {
    const s = makeSnapshot('meta-1');
    lockSnapshot(s, 'frozen');
    const info = getLockInfo(s);
    expect(info).not.toBeNull();
    expect(info.reason).toBe('frozen');
    expect(info.lockedAt).toBeDefined();
  });

  test('returns null for unlocked snapshot', () => {
    const s = makeSnapshot('meta-2');
    expect(getLockInfo(s)).toBeNull();
  });
});

describe('filterUnlocked', () => {
  test('excludes locked snapshots', () => {
    const s1 = makeSnapshot('f1');
    const s2 = makeSnapshot('f2');
    const s3 = makeSnapshot('f3');
    lockSnapshot(s2);
    const result = filterUnlocked([s1, s2, s3]);
    expect(result.map(s => s.id)).toEqual(['f1', 'f3']);
  });

  test('returns all if none locked', () => {
    const snaps = [makeSnapshot('a'), makeSnapshot('b')];
    expect(filterUnlocked(snaps)).toHaveLength(2);
  });
});
