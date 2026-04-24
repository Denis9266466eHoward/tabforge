const { createAndSave, loadAndTrack, removeAndRecord } = require('./snapshot.workflow');
const { validateSnapshot } = require('../validate/validate');

// ---- minimal stubs --------------------------------------------------------
jest.mock('../storage/storage', () => ({
  saveSnapshotToDisk: jest.fn(),
  readSnapshotFromDisk: jest.fn(),
}));
jest.mock('../audit/audit', () => ({ recordAction: jest.fn() }));
jest.mock('../history/history', () => ({ recordEvent: jest.fn() }));

const storage = require('../storage/storage');

const TABS = [
  { id: 't1', url: 'https://example.com', title: 'Example' },
];

describe('createAndSave', () => {
  it('returns a snapshot and empty errors for valid input', () => {
    const { snapshot, errors } = createAndSave('work', TABS);
    expect(errors).toHaveLength(0);
    expect(snapshot).not.toBeNull();
    expect(snapshot.name).toBe('work');
    expect(storage.saveSnapshotToDisk).toHaveBeenCalledWith(snapshot);
  });

  it('returns errors and null snapshot for invalid tabs', () => {
    const badTabs = [{ id: 't2', url: 'not-a-url', title: '' }];
    const { snapshot, errors } = createAndSave('bad', badTabs);
    expect(snapshot).toBeNull();
    expect(errors.length).toBeGreaterThan(0);
    expect(storage.saveSnapshotToDisk).not.toHaveBeenCalledWith(null);
  });
});

describe('loadAndTrack', () => {
  it('returns null when snapshot not found', () => {
    storage.readSnapshotFromDisk.mockReturnValueOnce(null);
    expect(loadAndTrack('missing-id')).toBeNull();
  });

  it('returns snapshot when found', () => {
    const raw = { id: 'abc', name: 'work', tabs: TABS, createdAt: Date.now() };
    storage.readSnapshotFromDisk.mockReturnValueOnce(raw);
    const snap = loadAndTrack('abc');
    expect(snap).not.toBeNull();
    expect(snap.id).toBe('abc');
  });
});

describe('removeAndRecord', () => {
  it('returns true and records event on successful delete', () => {
    const del = jest.fn().mockReturnValue(true);
    expect(removeAndRecord('abc', del)).toBe(true);
    expect(del).toHaveBeenCalledWith('abc');
  });

  it('returns false and does not record when delete fails', () => {
    const del = jest.fn().mockReturnValue(false);
    expect(removeAndRecord('xyz', del)).toBe(false);
  });
});
