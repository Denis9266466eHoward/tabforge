const fs = require('fs');
const path = require('path');
const os = require('os');
const { exportSnapshot, importSnapshot } = require('./export');

const SAMPLE_SNAPSHOT = {
  id: 'snap-abc123',
  createdAt: '2024-01-15T10:00:00.000Z',
  tabs: [
    { id: 1, url: 'https://example.com', title: 'Example' },
    { id: 2, url: 'https://github.com', title: 'GitHub' },
  ],
};

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-export-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('exportSnapshot', () => {
  test('writes a JSON file with exportedAt and snapshot fields', () => {
    const outPath = path.join(tmpDir, 'snap.json');
    const result = exportSnapshot(SAMPLE_SNAPSHOT, outPath);

    expect(result).toBe(path.resolve(outPath));
    expect(fs.existsSync(result)).toBe(true);

    const contents = JSON.parse(fs.readFileSync(result, 'utf8'));
    expect(contents).toHaveProperty('exportedAt');
    expect(contents.snapshot).toEqual(SAMPLE_SNAPSHOT);
  });

  test('creates intermediate directories if needed', () => {
    const outPath = path.join(tmpDir, 'nested', 'deep', 'snap.json');
    exportSnapshot(SAMPLE_SNAPSHOT, outPath);
    expect(fs.existsSync(outPath)).toBe(true);
  });

  test('throws on invalid snapshot', () => {
    expect(() => exportSnapshot(null, path.join(tmpDir, 'snap.json'))).toThrow(
      'Invalid snapshot'
    );
  });

  test('throws on invalid outputPath', () => {
    expect(() => exportSnapshot(SAMPLE_SNAPSHOT, '')).toThrow('Invalid outputPath');
  });
});

describe('importSnapshot', () => {
  test('round-trips a snapshot correctly', () => {
    const outPath = path.join(tmpDir, 'snap.json');
    exportSnapshot(SAMPLE_SNAPSHOT, outPath);
    const imported = importSnapshot(outPath);
    expect(imported).toEqual(SAMPLE_SNAPSHOT);
  });

  test('throws if file does not exist', () => {
    expect(() => importSnapshot(path.join(tmpDir, 'missing.json'))).toThrow(
      'File not found'
    );
  });

  test('throws on malformed JSON', () => {
    const badPath = path.join(tmpDir, 'bad.json');
    fs.writeFileSync(badPath, 'not json', 'utf8');
    expect(() => importSnapshot(badPath)).toThrow('Failed to parse JSON');
  });

  test('throws if snapshot field is missing', () => {
    const badPath = path.join(tmpDir, 'nosnap.json');
    fs.writeFileSync(badPath, JSON.stringify({ exportedAt: '2024-01-01' }), 'utf8');
    expect(() => importSnapshot(badPath)).toThrow('missing snapshot field');
  });

  test('throws on invalid filePath', () => {
    expect(() => importSnapshot('')).toThrow('Invalid filePath');
  });
});
