# restore

The `restore` module provides utilities for reopening browser sessions from saved snapshots.

## Functions

### `restoreSnapshot(snapshotId)`

Loads a snapshot by ID and returns all of its tabs along with a `restoredAt` timestamp.

```js
const { restoreSnapshot } = require('./restore');
const result = restoreSnapshot('snap-abc123');
console.log(result.tabs);        // array of tab objects
console.log(result.restoredAt); // ISO timestamp
```

### `restoreByTag(snapshotId, tag)`

Restores only the tabs that include a specific tag.

```js
const result = restoreByTag('snap-abc123', 'work');
// result.tabs contains only tabs tagged 'work'
```

### `restorePinnedTabs(snapshotId)`

Restores only the tabs that were marked as pinned in the snapshot.

```js
const result = restorePinnedTabs('snap-abc123');
// result.tabs contains only pinned tabs
```

## Return Shape

All three functions return an object with:

| Field        | Type     | Description                          |
|--------------|----------|--------------------------------------|
| `tabs`       | `Array`  | Tab objects to reopen                |
| `restoredAt` | `string` | ISO 8601 timestamp of restore action |
