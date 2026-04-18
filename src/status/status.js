/**
 * status.js — snapshot status tracking (active, idle, stale)
 */

const STATUS = {
  ACTIVE: 'active',
  IDLE: 'idle',
  STALE: 'stale',
};

const STALE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const IDLE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 1 day

function getStatus(snapshot, now = Date.now()) {
  if (!snapshot || !snapshot.createdAt) {
    throw new Error('Invalid snapshot: missing createdAt');
  }
  const age = now - new Date(snapshot.createdAt).getTime();
  if (age >= STALE_THRESHOLD_MS) return STATUS.STALE;
  if (age >= IDLE_THRESHOLD_MS) return STATUS.IDLE;
  return STATUS.ACTIVE;
}

function annotateWithStatus(snapshots, now = Date.now()) {
  return snapshots.map((s) => ({ ...s, status: getStatus(s, now) }));
}

function filterByStatus(snapshots, status, now = Date.now()) {
  if (!Object.values(STATUS).includes(status)) {
    throw new Error(`Unknown status: ${status}`);
  }
  return snapshots.filter((s) => getStatus(s, now) === status);
}

function summarizeStatuses(snapshots, now = Date.now()) {
  const summary = { active: 0, idle: 0, stale: 0 };
  for (const s of snapshots) {
    summary[getStatus(s, now)]++;
  }
  return summary;
}

module.exports = { STATUS, getStatus, annotateWithStatus, filterByStatus, summarizeStatuses };
