const { createStore, createWorkspace, addToWorkspace, removeFromWorkspace, getWorkspace, listWorkspaces, deleteWorkspace, workspacesForSnapshot, renameWorkspace } = require('./workspace');

function makeSnapshot(id) {
  return { id, name: `snap-${id}`, tabs: [], createdAt: new Date().toISOString() };
}

describe('workspace', () => {
  let store;
  beforeEach(() => { store = createStore(); });

  test('createWorkspace adds a workspace', () => {
    const ws = createWorkspace(store, 'dev');
    expect(ws.name).toBe('dev');
    expect(ws.snapshotIds).toEqual([]);
  });

  test('createWorkspace throws on duplicate', () => {
    createWorkspace(store, 'dev');
    expect(() => createWorkspace(store, 'dev')).toThrow();
  });

  test('addToWorkspace adds snapshot id', () => {
    createWorkspace(store, 'dev');
    addToWorkspace(store, 'dev', 'snap-1');
    expect(getWorkspace(store, 'dev').snapshotIds).toContain('snap-1');
  });

  test('addToWorkspace deduplicates', () => {
    createWorkspace(store, 'dev');
    addToWorkspace(store, 'dev', 'snap-1');
    addToWorkspace(store, 'dev', 'snap-1');
    expect(getWorkspace(store, 'dev').snapshotIds).toHaveLength(1);
  });

  test('removeFromWorkspace removes snapshot id', () => {
    createWorkspace(store, 'dev');
    addToWorkspace(store, 'dev', 'snap-1');
    removeFromWorkspace(store, 'dev', 'snap-1');
    expect(getWorkspace(store, 'dev').snapshotIds).not.toContain('snap-1');
  });

  test('listWorkspaces returns all', () => {
    createWorkspace(store, 'dev');
    createWorkspace(store, 'prod');
    expect(listWorkspaces(store)).toHaveLength(2);
  });

  test('deleteWorkspace removes it', () => {
    createWorkspace(store, 'dev');
    deleteWorkspace(store, 'dev');
    expect(() => getWorkspace(store, 'dev')).toThrow();
  });

  test('workspacesForSnapshot returns matching workspaces', () => {
    createWorkspace(store, 'dev');
    createWorkspace(store, 'prod');
    addToWorkspace(store, 'dev', 'snap-1');
    const result = workspacesForSnapshot(store, 'snap-1');
    expect(result.map(w => w.name)).toContain('dev');
    expect(result.map(w => w.name)).not.toContain('prod');
  });

  test('renameWorkspace renames correctly', () => {
    createWorkspace(store, 'dev');
    renameWorkspace(store, 'dev', 'development');
    expect(() => getWorkspace(store, 'development')).not.toThrow();
    expect(() => getWorkspace(store, 'dev')).toThrow();
  });
});
