'use strict';

const { parseArgs, main } = require('./snapshot.cli');
const storage = require('../storage/storage');
const snapshotModule = require('./snapshot');

jest.mock('../storage/storage');
jest.mock('./snapshot');

beforeEach(() => jest.clearAllMocks());

describe('parseArgs', () => {
  test('parses command and rest args', () => {
    expect(parseArgs(['create', 'work', 'http://a.com'])).toEqual({
      cmd: 'create',
      args: ['work', 'http://a.com'],
    });
  });

  test('handles list with no extra args', () => {
    expect(parseArgs(['list'])).toEqual({ cmd: 'list', args: [] });
  });
});

describe('main', () => {
  test('create saves snapshot and logs', async () => {
    const fakeSnap = { id: 'abc', name: 'work', tabs: [{ id: 'tab-1', url: 'http://a.com', title: 'http://a.com' }] };
    snapshotModule.createSnapshot.mockReturnValue(fakeSnap);
    storage.saveSnapshotToDisk.mockResolvedValue();
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    await main(['create', 'work', 'http://a.com']);

    expect(snapshotModule.createSnapshot).toHaveBeenCalledWith('work', [
      { id: 'tab-1', url: 'http://a.com', title: 'http://a.com' },
    ]);
    expect(storage.saveSnapshotToDisk).toHaveBeenCalledWith(fakeSnap);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('work'));
    log.mockRestore();
  });

  test('load reads and prints snapshot', async () => {
    const raw = { id: 'abc', name: 'work', tabs: [{ url: 'http://a.com' }] };
    storage.readSnapshotFromDisk.mockResolvedValue(raw);
    snapshotModule.loadSnapshot.mockReturnValue(raw);
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    await main(['load', 'abc']);

    expect(storage.readSnapshotFromDisk).toHaveBeenCalledWith('abc');
    expect(log).toHaveBeenCalledWith(expect.stringContaining('work'));
    log.mockRestore();
  });

  test('list prints ids', async () => {
    storage.listSnapshotIds.mockResolvedValue(['id1', 'id2']);
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    await main(['list']);

    expect(log).toHaveBeenCalledWith('id1');
    expect(log).toHaveBeenCalledWith('id2');
    log.mockRestore();
  });

  test('unknown command exits with error', async () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });

    await expect(main(['unknown'])).rejects.toThrow('exit');
    expect(err).toHaveBeenCalled();
    err.mockRestore();
    exit.mockRestore();
  });
});
