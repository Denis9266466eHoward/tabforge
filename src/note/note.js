// note.js — attach freeform notes to snapshots

'use strict';

function createStore() {
  return Object.create(null);
}

function setNote(store, snapshotId, text) {
  if (typeof snapshotId !== 'string' || !snapshotId) {
    throw new Error('snapshotId must be a non-empty string');
  }
  if (typeof text !== 'string') {
    throw new Error('note text must be a string');
  }
  store[snapshotId] = { text, updatedAt: new Date().toISOString() };
  return store[snapshotId];
}

function getNote(store, snapshotId) {
  return store[snapshotId] ?? null;
}

function removeNote(store, snapshotId) {
  if (!store[snapshotId]) return false;
  delete store[snapshotId];
  return true;
}

function hasNote(store, snapshotId) {
  return Object.prototype.hasOwnProperty.call(store, snapshotId);
}

function listNotes(store) {
  return Object.entries(store).map(([snapshotId, note]) => ({
    snapshotId,
    ...note,
  }));
}

function filterWithNotes(store, snapshots) {
  return snapshots.filter((s) => hasNote(store, s.id));
}

module.exports = {
  createStore,
  setNote,
  getNote,
  removeNote,
  hasNote,
  listNotes,
  filterWithNotes,
};
