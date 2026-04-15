'use strict';

const { restoreSnapshot, restoreByTag, restorePinnedTabs } = require('./restore');
const { readSnapshotFromDisk } = require('../storage/storage');

jest.mock('../storage/storage');

const makeMockSnapshot = (tabs) => JSON.stringify({
  id: 'snap-001',
  name: 'Test Snapshot',
  createdAt: '2024-01-01T00:00:00.000Z',
  tabs,
});

const sampleTabs = [
  { url: 'https://github.com', title: 'GitHub', pinned: true, tags: ['work'] },
  { url: 'https://news.ycombinator.com', title: 'HN', pinned: false, tags: ['reading'] },
  { url: 'https://localhost:3000', title: 'Dev', pinned: false, tags: ['work', 'dev'] },
];

beforeEach(() => {
  readSnapshotFromDisk.mockReturnValue(makeMockSnapshot(sampleTabs));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('restoreSnapshot', () => {
  it('returns all tabs and a restoredAt timestamp', () => {
    const result = restoreSnapshot('snap-001');
    expect(result.tabs).toHaveLength(3);
    expect(result.restoredAt).toBeDefined();
    expect(new Date(result.restoredAt).toString()).not.toBe('Invalid Date');
  });

  it('calls readSnapshotFromDisk with the correct id', () => {
    restoreSnapshot('snap-001');
    expect(readSnapshotFromDisk).toHaveBeenCalledWith('snap-001');
  });
});

describe('restoreByTag', () => {
  it('returns only tabs matching the given tag', () => {
    const result = restoreByTag('snap-001', 'work');
    expect(result.tabs).toHaveLength(2);
    result.tabs.forEach((t) => expect(t.tags).toContain('work'));
  });

  it('returns empty array when no tabs match the tag', () => {
    const result = restoreByTag('snap-001', 'nonexistent');
    expect(result.tabs).toHaveLength(0);
  });

  it('includes a restoredAt timestamp', () => {
    const result = restoreByTag('snap-001', 'dev');
    expect(result.restoredAt).toBeDefined();
  });
});

describe('restorePinnedTabs', () => {
  it('returns only pinned tabs', () => {
    const result = restorePinnedTabs('snap-001');
    expect(result.tabs).toHaveLength(1);
    expect(result.tabs[0].url).toBe('https://github.com');
  });

  it('returns empty array when no tabs are pinned', () => {
    const unpinnedTabs = sampleTabs.map((t) => ({ ...t, pinned: false }));
    readSnapshotFromDisk.mockReturnValue(makeMockSnapshot(unpinnedTabs));
    const result = restorePinnedTabs('snap-001');
    expect(result.tabs).toHaveLength(0);
  });
});
