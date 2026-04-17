const {
  createStore,
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmark,
  listBookmarks,
  updateNote,
  filterBookmarked,
} = require('./bookmark');

function makeSnapshot(id, name = 'Snap') {
  return { id, name, tabs: [], createdAt: new Date().toISOString() };
}

describe('bookmark', () => {
  let store;
  beforeEach(() => { store = createStore(); });

  test('addBookmark stores entry with note', () => {
    const bm = addBookmark(store, 'snap-1', 'important');
    expect(bm.snapshotId).toBe('snap-1');
    expect(bm.note).toBe('important');
    expect(bm.bookmarkedAt).toBeDefined();
  });

  test('addBookmark defaults note to empty string', () => {
    const bm = addBookmark(store, 'snap-2');
    expect(bm.note).toBe('');
  });

  test('addBookmark throws without snapshotId', () => {
    expect(() => addBookmark(store, '')).toThrow('snapshotId is required');
  });

  test('isBookmarked returns true after adding', () => {
    addBookmark(store, 'snap-1');
    expect(isBookmarked(store, 'snap-1')).toBe(true);
  });

  test('isBookmarked returns false for unknown id', () => {
    expect(isBookmarked(store, 'nope')).toBe(false);
  });

  test('removeBookmark removes entry and returns true', () => {
    addBookmark(store, 'snap-1');
    expect(removeBookmark(store, 'snap-1')).toBe(true);
    expect(isBookmarked(store, 'snap-1')).toBe(false);
  });

  test('removeBookmark returns false when not bookmarked', () => {
    expect(removeBookmark(store, 'ghost')).toBe(false);
  });

  test('getBookmark returns entry or null', () => {
    addBookmark(store, 'snap-1', 'hi');
    expect(getBookmark(store, 'snap-1').note).toBe('hi');
    expect(getBookmark(store, 'missing')).toBeNull();
  });

  test('listBookmarks returns all entries', () => {
    addBookmark(store, 'a');
    addBookmark(store, 'b');
    expect(listBookmarks(store)).toHaveLength(2);
  });

  test('updateNote changes the note', () => {
    addBookmark(store, 'snap-1', 'old');
    const updated = updateNote(store, 'snap-1', 'new');
    expect(updated.note).toBe('new');
  });

  test('updateNote throws if not bookmarked', () => {
    expect(() => updateNote(store, 'x', 'y')).toThrow("Snapshot 'x' is not bookmarked");
  });

  test('filterBookmarked returns only bookmarked snapshots', () => {
    addBookmark(store, 'a');
    const snaps = [makeSnapshot('a'), makeSnapshot('b'), makeSnapshot('c')];
    const result = filterBookmarked(store, snaps);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a');
  });
});
