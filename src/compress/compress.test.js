const { compressSnapshot, decompressSnapshot, compressionRatio } = require('./compress');

function makeSnapshot(overrides = {}) {
  return {
    id: 'snap-001',
    name: 'test snapshot',
    createdAt: '2024-06-01T10:00:00.000Z',
    tabs: [
      { url: 'https://example.com', title: 'Example', pinned: false },
      { url: 'https://github.com', title: 'GitHub', pinned: true },
    ],
    tags: ['work', 'dev'],
    ...overrides,
  };
}

describe('compressSnapshot', () => {
  it('returns a Buffer', async () => {
    const buf = await compressSnapshot(makeSnapshot());
    expect(Buffer.isBuffer(buf)).toBe(true);
  });

  it('produces output smaller than or equal to a large snapshot JSON', async () => {
    const bigSnapshot = makeSnapshot({
      tabs: Array.from({ length: 100 }, (_, i) => ({
        url: `https://site${i}.example.com/path/to/page`,
        title: `Site ${i} - Home Page`,
        pinned: false,
      })),
    });
    const buf = await compressSnapshot(bigSnapshot);
    const originalSize = Buffer.byteLength(JSON.stringify(bigSnapshot), 'utf8');
    expect(buf.length).toBeLessThan(originalSize);
  });

  it('throws if snapshot is not an object', async () => {
    await expect(compressSnapshot(null)).rejects.toThrow('must be a non-null object');
    await expect(compressSnapshot('string')).rejects.toThrow('must be a non-null object');
  });
});

describe('decompressSnapshot', () => {
  it('round-trips a snapshot correctly', async () => {
    const original = makeSnapshot();
    const buf = await compressSnapshot(original);
    const restored = await decompressSnapshot(buf);
    expect(restored).toEqual(original);
  });

  it('throws if input is not a Buffer', async () => {
    await expect(decompressSnapshot('not a buffer')).rejects.toThrow('must be a Buffer');
    await expect(decompressSnapshot({})).rejects.toThrow('must be a Buffer');
  });

  it('throws on corrupted buffer', async () => {
    const bad = Buffer.from('this is not gzip data');
    await expect(decompressSnapshot(bad)).rejects.toThrow();
  });
});

describe('compressionRatio', () => {
  it('returns a number between 0 and 1 for a typical snapshot', async () => {
    const ratio = await compressionRatio(makeSnapshot({
      tabs: Array.from({ length: 50 }, (_, i) => ({
        url: `https://example.com/page/${i}`,
        title: `Page ${i}`,
        pinned: false,
      })),
    }));
    expect(typeof ratio).toBe('number');
    expect(ratio).toBeGreaterThan(0);
    expect(ratio).toBeLessThan(1);
  });
});
