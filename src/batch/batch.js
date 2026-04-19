// batch operations on multiple snapshots

/**
 * Apply a transform function to each snapshot in a list.
 * Returns { results, errors } where results maps id -> transformed snapshot.
 */
function batchTransform(snapshots, transformFn) {
  const results = {};
  const errors = {};

  for (const snapshot of snapshots) {
    try {
      results[snapshot.id] = transformFn(snapshot);
    } catch (err) {
      errors[snapshot.id] = err.message;
    }
  }

  return { results, errors };
}

/**
 * Delete all snapshots whose ids are in the given list.
 * Returns { deleted, failed }.
 */
function batchDelete(snapshots, ids) {
  const idSet = new Set(ids);
  const deleted = [];
  const failed = [];

  for (const id of ids) {
    const found = snapshots.find(s => s.id === id);
    if (found) {
      deleted.push(id);
    } else {
      failed.push(id);
    }
  }

  const remaining = snapshots.filter(s => !idSet.has(s.id));
  return { remaining, deleted, failed };
}

/**
 * Tag all snapshots in the list with the given tags.
 */
function batchTag(snapshots, tags) {
  return snapshots.map(snapshot => ({
    ...snapshot,
    tags: Array.from(new Set([...(snapshot.tags || []), ...tags])),
  }));
}

/**
 * Filter snapshots by a predicate, returning matched and unmatched.
 */
function batchFilter(snapshots, predicateFn) {
  const matched = [];
  const unmatched = [];
  for (const snapshot of snapshots) {
    (predicateFn(snapshot) ? matched : unmatched).push(snapshot);
  }
  return { matched, unmatched };
}

module.exports = { batchTransform, batchDelete, batchTag, batchFilter };
