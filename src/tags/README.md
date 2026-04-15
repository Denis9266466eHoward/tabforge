# Tags Module

Provides tag-based labeling and filtering for tabforge snapshots.

## API

### `addTags(snapshot, tags)`
Returns a new snapshot with the given tags added. Deduplicates and trims whitespace.

```js
const { addTags } = require('./src/tags');
const updated = addTags(snapshot, ['work', 'frontend']);
```

### `removeTags(snapshot, tags)`
Returns a new snapshot with the specified tags removed.

```js
const updated = removeTags(snapshot, ['debug']);
```

### `filterByTag(snapshots, tag)`
Filters an array of snapshots, returning only those that include the given tag.

```js
const workSnaps = filterByTag(allSnapshots, 'work');
```

### `listAllTags(snapshots)`
Returns a sorted array of all unique tags found across a list of snapshots.

```js
const tags = listAllTags(allSnapshots);
// => ['backend', 'frontend', 'personal', 'work']
```

## Notes
- All functions are **pure** — they do not mutate the input snapshot.
- Tags are stored as a `tags` array on each snapshot object.
- Use alongside `saveSnapshotToDisk` / `readSnapshotFromDisk` from the storage module to persist tag changes.
