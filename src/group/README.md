# group

Organize snapshots into named groups for easier management.

## API

### `createGroup(name, snapshotIds?)`
Creates a new group with a unique ID and optional initial snapshot IDs. Duplicate IDs are removed.

### `addToGroup(group, snapshotIds)`
Returns a new group with the given snapshot IDs added (no duplicates).

### `removeFromGroup(group, snapshotIds)`
Returns a new group with the specified snapshot IDs removed.

### `groupsForSnapshot(groups, snapshotId)`
Filters a list of groups to find all that contain a given snapshot ID.

### `renameGroup(group, newName)`
Returns a new group object with an updated name.

### `listGroupedSnapshotIds(groups)`
Returns all unique snapshot IDs referenced across all provided groups.

## Example

```js
const { createGroup, addToGroup } = require('./src/group');

let work = createGroup('work');
work = addToGroup(work, ['snap_abc', 'snap_def']);
console.log(work.snapshotIds); // ['snap_abc', 'snap_def']
```
