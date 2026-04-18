const { createStore, shareSnapshot, resolveShare, revokeShare, listShares, isExpired } = require('./share');

function makeSnapshot(id = 'snap-1') {
  return { id, name: 'Test', tabs: [], createdAt: new Date().toISOString() };
}

describe('shareSnapshot', () => {
  it('creates a share record with a token', () => {
    const store = createStore();
    const snap = makeSnapshot();
    const record = shareSnapshot(store, snap);
    expect(record.token).toBeDefined();
    expect(record.snapshotId).toBe('snap-1');
    expect(record.expiresAt).toBeNull();
  });

  it('stores optional label and expiresAt', () => {
    const store = createStore();
    const snap = makeSnapshot();
    const exp = new Date(Date.now() + 10000).toISOString();
    const record = shareSnapshot(store, snap, { label: 'team-link', expiresAt: exp });
    expect(record.label).toBe('team-link');
    expect(record.expiresAt).toBe(exp);
  });

  it('throws on invalid snapshot', () => {
    const store = createStore();
    expect(() => shareSnapshot(store, null)).toThrow('Invalid snapshot');
  });
});

describe('resolveShare', () => {
  it('returns record for valid token', () => {
    const store = createStore();
    const { token } = shareSnapshot(store, makeSnapshot());
    expect(resolveShare(store, token)).not.toBeNull();
  });

  it('returns null for unknown token', () => {
    const store = createStore();
    expect(resolveShare(store, 'bad-token')).toBeNull();
  });

  it('returns null for expired token', () => {
    const store = createStore();
    const past = new Date(Date.now() - 1000).toISOString();
    const { token } = shareSnapshot(store, makeSnapshot(), { expiresAt: past });
    expect(resolveShare(store, token)).toBeNull();
  });
});

describe('revokeShare', () => {
  it('removes a share', () => {
    const store = createStore();
    const { token } = shareSnapshot(store, makeSnapshot());
    expect(revokeShare(store, token)).toBe(true);
    expect(resolveShare(store, token)).toBeNull();
  });

  it('returns false for missing token', () => {
    const store = createStore();
    expect(revokeShare(store, 'nope')).toBe(false);
  });
});

describe('listShares', () => {
  it('lists all shares', () => {
    const store = createStore();
    shareSnapshot(store, makeSnapshot('a'));
    shareSnapshot(store, makeSnapshot('b'));
    expect(listShares(store)).toHaveLength(2);
  });

  it('filters by snapshotId', () => {
    const store = createStore();
    shareSnapshot(store, makeSnapshot('a'));
    shareSnapshot(store, makeSnapshot('b'));
    expect(listShares(store, 'a')).toHaveLength(1);
  });
});

describe('isExpired', () => {
  it('returns false when no expiry', () => {
    expect(isExpired({ expiresAt: null })).toBe(false);
  });

  it('returns true for past date', () => {
    expect(isExpired({ expiresAt: new Date(0).toISOString() })).toBe(true);
  });
});
