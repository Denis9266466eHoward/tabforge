const { validateSnapshot, validateTab, isValidUrl } = require('./validate');

function makeTab(overrides = {}) {
  return { url: 'https://example.com', title: 'Example', ...overrides };
}

function makeSnapshot(overrides = {}) {
  return {
    id: 'snap-1',
    name: 'My Snapshot',
    tabs: [makeTab()],
    createdAt: '2024-01-15T10:00:00.000Z',
    ...overrides,
  };
}

describe('isValidUrl', () => {
  it('returns true for valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
  });

  it('returns false for invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });
});

describe('validateTab', () => {
  it('returns no errors for a valid tab', () => {
    const errors = validateTab(makeTab(), 0);
    expect(errors).toHaveLength(0);
  });

  it('reports missing url', () => {
    const errors = validateTab({ title: 'No URL' }, 0);
    expect(errors.some(e => e.includes('url'))).toBe(true);
  });

  it('reports missing title', () => {
    const errors = validateTab({ url: 'https://example.com' }, 0);
    expect(errors.some(e => e.includes('title'))).toBe(true);
  });

  it('reports invalid URL format', () => {
    const errors = validateTab(makeTab({ url: 'bad-url' }), 1);
    expect(errors.some(e => e.includes('not a valid URL'))).toBe(true);
  });
});

describe('validateSnapshot', () => {
  it('returns valid for a well-formed snapshot', () => {
    const result = validateSnapshot(makeSnapshot());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns invalid for null input', () => {
    const result = validateSnapshot(null);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('reports missing required snapshot fields', () => {
    const result = validateSnapshot({ tabs: [] });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('id'))).toBe(true);
    expect(result.errors.some(e => e.includes('name'))).toBe(true);
  });

  it('reports when tabs is not an array', () => {
    const result = validateSnapshot(makeSnapshot({ tabs: 'not-an-array' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('array'))).toBe(true);
  });

  it('reports invalid createdAt date', () => {
    const result = validateSnapshot(makeSnapshot({ createdAt: 'not-a-date' }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('createdAt'))).toBe(true);
  });

  it('propagates tab-level errors', () => {
    const result = validateSnapshot(makeSnapshot({ tabs: [{ title: 'No URL' }] }));
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Tab[0]'))).toBe(true);
  });
});
