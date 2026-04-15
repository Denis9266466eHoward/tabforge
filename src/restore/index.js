'use strict';

/**
 * Public API for the restore module.
 */

const {
  restoreSnapshot,
  restoreByTag,
  restorePinnedTabs,
} = require('./restore');

module.exports = {
  restoreSnapshot,
  restoreByTag,
  restorePinnedTabs,
};
