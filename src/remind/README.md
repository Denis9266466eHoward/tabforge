# remind

Schedule one-time or recurring reminders attached to snapshots.

## API

### `createStore()`
Returns a fresh in-memory reminder store.

### `setReminder(store, snapshotId, { message, remindAt, repeat? })`
Creates a new reminder for the given snapshot.
- `remindAt` — a `Date` object for when the reminder fires.
- `repeat` — optional `'daily'` or `'weekly'` for recurring reminders.

### `getDueReminders(store, now?)`
Returns all non-dismissed reminders whose `remindAt` is ≤ `now` (defaults to current time).

### `dismissReminder(store, reminderId)`
Dismisses a one-time reminder. For repeating reminders, advances `remindAt` to the next occurrence instead.

### `removeReminder(store, reminderId)`
Permanently deletes a reminder from the store.

### `listReminders(store, snapshotId?)`
Lists all reminders, optionally filtered to a specific snapshot.

## CLI

```bash
# Set a reminder
node remind.cli.js set <snapshotId> "Review this" 2025-09-01T09:00:00Z daily

# Show due reminders
node remind.cli.js due

# Dismiss a reminder
node remind.cli.js dismiss <reminderId>

# List all reminders for a snapshot
node remind.cli.js list <snapshotId>
```
