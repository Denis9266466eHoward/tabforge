/**
 * template/index.js — public API for the template module
 */

const {
  createTemplate,
  instantiateTemplate,
  listTemplates,
  deleteTemplate,
} = require('./template');

module.exports = {
  createTemplate,
  instantiateTemplate,
  listTemplates,
  deleteTemplate,
};
