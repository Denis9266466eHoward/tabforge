const {
  createStore,
  setReminder,
  getDueReminders,
  dismissReminder,
  removeReminder,
  listReminders,
} = require('./remind');

const PAST = new Date(Date.now() - 10_000);
const FUTURE = new Date(Date.now() + 10_000);

describe('setReminder', () => {
  it('creates a reminder and returns it', () => {
    const store = createStore();
    const r = setReminder(store, 'snap-1', { message: 'Review tabs', remindAt: FUTURE });
    expect(r.snapshotId).toBe('snap-1');
    expect(r.message).toBe('Review tabs');
    expect(r.dismissed).toBe(false);
  });

  it('throws without snapshotId', () => {
    expect(() => setReminder(createStore(), null, { message: 'x', remindAt: FUTURE })).toThrow();
  });

  it('throws with invalid remindAt', () => {
    expect(() => setReminder(createStore(), 'snap-1', { message: 'x', remindAt: 'not-a-date' })).toThrow();
  });
});

describe('getDueReminders', () => {
  it('returns only past-due, non-dismissed reminders', () => {
    const store = createStore();
    setReminder(store, 'snap-1', { message: 'past', remindAt: PAST });
    setReminder(store, 'snap-2', { message: 'future', remindAt: FUTURE });
    const due = getDueReminders(store);
    expect(due).toHaveLength(1);
    expect(due[0].message).toBe('past');
  });
});

describe('dismissReminder', () => {
  it('marks a one-time reminder as dismissed', () => {
    const store = createStore();
    const r = setReminder(store, 'snap-1', { message: 'hi', remindAt: PAST });
    dismissReminder(store, r.id);
    expect(store.reminders[r.id].dismissed).toBe(true);
  });

  it('advances a daily reminder instead of dismissing', () => {
    const store = createStore();
    const r = setReminder(store, 'snap-1', { message: 'daily', remindAt: PAST, repeat: 'daily' });
    const before = new Date(r.remindAt);
    dismissReminder(store, r.id);
    const after = new Date(store.reminders[r.id].remindAt);
    expect(after - before).toBeCloseTo(86_400_000, -3);
    expect(store.reminders[r.id].dismissed).toBe(false);
  });

  it('throws for unknown id', () => {
    expect(() => dismissReminder(createStore(), 'no-such-id')).toThrow();
  });
});

describe('removeReminder', () => {
  it('deletes a reminder from the store', () => {
    const store = createStore();
    const r = setReminder(store, 'snap-1', { message: 'bye', remindAt: FUTURE });
    removeReminder(store, r.id);
    expect(store.reminders[r.id]).toBeUndefined();
  });
});

describe('listReminders', () => {
  it('lists all reminders when no filter given', () => {
    const store = createStore();
    setReminder(store, 'snap-1', { message: 'a', remindAt: FUTURE });
    setReminder(store, 'snap-2', { message: 'b', remindAt: FUTURE });
    expect(listReminders(store)).toHaveLength(2);
  });

  it('filters by snapshotId', () => {
    const store = createStore();
    setReminder(store, 'snap-1', { message: 'a', remindAt: FUTURE });
    setReminder(store, 'snap-2', { message: 'b', remindAt: FUTURE });
    expect(listReminders(store, 'snap-1')).toHaveLength(1);
  });
});
