const {
  createSchedule,
  isScheduleDue,
  setScheduleEnabled,
  describeSchedule,
} = require('./schedule');

describe('createSchedule', () => {
  test('creates a schedule with defaults', () => {
    const s = createSchedule('work');
    expect(s.name).toBe('work');
    expect(s.intervalMs).toBe(30 * 60 * 1000);
    expect(s.tags).toEqual([]);
    expect(s.enabled).toBe(true);
    expect(s.createdAt).toBeDefined();
  });

  test('accepts custom interval and tags', () => {
    const s = createSchedule('research', 5000, ['research', 'auto']);
    expect(s.intervalMs).toBe(5000);
    expect(s.tags).toEqual(['research', 'auto']);
  });

  test('throws on empty name', () => {
    expect(() => createSchedule('')).toThrow('Schedule name must be a non-empty string');
  });

  test('throws on invalid interval', () => {
    expect(() => createSchedule('x', -1)).toThrow('intervalMs must be a positive number');
    expect(() => createSchedule('x', 0)).toThrow('intervalMs must be a positive number');
  });
});

describe('isScheduleDue', () => {
  const schedule = createSchedule('test', 10000);

  test('returns true if never run', () => {
    expect(isScheduleDue(schedule, null)).toBe(true);
  });

  test('returns true if interval has passed', () => {
    const lastRun = new Date(Date.now() - 15000).toISOString();
    expect(isScheduleDue(schedule, lastRun)).toBe(true);
  });

  test('returns false if interval has not passed', () => {
    const lastRun = new Date(Date.now() - 3000).toISOString();
    expect(isScheduleDue(schedule, lastRun)).toBe(false);
  });

  test('returns false if disabled', () => {
    const disabled = setScheduleEnabled(schedule, false);
    expect(isScheduleDue(disabled, null)).toBe(false);
  });
});

describe('setScheduleEnabled', () => {
  test('disables a schedule', () => {
    const s = createSchedule('x', 1000);
    const disabled = setScheduleEnabled(s, false);
    expect(disabled.enabled).toBe(false);
    expect(s.enabled).toBe(true); // original unchanged
  });

  test('re-enables a schedule', () => {
    const s = setScheduleEnabled(createSchedule('x', 1000), false);
    expect(setScheduleEnabled(s, true).enabled).toBe(true);
  });
});

describe('describeSchedule', () => {
  test('returns readable string without tags', () => {
    const s = createSchedule('daily', 60 * 60 * 1000);
    expect(describeSchedule(s)).toBe('"daily" every 60min, enabled');
  });

  test('includes tags when present', () => {
    const s = createSchedule('nightly', 120 * 60 * 1000, ['auto', 'nightly']);
    expect(describeSchedule(s)).toContain('[auto, nightly]');
  });

  test('shows disabled status', () => {
    const s = setScheduleEnabled(createSchedule('x', 60000), false);
    expect(describeSchedule(s)).toContain('disabled');
  });
});
