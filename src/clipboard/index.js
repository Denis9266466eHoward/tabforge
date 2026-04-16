/**
 * clipboard module — copy/paste snapshots as portable JSON strings.
 *
 * Usage:
 *   const { copySnapshot, pasteSnapshot, isClipboardPayload } = require('./src/clipboard');
 *
 *   const text = copySnapshot(snapshot);   // copy to share/store
 *   const snap  = pasteSnapshot(text);     // restore from text
 *   isClipboardPayload(text);              // validate before pasting
 */

const { copySnapshot, pasteSnapshot, isClipboardPayload } = require('./clipboard');

module.exports = { copySnapshot, pasteSnapshot, isClipboardPayload };
