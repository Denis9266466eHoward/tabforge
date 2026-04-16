/**
 * Public API for the sort module.
 */
const { sortByDate, sortByName, sortByTabCount, sortSnapshots } = require('./sort');

module.exports = {
  sortByDate,
  sortByName,
  sortByTabCount,
  sortSnapshots,
};
