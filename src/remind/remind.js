// remind.js — schedule one-time or recurring reminders tied to snapshots

function createStore() {
  return { reminders: {} };
}

function setReminder(store, snapshotId, { message, remindAt, repeat = null }) {
  if (!snapshotId) throw new Error('snapshotId is required');
  if (!message || typeof message !== 'string') throw new Error('message must be a non-empty string');
  if (!(remindAt instanceof Date) || isNaN(remindAt)) throw new Error('remindAt must be a valid Date');

  const id = `${snapshotId}:${Date.now()}`;
  store.reminders[id] = {
    id,
    snapshotId,
    message,
    remindAt: remindAt.toISOString(),
    repeat, // e.g. 'daily', 'weekly', or null
    dismissed: false,
    createdAt: new Date().toISOString(),
  };
  return store.reminders[id];
}

function getDueReminders(store, now = new Date()) {
  return Object.values(store.reminders).filter(
    (r) => !r.dismissed && new Date(r.remindAt) <= now
  );
}

function dismissReminder(store, reminderId) {
  const r = store.reminders[reminderId];
  if (!r) throw new Error(`Reminder not found: ${reminderId}`);
  if (r.repeat) {
    const next = new Date(r.remindAt);
    if (r.repeat === 'daily') next.setDate(next.getDate() + 1);
    else if (r.repeat === 'weekly') next.setDate(next.getDate() + 7);
    r.remindAt = next.toISOString();
  } else {
    r.dismissed = true;
  }
  return r;
}

function removeReminder(store, reminderId) {
  if (!store.reminders[reminderId]) throw new Error(`Reminder not found: ${reminderId}`);
  delete store.reminders[reminderId];
}

function listReminders(store, snapshotId = null) {
  const all = Object.values(store.reminders);
  return snapshotId ? all.filter((r) => r.snapshotId === snapshotId) : all;
}

module.exports = {
  createStore,
  setReminder,
  getDueReminders,
  dismissReminder,
  removeReminder,
  listReminders,
};
