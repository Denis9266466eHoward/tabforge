const { parseArgs, main } = require('./snapshot.workflow.cli');

jest.mock('./snapshot.workflow', () => ({
  createAndSave: jest.fn(),
  loadAndTrack: jest.fn(),
  removeAndRecord: jest.fn(),
}));
jest.mock('../storage/storage', () => ({
  deleteSnapshotFromDisk: jest.fn(),
}));

const wf = require('./snapshot.workflow');

const base = ['node', 'cli'];

describe('parseArgs', () => {
  it('extracts command and args', () => {
    expect(parseArgs([...base, 'create', 'work', 'https://a.com']))
      .toEqual({ command: 'create', args: ['work', 'https://a.com'] });
  });
});

describe('main — create', () => {
  it('prints snapshot id on success', () => {
    wf.createAndSave.mockReturnValue({ snapshot: { id: 'snap-1' }, errors: [] });
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    main([...base, 'create', 'work', 'https://example.com']);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('snap-1'));
    log.mockRestore();
  });

  it('exits 1 on validation errors', () => {
    wf.createAndSave.mockReturnValue({ snapshot: null, errors: ['bad url'] });
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    expect(() => main([...base, 'create', 'bad', 'not-a-url'])).toThrow('exit');
    expect(exit).toHaveBeenCalledWith(1);
    err.mockRestore(); exit.mockRestore();
  });
});

describe('main — load', () => {
  it('prints snapshot json on success', () => {
    wf.loadAndTrack.mockReturnValue({ id: 'snap-2', name: 'work', tabs: [] });
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    main([...base, 'load', 'snap-2']);
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it('exits 1 when not found', () => {
    wf.loadAndTrack.mockReturnValue(null);
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    expect(() => main([...base, 'load', 'missing'])).toThrow('exit');
    err.mockRestore(); exit.mockRestore();
  });
});

describe('main — remove', () => {
  it('prints confirmation on success', () => {
    wf.removeAndRecord.mockReturnValue(true);
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    main([...base, 'remove', 'snap-3']);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('snap-3'));
    log.mockRestore();
  });
});
