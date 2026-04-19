// Access control: assign roles/permissions to snapshots

const ROLES = ['viewer', 'editor', 'owner'];

export function createStore() {
  return new Map();
}

export function setAccess(store, snapshotId, user, role) {
  if (!ROLES.includes(role)) throw new Error(`Invalid role: ${role}`);
  if (!store.has(snapshotId)) store.set(snapshotId, {});
  const entry = store.get(snapshotId);
  entry[user] = role;
  return entry;
}

export function getAccess(store, snapshotId, user) {
  const entry = store.get(snapshotId);
  if (!entry) return null;
  return entry[user] ?? null;
}

export function removeAccess(store, snapshotId, user) {
  const entry = store.get(snapshotId);
  if (!entry) return false;
  if (!(user in entry)) return false;
  delete entry[user];
  return true;
}

export function hasAccess(store, snapshotId, user, role) {
  const actual = getAccess(store, snapshotId, user);
  if (!actual) return false;
  return ROLES.indexOf(actual) >= ROLES.indexOf(role);
}

export function listAccess(store, snapshotId) {
  return store.get(snapshotId) ?? {};
}

export function filterByAccess(store, snapshots, user, role) {
  return snapshots.filter(s => hasAccess(store, s.id, user, role));
}
