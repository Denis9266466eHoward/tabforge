# Snapshot Workflow

The `snapshot.workflow` module composes the core snapshot lifecycle into
high-level helpers that validate, persist, and record every operation.

## API

### `createAndSave(name, tabs, options?)`

Creates a snapshot, validates it, writes it to disk, and records both a
history event and an audit log entry.

Returns `{ snapshot, errors }`. If validation fails, `snapshot` is `null`
and `errors` contains the list of messages.

### `loadAndTrack(id)`

Reads a snapshot from disk by ID, records a `loaded` history event and
audit entry, then returns the hydrated snapshot object. Returns `null` if
the snapshot does not exist.

### `removeAndRecord(id, deleteFn)`

Calls `deleteFn(id)` (typically `deleteSnapshotFromDisk`) and, on success,
records a `deleted` history event and audit entry. Returns `true`/`false`.

## CLI

```bash
# create a new snapshot
node src/snapshot/snapshot.workflow.cli.js create <name> <url1,url2,...>

# load and print a snapshot
node src/snapshot/snapshot.workflow.cli.js load <id>

# remove a snapshot
node src/snapshot/snapshot.workflow.cli.js remove <id>
```

## Design notes

- Validation is always enforced — invalid snapshots are never persisted.
- History and audit are recorded for every mutation so the full lifecycle
  is traceable without extra boilerplate in callers.
- `deleteFn` is injected so callers (and tests) can swap the storage
  implementation without monkey-patching.
