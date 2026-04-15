const { recordEvent, getHistory, clearHistory, MAX_HISTORY_ENTRIES } = require('./history');

function makeSnapshot(overrides = {}) {
  return {
    id: 'snap-001',
    name: 'Test Snapshot',
    tabs: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('recordEvent', () => {
  it('adds a history entry to a snapshot with no history', () => {
    const snap = makeSnapshot();
    const updated = recordEvent(snap, 'created');
    expect(updated.history).toHaveLength(1);
    expect(updated.history[0].action).toBe('created');
    expect(updated.history[0].timestamp).toBeDefined();
  });

  it('appends to existing history', () => {
    const snap = makeSnapshot({ history: [{ action: 'created', timestamp: '2024-01-01T00:00:00.000Z' }] });
    const updated = recordEvent(snap, 'opened');
    expect(updated.history).toHaveLength(2);
    expect(updated.history[1].action).toBe('opened');
  });

  it('does not mutate the original snapshot', () => {
    const snap = makeSnapshot();
    recordEvent(snap, 'exported');
    expect(snap.history).toBeUndefined();
  });

  it('trims history to MAX_HISTORY_ENTRIES', () => {
    const oldEntries = Array.from({ length: MAX_HISTORY_ENTRIES }, (_, i) => ({
      action: `event-${i}`,
      timestamp: new Date().toISOString(),
    }));
    const snap = makeSnapshot({ history: oldEntries });
    const updated = recordEvent(snap, 'merged');
    expect(updated.history).toHaveLength(MAX_HISTORY_ENTRIES);
    expect(updated.history[MAX_HISTORY_ENTRIES - 1].action).toBe('merged');
  });

  it('throws on invalid snapshot', () => {
    expect(() => recordEvent(null, 'created')).toThrow('Invalid snapshot');
  });

  it('throws on invalid action', () => {
    expect(() => recordEvent(makeSnapshot(), '')).toThrow('Invalid action');
    expect(() => recordEvent(makeSnapshot(), null)).toThrow('Invalid action');
  });
});

describe('getHistory', () => {
  it('returns history array from snapshot', () => {
    const snap = makeSnapshot({ history: [{ action: 'created', timestamp: '2024-01-01T00:00:00.000Z' }] });
    expect(getHistory(snap)).toHaveLength(1);
  });

  it('returns empty array when no history exists', () => {
    const snap = makeSnapshot();
    expect(getHistory(snap)).toEqual([]);
  });

  it('throws on invalid snapshot', () => {
    expect(() => getHistory(undefined)).toThrow('Invalid snapshot');
  });
});

describe('clearHistory', () => {
  it('removes all history entries', () => {
    const snap = makeSnapshot({ history: [{ action: 'created', timestamp: '2024-01-01T00:00:00.000Z' }] });
    const cleared = clearHistory(snap);
    expect(cleared.history).toEqual([]);
  });

  it('does not mutate original snapshot', () => {
    const snap = makeSnapshot({ history: [{ action: 'created', timestamp: '2024-01-01T00:00:00.000Z' }] });
    clearHistory(snap);
    expect(snap.history).toHaveLength(1);
  });

  it('throws on invalid snapshot', () => {
    expect(() => clearHistory(null)).toThrow('Invalid snapshot');
  });
});
