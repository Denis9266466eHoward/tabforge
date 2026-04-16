const { subscribe, unsubscribe, emit, clearAll, EVENTS } = require('./notify');

beforeEach(() => {
  clearAll();
});

describe('subscribe / emit', () => {
  test('handler is called when matching event is emitted', () => {
    const calls = [];
    subscribe(EVENTS.SNAPSHOT_CREATED, (payload) => calls.push(payload));
    emit(EVENTS.SNAPSHOT_CREATED, { snapshotId: 'abc' });
    expect(calls).toHaveLength(1);
    expect(calls[0].snapshotId).toBe('abc');
    expect(calls[0].event).toBe(EVENTS.SNAPSHOT_CREATED);
    expect(calls[0].timestamp).toBeDefined();
  });

  test('handler is NOT called for different event', () => {
    const calls = [];
    subscribe(EVENTS.SNAPSHOT_DELETED, (p) => calls.push(p));
    emit(EVENTS.SNAPSHOT_CREATED, { snapshotId: 'abc' });
    expect(calls).toHaveLength(0);
  });

  test('multiple handlers for same event all fire', () => {
    const a = [], b = [];
    subscribe(EVENTS.SNAPSHOT_RESTORED, (p) => a.push(p));
    subscribe(EVENTS.SNAPSHOT_RESTORED, (p) => b.push(p));
    emit(EVENTS.SNAPSHOT_RESTORED, { snapshotId: 'x' });
    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
  });

  test('throws if handler is not a function', () => {
    expect(() => subscribe(EVENTS.SNAPSHOT_CREATED, 'nope')).toThrow(TypeError);
  });
});

describe('unsubscribe', () => {
  test('returned unsubscribe function removes handler', () => {
    const calls = [];
    const unsub = subscribe(EVENTS.SNAPSHOT_DELETED, (p) => calls.push(p));
    unsub();
    emit(EVENTS.SNAPSHOT_DELETED, { snapshotId: 'y' });
    expect(calls).toHaveLength(0);
  });

  test('manual unsubscribe also works', () => {
    const calls = [];
    const handler = (p) => calls.push(p);
    subscribe(EVENTS.SNAPSHOT_EXPORTED, handler);
    unsubscribe(EVENTS.SNAPSHOT_EXPORTED, handler);
    emit(EVENTS.SNAPSHOT_EXPORTED, {});
    expect(calls).toHaveLength(0);
  });
});

describe('error isolation', () => {
  test('a throwing handler does not prevent other handlers from running', () => {
    const calls = [];
    subscribe(EVENTS.SCHEDULE_TRIGGERED, () => { throw new Error('boom'); });
    subscribe(EVENTS.SCHEDULE_TRIGGERED, (p) => calls.push(p));
    expect(() => emit(EVENTS.SCHEDULE_TRIGGERED, {})).not.toThrow();
    expect(calls).toHaveLength(1);
  });
});

describe('emit with no subscribers', () => {
  test('does not throw', () => {
    expect(() => emit(EVENTS.SNAPSHOT_IMPORTED, { snapshotId: 'z' })).not.toThrow();
  });
});
