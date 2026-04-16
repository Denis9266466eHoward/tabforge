# archive

Move snapshots into a cold archive and restore them later.

## API

### `createStore()`
Returns a fresh archive store.

### `archiveSnapshot(store, snapshot)`
Moves a snapshot into the archive. Throws if already archived.

### `unarchiveSnapshot(store, snapshotId)`
Removes the snapshot from the archive and returns it. Throws if not found.

### `isArchived(store, snapshotId)`
Returns `true` if the snapshot is currently archived.

### `listArchived(store)`
Returns all archived snapshots, each with an extra `archivedAt` timestamp.

### `purgeArchive(store)`
Permanently removes all entries from the archive.

## CLI

```bash
node src/archive/archive.cli.js archive <id> [name]
node src/archive/archive.cli.js unarchive <id>
node src/archive/archive.cli.js list
node src/archive/archive.cli.js purge
```
