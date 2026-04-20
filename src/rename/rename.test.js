const { renameSnapshot, bulkRename, buildRenameRecord } = require('./rename');

function makeSnapshot(overrides = {}) {
  return {
    id: 'snap-1',
    name: 'My Session',
    tabs: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('renameSnapshot', () => {
  test('returns new snapshot with updated name', () => {
    const snap = makeSnapshot();
    const result = renameSnapshot(snap, 'Work Session');
    expect(result.name).toBe('Work Session');
    expect(result.id).toBe(snap.id);
  });

  test('trims whitespace from new name', () => {
    const snap = makeSnapshot();
    const result = renameSnapshot(snap, '  Trimmed  ');
    expect(result.name).toBe('Trimmed');
  });

  test('returns same snapshot when name is unchanged', () => {
    const snap = makeSnapshot({ name: 'My Session' });
    const result = renameSnapshot(snap, 'My Session');
    expect(result).toBe(snap);
  });

  test('sets updatedAt on rename', () => {
    const snap = makeSnapshot();
    const result = renameSnapshot(snap, 'New Name');
    expect(result.updatedAt).toBeDefined();
  });

  test('does not mutate the original snapshot', () => {
    const snap = makeSnapshot({ name: 'Original' });
    renameSnapshot(snap, 'Changed');
    expect(snap.name).toBe('Original');
  });

  test('throws on invalid snapshot', () => {
    expect(() => renameSnapshot(null, 'x')).toThrow('Invalid snapshot');
  });

  test('throws on empty name', () => {
    const snap = makeSnapshot();
    expect(() => renameSnapshot(snap, '   ')).toThrow('non-empty string');
  });
});

describe('bulkRename', () => {
  test('renames matching snapshots', () => {
    const snaps = [
      makeSnapshot({ id: 'a', name: 'old-a' }),
      makeSnapshot({ id: 'b', name: 'keep' }),
    ];
    const result = bulkRename(
      snaps,
      s => s.name.startsWith('old'),
      s => s.name.replace('old-', 'new-')
    );
    expect(result[0].name).toBe('new-a');
    expect(result[1].name).toBe('keep');
  });

  test('throws if snapshots is not array', () => {
    expect(() => bulkRename(null, () => true, s => s.name)).toThrow();
  });
});

describe('buildRenameRecord', () => {
  test('creates a rename record', () => {
    const snap = makeSnapshot();
    const record = buildRenameRecord(snap, 'Old', 'New');
    expect(record.snapshotId).toBe('snap-1');
    expect(record.oldName).toBe('Old');
    expect(record.newName).toBe('New');
    expect(record.renamedAt).toBeDefined();
  });
});
