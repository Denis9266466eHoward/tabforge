# snapshot

Core module for creating and loading browser session snapshots.

## API

### `createSnapshot({ name, tabs })`

Creates a new snapshot object with a generated `id` and `createdAt` timestamp.

```js
const { createSnapshot } = require('./snapshot');

const snap = createSnapshot({
  name: 'my-dev-session',
  tabs: [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://localhost:3000', title: 'Dev Server' }
  ]
});
```

### `loadSnapshot(raw)`

Loads and validates a raw snapshot object (e.g. from disk). Returns the snapshot or throws if invalid.

```js
const { loadSnapshot } = require('./snapshot');

const snap = loadSnapshot(rawData);
```

## CLI

The snapshot CLI supports basic snapshot management:

```bash
# Create a snapshot
node snapshot.cli.js create --name my-session --tabs '[{"url":"https://github.com"}]'

# List all snapshot IDs
node snapshot.cli.js list

# Show a snapshot by ID
node snapshot.cli.js show <id>

# Delete a snapshot
node snapshot.cli.js delete <id>
```

## Data Shape

```json
{
  "id": "snap-<uuid>",
  "name": "my-dev-session",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "tabs": [
    { "url": "https://github.com", "title": "GitHub" }
  ]
}
```
