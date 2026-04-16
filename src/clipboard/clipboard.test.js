const { copySnapshot, pasteSnapshot, isClipboardPayload } = require('./clipboard');

function makeSnapshot(id = 'snap-1') {
  return {
    id,
    name: 'Test Snapshot',
    createdAt: '2024-01-01T00:00:00.000Z',
    tabs: [
      { id: 't1', url: 'https://example.com', title: 'Example' }
    ],
    tags: []
  };
}

describe('copySnapshot', () => {
  it('returns a JSON string with tabforge marker', () => {
    const snap = makeSnapshot();
    const result = copySnapshot(snap);
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result);
    expect(parsed.__tabforge).toBe(true);
    expect(parsed.snapshot.id).toBe('snap-1');
  });

  it('throws on invalid input', () => {
    expect(() => copySnapshot(null)).toThrow();
    expect(() => copySnapshot('string')).toThrow();
  });
});

describe('pasteSnapshot', () => {
  it('returns the original snapshot', () => {
    const snap = makeSnapshot('snap-2');
    const text = copySnapshot(snap);
    const result = pasteSnapshot(text);
    expect(result.id).toBe('snap-2');
    expect(result.tabs).toHaveLength(1);
  });

  it('throws on empty string', () => {
    expect(() => pasteSnapshot('')).toThrow();
  });

  it('throws on invalid JSON', () => {
    expect(() => pasteSnapshot('not json')).toThrow('not valid JSON');
  });

  it('throws when tabforge marker is missing', () => {
    expect(() => pasteSnapshot(JSON.stringify({ foo: 'bar' }))).toThrow('not a tabforge clipboard payload');
  });
});

describe('isClipboardPayload', () => {
  it('returns true for valid payload', () => {
    const text = copySnapshot(makeSnapshot());
    expect(isClipboardPayload(text)).toBe(true);
  });

  it('returns false for random JSON', () => {
    expect(isClipboardPayload(JSON.stringify({ hello: 'world' }))).toBe(false);
  });

  it('returns false for non-JSON', () => {
    expect(isClipboardPayload('hello')).toBe(false);
  });
});
