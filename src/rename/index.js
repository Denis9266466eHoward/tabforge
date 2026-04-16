/**
 * rename module public API
 */
const { renameSnapshot, bulkRename, buildRenameRecord } = require('./rename');

module.exports = {
  renameSnapshot,
  bulkRename,
  buildRenameRecord,
};
