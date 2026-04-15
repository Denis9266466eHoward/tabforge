/**
 * schedule.js — auto-snapshot scheduling based on time intervals
 */

const DEFAULT_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Creates a schedule config object.
 * @param {string} name - Label for the scheduled snapshot
 * @param {number} intervalMs - How often to snapshot (ms)
 * @param {string[]} [tags] - Tags to attach to each snapshot
 * @returns {object}
 */
function createSchedule(name, intervalMs = DEFAULT_INTERVAL_MS, tags = []) {
  if (!name || typeof name !== 'string') {
    throw new Error('Schedule name must be a non-empty string');
  }
  if (typeof intervalMs !== 'number' || intervalMs <= 0) {
    throw new Error('intervalMs must be a positive number');
  }
  return {
    name,
    intervalMs,
    tags,
    createdAt: new Date().toISOString(),
    enabled: true,
  };
}

/**
 * Checks whether a schedule is due to fire given the last run time.
 * @param {object} schedule
 * @param {string|null} lastRunAt - ISO string of last run, or null if never run
 * @param {Date} [now]
 * @returns {boolean}
 */
function isScheduleDue(schedule, lastRunAt, now = new Date()) {
  if (!schedule.enabled) return false;
  if (!lastRunAt) return true;
  const last = new Date(lastRunAt);
  return now - last >= schedule.intervalMs;
}

/**
 * Updates a schedule's enabled state.
 * @param {object} schedule
 * @param {boolean} enabled
 * @returns {object}
 */
function setScheduleEnabled(schedule, enabled) {
  return { ...schedule, enabled: Boolean(enabled) };
}

/**
 * Returns a human-readable summary of a schedule.
 * @param {object} schedule
 * @returns {string}
 */
function describeSchedule(schedule) {
  const mins = Math.round(schedule.intervalMs / 60000);
  const status = schedule.enabled ? 'enabled' : 'disabled';
  const tags = schedule.tags.length ? ` [${schedule.tags.join(', ')}]` : '';
  return `"${schedule.name}" every ${mins}min, ${status}${tags}`;
}

module.exports = { createSchedule, isScheduleDue, setScheduleEnabled, describeSchedule };
