'use strict';

const { parseArgs, main } = require('./snapshot.cli');
const storage = require('../storage/storage');
const snapshotModule = require('./snapshot');

jest.mock('../storage/storage');
jest.mock('./snapshot');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('parseArgs', () => {
  test('parses command and positional args', () => {
    const result = parseArgs(['create', 'my-snap']);
    expect(result.command).toBe('create');
    expect(result.positional).toEqual(['my-snap']);
  });

  test('parses flags with values', () => {
    const result = parseArgs(['create', '--name', 'work', '--tabs', '[]']);
    expect(result.flags.name).toBe('work');
    expect(result.flags.tabs).toBe('[]');
  });

  test('parses boolean flags', () => {
    const result = parseArgs(['list', '--verbose']);
    expect(result.flags.verbose).toBe(true);
  });
});

describe('main', () => {
  test('create command saves a snapshot', async () => {
    const fakeSnap = { id: 'snap-001', name: 'test', tabs: [] };
    snapshotModule.createSnapshot.mockReturnValue(fakeSnap);
    storage.saveSnapshotToDisk.mockResolvedValue();

    await main(['create', '--name', 'test', '--tabs', '[]']);

    expect(snapshotModule.createSnapshot).toHaveBeenCalledWith({ name: 'test', tabs: [] });
    expect(storage.saveSnapshotToDisk).toHaveBeenCalledWith(fakeSnap);
    expect(console.log).toHaveBeenCalledWith('Snapshot created: snap-001');
  });

  test('list command prints snapshot ids', async () => {
    storage.listSnapshotIds.mockResolvedValue(['id-1', 'id-2']);

    await main(['list']);

    expect(console.log).toHaveBeenCalledWith('id-1');
    expect(console.log).toHaveBeenCalledWith('id-2');
  });

  test('list command prints message when empty', async () => {
    storage.listSnapshotIds.mockResolvedValue([]);

    await main(['list']);

    expect(console.log).toHaveBeenCalledWith('No snapshots found.');
  });

  test('show command prints snapshot json', async () => {
    const raw = { id: 'snap-001', name: 'work', tabs: [] };
    const loaded = { ...raw, loadedAt: Date.now() };
    storage.readSnapshotFromDisk.mockResolvedValue(raw);
    snapshotModule.loadSnapshot.mockReturnValue(loaded);

    await main(['show', 'snap-001']);

    expect(storage.readSnapshotFromDisk).toHaveBeenCalledWith('snap-001');
    expect(console.log).toHaveBeenCalledWith(JSON.stringify(loaded, null, 2));
  });

  test('delete command removes snapshot', async () => {
    storage.deleteSnapshotFromDisk.mockResolvedValue();

    await main(['delete', 'snap-001']);

    expect(storage.deleteSnapshotFromDisk).toHaveBeenCalledWith('snap-001');
    expect(console.log).toHaveBeenCalledWith('Snapshot deleted: snap-001');
  });

  test('unknown command exits with error', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });

    await expect(main(['bogus'])).rejects.toThrow('exit');
    expect(console.error).toHaveBeenCalledWith('Unknown command: bogus');

    exitSpy.mockRestore();
  });
});
