/**
 * search module — exposes search utilities for tabforge snapshots
 */

const { searchSnapshots, searchByName, searchByDateRange } = require('./search');

module.exports = {
  searchSnapshots,
  searchByName,
  searchByDateRange,
};
