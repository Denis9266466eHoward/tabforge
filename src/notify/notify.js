/**
 * Notification module for tabforge
 * Handles in-process event notifications for snapshot lifecycle events
 */

const listeners = new Map();

const EVENTS = {
  SNAPSHOT_CREATED: 'snapshot:created',
  SNAPSHOT_DELETED: 'snapshot:deleted',
  SNAPSHOT_RESTORED: 'snapshot:restored',
  SNAPSHOT_EXPORTED: 'snapshot:exported',
  SNAPSHOT_IMPORTED: 'snapshot:imported',
  SCHEDULE_TRIGGERED: 'schedule:triggered',
};

/**
 * Subscribe to a notification event
 * @param {string} event - event name
 * @param {Function} handler - callback(payload)
 * @returns {Function} unsubscribe function
 */
function subscribe(event, handler) {
  if (typeof handler !== 'function') {
    throw new TypeError('handler must be a function');
  }
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(handler);
  return () => unsubscribe(event, handler);
}

/**
 * Unsubscribe a handler from an event
 * @param {string} event
 * @param {Function} handler
 */
function unsubscribe(event, handler) {
  if (listeners.has(event)) {
    listeners.get(event).delete(handler);
  }
}

/**
 * Emit an event to all subscribers
 * @param {string} event
 * @param {object} payload
 */
function emit(event, payload = {}) {
  if (!listeners.has(event)) return;
  for (const handler of listeners.get(event)) {
    try {
      handler({ event, ...payload, timestamp: new Date().toISOString() });
    } catch (err) {
      // individual handler errors should not break other handlers
      console.error(`[tabforge:notify] handler error for "${event}":`, err.message);
    }
  }
}

/**
 * Remove all listeners (useful for test teardown)
 */
function clearAll() {
  listeners.clear();
}

module.exports = { subscribe, unsubscribe, emit, clearAll, EVENTS };
