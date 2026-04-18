// share.js — generate shareable snapshot links/tokens

const crypto = require('crypto');

function createStore() {
  return { shares: {} };
}

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

function shareSnapshot(store, snapshot, options = {}) {
  if (!snapshot || !snapshot.id) throw new Error('Invalid snapshot');
  const token = generateToken();
  const record = {
    token,
    snapshotId: snapshot.id,
    createdAt: new Date().toISOString(),
    expiresAt: options.expiresAt || null,
    label: options.label || null,
  };
  store.shares[token] = record;
  return record;
}

function resolveShare(store, token) {
  const record = store.shares[token];
  if (!record) return null;
  if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
    return null;
  }
  return record;
}

function revokeShare(store, token) {
  if (!store.shares[token]) return false;
  delete store.shares[token];
  return true;
}

function listShares(store, snapshotId) {
  return Object.values(store.shares).filter(
    (r) => !snapshotId || r.snapshotId === snapshotId
  );
}

function isExpired(record) {
  if (!record.expiresAt) return false;
  return new Date(record.expiresAt) < new Date();
}

module.exports = { createStore, shareSnapshot, resolveShare, revokeShare, listShares, isExpired };
