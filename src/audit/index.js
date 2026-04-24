'use strict';

const {
  createStore,
  recordAction,
  getAuditLog,
  filterByAction,
  clearAuditLog,
  summarizeActions,
} = require('./audit');

module.exports = {
  createStore,
  recordAction,
  getAuditLog,
  filterByAction,
  clearAuditLog,
  summarizeActions,
};
