# sort

Utilities for ordering snapshot collections.

## Functions

### `sortByDate(snapshots, direction?)`
Sort snapshots by `createdAt` timestamp.
- `direction`: `'asc'` | `'desc'` (default `'desc'`)

### `sortByName(snapshots, direction?)`
Sort snapshots alphabetically by `name`.
- `direction`: `'asc'` (default) | `'desc'`

### `sortByTabCount(snapshots, direction?)`
Sort snapshots by the number of tabs they contain.
- `direction`: `'asc'` | `'desc'` (default `'desc'`)

### `sortSnapshots(snapshots, field?, direction?)`
Generic dispatcher — choose a `field` and `direction`.

| field | default direction |
|-------|------------------|
| `date` (default) | `desc` |
| `name` | `asc` |
| `tabCount` | `desc` |

## Example

```js
const { sortSnapshots } = require('./src/sort');

const ordered = sortSnapshots(snapshots, 'name', 'asc');
```
