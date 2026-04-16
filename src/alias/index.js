/**
 * alias module — human-friendly aliases for snapshot IDs
 *
 * Usage:
 *   const { setAlias, resolveAlias, removeAlias, listAliases } = require('./src/alias');
 *
 *   setAlias('work', 'snap-abc123');   // bind alias
 *   resolveAlias('work');              // => 'snap-abc123'
 *   listAliases();                     // => [{ alias, snapshotId }, ...]
 *   removeAlias('work');               // => true
 */

const {
  setAlias,
  resolveAlias,
  removeAlias,
  listAliases,
  aliasesForSnapshot,
  clearAliases,
} = require('./alias');

module.exports = {
  setAlias,
  resolveAlias,
  removeAlias,
  listAliases,
  aliasesForSnapshot,
  clearAliases,
};
