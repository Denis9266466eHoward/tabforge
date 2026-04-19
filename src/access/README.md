# access

Role-based access control for snapshots.

## Roles

- `viewer` — read-only
- `editor` — can modify
- `owner` — full control

Roles are hierarchical: `owner > editor > viewer`.

## API

### `createStore()`
Returns a new access store.

### `setAccess(store, snapshotId, user, role)`
Assigns a role to a user for a snapshot.

### `getAccess(store, snapshotId, user)`
Returns the role for a user, or `null`.

### `removeAccess(store, snapshotId, user)`
Removes a user's access. Returns `true` if removed.

### `hasAccess(store, snapshotId, user, role)`
Returns `true` if the user has at least the given role.

### `listAccess(store, snapshotId)`
Returns all user→role mappings for a snapshot.

### `filterByAccess(store, snapshots, user, role)`
Filters snapshots to those accessible by the user at the given role level.
