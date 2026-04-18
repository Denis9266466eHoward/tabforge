# comment

Attach freeform comments to snapshots. Useful for leaving notes about why a session was saved or flagging issues for teammates.

## API

### `createStore()`
Returns a new in-memory comment store.

### `addComment(store, snapshotId, text, options?)`
Adds a comment to the given snapshot. Options:
- `author` — string, defaults to `'anonymous'`

Returns the created comment object `{ id, snapshotId, text, author, createdAt }`.

### `getComments(store, snapshotId)`
Returns all comments for a snapshot (newest-last). Returns `[]` if none exist.

### `removeComment(store, commentId)`
Removes a comment by its id. Returns `true` if removed, `false` if not found.

### `editComment(store, commentId, newText)`
Updates the text of an existing comment and stamps `editedAt`. Returns the updated comment or `null`.

### `clearComments(store, snapshotId)`
Removes all comments for a snapshot.

### `countComments(store, snapshotId)`
Returns the number of comments on a snapshot.

## Example

```js
const { createStore, addComment, getComments } = require('./src/comment');
const store = createStore();
addComment(store, 'snap-abc', 'Ready for review', { author: 'bob' });
console.log(getComments(store, 'snap-abc'));
```
