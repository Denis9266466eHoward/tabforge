'use strict';

const {
  createStore,
  archiveSnapshot,
  unarchiveSnapshot,
  isArchived,
  listArchived,
  purgeArchive,
  ARCHIVE_KEY,
} = require('./archive');

module.exports = {
  createStore,
  archiveSnapshot,
  unarchiveSnapshot,
  isArchived,
  listArchived,
  purgeArchive,
  ARCHIVE_KEY,
};
