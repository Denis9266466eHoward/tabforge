// archive.js — move snapshots to/from a cold archive store

'use strict';

const ARCHIVE_KEY = '__archived__';

function createStore() {
  return { archived: {} };
}

function archiveSnapshot(store, snapshot) {
  if (!snapshot || !snapshot.id) throw new Error('Invalid snapshot');
  if (store.archived[snapshot.id]) throw new Error(`Snapshot ${snapshot.id} is already archived`);
  store.archived[snapshot.id] = {
    snapshot,
    archivedAt: new Date().toISOString(),
  };
  return store;
}

function unarchiveSnapshot(store, snapshotId) {
  if (!store.archived[snapshotId]) throw new Error(`Snapshot ${snapshotId} not found in archive`);
  const entry = store.archived[snapshotId];
  delete store.archived[snapshotId];
  return entry.snapshot;
}

function isArchived(store, snapshotId) {
  return Object.prototype.hasOwnProperty.call(store.archived, snapshotId);
}

function listArchived(store) {
  return Object.values(store.archived).map((e) => ({
    ...e.snapshot,
    archivedAt: e.archivedAt,
  }));
}

function purgeArchive(store) {
  store.archived = {};
  return store;
}

module.exports = { createStore, archiveSnapshot, unarchiveSnapshot, isArchived, listArchived, purgeArchive, ARCHIVE_KEY };
