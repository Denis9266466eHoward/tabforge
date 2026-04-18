// comment.js — attach threaded comments to snapshots

function createStore() {
  return { comments: {} };
}

function addComment(store, snapshotId, text, { author = 'anonymous' } = {}) {
  if (!snapshotId || typeof text !== 'string' || !text.trim()) {
    throw new Error('snapshotId and non-empty text are required');
  }
  if (!store.comments[snapshotId]) {
    store.comments[snapshotId] = [];
  }
  const comment = {
    id: `${snapshotId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    snapshotId,
    text: text.trim(),
    author,
    createdAt: new Date().toISOString(),
  };
  store.comments[snapshotId].push(comment);
  return comment;
}

function getComments(store, snapshotId) {
  return store.comments[snapshotId] ? [...store.comments[snapshotId]] : [];
}

function removeComment(store, commentId) {
  for (const snapshotId of Object.keys(store.comments)) {
    const before = store.comments[snapshotId].length;
    store.comments[snapshotId] = store.comments[snapshotId].filter(c => c.id !== commentId);
    if (store.comments[snapshotId].length < before) return true;
  }
  return false;
}

function editComment(store, commentId, newText) {
  if (typeof newText !== 'string' || !newText.trim()) {
    throw new Error('newText must be a non-empty string');
  }
  for (const snapshotId of Object.keys(store.comments)) {
    const comment = store.comments[snapshotId].find(c => c.id === commentId);
    if (comment) {
      comment.text = newText.trim();
      comment.editedAt = new Date().toISOString();
      return comment;
    }
  }
  return null;
}

function clearComments(store, snapshotId) {
  store.comments[snapshotId] = [];
}

function countComments(store, snapshotId) {
  return store.comments[snapshotId] ? store.comments[snapshotId].length : 0;
}

module.exports = { createStore, addComment, getComments, removeComment, editComment, clearComments, countComments };
