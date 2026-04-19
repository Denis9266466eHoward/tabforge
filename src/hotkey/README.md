# hotkey

Assign keyboard shortcut strings to snapshot IDs for quick access.

## API

### `createStore()`
Returns a new hotkey store.

### `setHotkey(store, key, snapshotId)`
Assigns `key` (e.g. `"ctrl+1"`) to `snapshotId`. Throws if the key is already taken by a different snapshot.

### `removeHotkey(store, key)`
Removes the hotkey assignment for `key`.

### `getHotkey(store, snapshotId)`
Returns the hotkey key assigned to `snapshotId`, or `null`.

### `getSnapshotForHotkey(store, key)`
Returns the `snapshotId` assigned to `key`, or `null`.

### `listHotkeys(store)`
Returns an array of `{ key, snapshotId }` entries.

### `clearHotkeysForSnapshot(store, snapshotId)`
Removes all hotkeys pointing to `snapshotId`.

## CLI

```bash
node hotkey.cli.js set ctrl+1 my-snapshot
node hotkey.cli.js list
node hotkey.cli.js resolve ctrl+1
node hotkey.cli.js remove ctrl+1
```
