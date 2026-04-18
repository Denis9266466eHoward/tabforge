const { STATUS, getStatus, annotateWithStatus, filterByStatus, summarizeStatuses } = require('./status');

const DAY = 24 * 60 * 60 * 1000;

function makeSnapshot(ageMs, id = 'snap-1') {
  return { id, name: id, createdAt: new Date(Date.now() - ageMs).toISOString(), tabs: [] };
}

describe('getStatus', () => {
  test('returns active for fresh snapshot', () => {
    expect(getStatus(makeSnapshot(0))).toBe(STATUS.ACTIVE);
  });

  test('returns idle after 1 day', () => {
    expect(getStatus(makeSnapshot(DAY + 1000))).toBe(STATUS.IDLE);
  });

  test('returns stale after 7 days', () => {
    expect(getStatus(makeSnapshot(7 * DAY + 1000))).toBe(STATUS.STALE);
  });

  test('throws on invalid snapshot', () => {
    expect(() => getStatus({})).toThrow('Invalid snapshot');
  });
});

describe('annotateWithStatus', () => {
  test('adds status field to each snapshot', () => {
    const snaps = [makeSnapshot(0, 'a'), makeSnapshot(2 * DAY, 'b')];
    const result = annotateWithStatus(snaps);
    expect(result[0].status).toBe(STATUS.ACTIVE);
    expect(result[1].status).toBe(STATUS.IDLE);
  });

  test('does not mutate originals', () => {
    const snap = makeSnapshot(0);
    annotateWithStatus([snap]);
    expect(snap.status).toBeUndefined();
  });
});

describe('filterByStatus', () => {
  test('filters to only matching status', () => {
    const snaps = [makeSnapshot(0, 'a'), makeSnapshot(8 * DAY, 'b'), makeSnapshot(2 * DAY, 'c')];
    expect(filterByStatus(snaps, STATUS.STALE)).toHaveLength(1);
    expect(filterByStatus(snaps, STATUS.ACTIVE)).toHaveLength(1);
    expect(filterByStatus(snaps, STATUS.IDLE)).toHaveLength(1);
  });

  test('throws on unknown status', () => {
    expect(() => filterByStatus([], 'unknown')).toThrow('Unknown status');
  });
});

describe('summarizeStatuses', () => {
  test('counts each status correctly', () => {
    const snaps = [makeSnapshot(0), makeSnapshot(8 * DAY), makeSnapshot(2 * DAY), makeSnapshot(9 * DAY)];
    const summary = summarizeStatuses(snaps);
    expect(summary.active).toBe(1);
    expect(summary.idle).toBe(1);
    expect(summary.stale).toBe(2);
  });

  test('returns zeros for empty list', () => {
    expect(summarizeStatuses([])).toEqual({ active: 0, idle: 0, stale: 0 });
  });
});
