// quota.js — enforce snapshot count and storage limits

function createStore() {
  return { limits: {} };
}

function setQuota(store, scope, { maxSnapshots = null, maxTabs = null } = {}) {
  store.limits[scope] = { maxSnapshots, maxTabs };
  return store;
}

function getQuota(store, scope) {
  return store.limits[scope] || null;
}

function removeQuota(store, scope) {
  delete store.limits[scope];
  return store;
}

function hasQuota(store, scope) {
  return Object.prototype.hasOwnProperty.call(store.limits, scope);
}

function checkSnapshotQuota(store, scope, currentCount) {
  const quota = getQuota(store, scope);
  if (!quota || quota.maxSnapshots === null) return { allowed: true };
  if (currentCount >= quota.maxSnapshots) {
    return {
      allowed: false,
      reason: `Snapshot limit of ${quota.maxSnapshots} reached for scope "${scope}"`
    };
  }
  return { allowed: true };
}

function checkTabQuota(store, scope, tabCount) {
  const quota = getQuota(store, scope);
  if (!quota || quota.maxTabs === null) return { allowed: true };
  if (tabCount > quota.maxTabs) {
    return {
      allowed: false,
      reason: `Tab limit of ${quota.maxTabs} exceeded for scope "${scope}"`
    };
  }
  return { allowed: true };
}

function listQuotas(store) {
  return Object.entries(store.limits).map(([scope, limits]) => ({ scope, ...limits }));
}

module.exports = {
  createStore,
  setQuota,
  getQuota,
  removeQuota,
  hasQuota,
  checkSnapshotQuota,
  checkTabQuota,
  listQuotas
};
