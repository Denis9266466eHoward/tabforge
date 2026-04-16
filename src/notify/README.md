# `src/notify` — In-process Event Notifications

The `notify` module provides a lightweight pub/sub system for tabforge lifecycle events. Other modules (snapshot, restore, export, schedule, etc.) can `emit` events, and any part of the application can `subscribe` to react to them.

## Events

| Constant | String value |
|---|---|
| `EVENTS.SNAPSHOT_CREATED` | `snapshot:created` |
| `EVENTS.SNAPSHOT_DELETED` | `snapshot:deleted` |
| `EVENTS.SNAPSHOT_RESTORED` | `snapshot:restored` |
| `EVENTS.SNAPSHOT_EXPORTED` | `snapshot:exported` |
| `EVENTS.SNAPSHOT_IMPORTED` | `snapshot:imported` |
| `EVENTS.SCHEDULE_TRIGGERED` | `schedule:triggered` |

## API

### `subscribe(event, handler) → unsubscribeFn`

Register a handler for a named event. Returns a function that removes the handler when called.

```js
const { subscribe, EVENTS } = require('./notify');
const unsub = subscribe(EVENTS.SNAPSHOT_CREATED, ({ snapshotId, timestamp }) => {
  console.log(`New snapshot ${snapshotId} at ${timestamp}`);
});
// later...
unsub();
```

### `emit(event, payload)`

Broadcast an event to all subscribers. Errors in individual handlers are caught and logged so they do not block other handlers.

### `unsubscribe(event, handler)`

Manually remove a specific handler.

### `clearAll()`

Remove every listener — useful in test teardown.
