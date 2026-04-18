// workspace.js — group snapshots into named workspaces

function createStore() {
  return { workspaces: {} };
}

function createWorkspace(store, name) {
  if (!name || typeof name !== 'string') throw new Error('Workspace name required');
  if (store.workspaces[name]) throw new Error(`Workspace '${name}' already exists`);
  store.workspaces[name] = { name, snapshotIds: [], createdAt: new Date().toISOString() };
  return store.workspaces[name];
}

function addToWorkspace(store, name, snapshotId) {
  const ws = _get(store, name);
  if (!ws.snapshotIds.includes(snapshotId)) ws.snapshotIds.push(snapshotId);
  return ws;
}

function removeFromWorkspace(store, name, snapshotId) {
  const ws = _get(store, name);
  ws.snapshotIds = ws.snapshotIds.filter(id => id !== snapshotId);
  return ws;
}

function getWorkspace(store, name) {
  return _get(store, name);
}

function listWorkspaces(store) {
  return Object.values(store.workspaces);
}

function deleteWorkspace(store, name) {
  _get(store, name);
  delete store.workspaces[name];
}

function workspacesForSnapshot(store, snapshotId) {
  return Object.values(store.workspaces).filter(ws => ws.snapshotIds.includes(snapshotId));
}

function renameWorkspace(store, oldName, newName) {
  if (!newName || typeof newName !== 'string') throw new Error('New name required');
  if (store.workspaces[newName]) throw new Error(`Workspace '${newName}' already exists`);
  const ws = _get(store, oldName);
  ws.name = newName;
  store.workspaces[newName] = ws;
  delete store.workspaces[oldName];
  return ws;
}

function _get(store, name) {
  if (!store.workspaces[name]) throw new Error(`Workspace '${name}' not found`);
  return store.workspaces[name];
}

module.exports = { createStore, createWorkspace, addToWorkspace, removeFromWorkspace, getWorkspace, listWorkspaces, deleteWorkspace, workspacesForSnapshot, renameWorkspace };
