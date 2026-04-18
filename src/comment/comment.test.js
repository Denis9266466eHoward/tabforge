const { createStore, addComment, getComments, removeComment, editComment, clearComments, countComments } = require('./comment');

let store;
beforeEach(() => { store = createStore(); });

describe('addComment', () => {
  test('adds a comment and returns it', () => {
    const c = addComment(store, 'snap-1', 'looks good', { author: 'alice' });
    expect(c.text).toBe('looks good');
    expect(c.author).toBe('alice');
    expect(c.snapshotId).toBe('snap-1');
    expect(c.id).toBeTruthy();
    expect(c.createdAt).toBeTruthy();
  });

  test('defaults author to anonymous', () => {
    const c = addComment(store, 'snap-1', 'hi');
    expect(c.author).toBe('anonymous');
  });

  test('throws on missing text', () => {
    expect(() => addComment(store, 'snap-1', '')).toThrow();
  });

  test('throws on missing snapshotId', () => {
    expect(() => addComment(store, '', 'hello')).toThrow();
  });
});

describe('getComments', () => {
  test('returns empty array when none exist', () => {
    expect(getComments(store, 'snap-x')).toEqual([]);
  });

  test('returns all comments for snapshot', () => {
    addComment(store, 'snap-1', 'first');
    addComment(store, 'snap-1', 'second');
    expect(getComments(store, 'snap-1')).toHaveLength(2);
  });

  test('does not leak between snapshots', () => {
    addComment(store, 'snap-1', 'only here');
    expect(getComments(store, 'snap-2')).toHaveLength(0);
  });
});

describe('removeComment', () => {
  test('removes by id and returns true', () => {
    const c = addComment(store, 'snap-1', 'bye');
    expect(removeComment(store, c.id)).toBe(true);
    expect(getComments(store, 'snap-1')).toHaveLength(0);
  });

  test('returns false when id not found', () => {
    expect(removeComment(store, 'ghost-id')).toBe(false);
  });
});

describe('editComment', () => {
  test('edits text and sets editedAt', () => {
    const c = addComment(store, 'snap-1', 'original');
    const updated = editComment(store, c.id, 'revised');
    expect(updated.text).toBe('revised');
    expect(updated.editedAt).toBeTruthy();
  });

  test('returns null for unknown id', () => {
    expect(editComment(store, 'nope', 'text')).toBeNull();
  });

  test('throws on empty newText', () => {
    const c = addComment(store, 'snap-1', 'hi');
    expect(() => editComment(store, c.id, '   ')).toThrow();
  });
});

describe('clearComments + countComments', () => {
  test('clears all comments for a snapshot', () => {
    addComment(store, 'snap-1', 'a');
    addComment(store, 'snap-1', 'b');
    clearComments(store, 'snap-1');
    expect(countComments(store, 'snap-1')).toBe(0);
  });

  test('countComments returns 0 for unknown snapshot', () => {
    expect(countComments(store, 'unknown')).toBe(0);
  });
});
