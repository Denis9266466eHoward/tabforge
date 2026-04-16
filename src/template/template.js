/**
 * template.js — snapshot templates for quick session creation
 */

/**
 * Create a named template from an existing snapshot
 * @param {string} name
 * @param {object} snapshot
 * @returns {object} template
 */
function createTemplate(name, snapshot) {
  if (!name || typeof name !== 'string') {
    throw new Error('Template name must be a non-empty string');
  }
  if (!snapshot || !Array.isArray(snapshot.tabs)) {
    throw new Error('Invalid snapshot: must have a tabs array');
  }
  return {
    id: `tpl_${Date.now()}`,
    name: name.trim(),
    description: snapshot.description || '',
    tabs: snapshot.tabs.map(tab => ({
      url: tab.url,
      title: tab.title || '',
      pinned: tab.pinned || false,
    })),
    tags: snapshot.tags ? [...snapshot.tags] : [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Instantiate a snapshot from a template
 * @param {object} template
 * @param {object} [overrides]
 * @returns {object} snapshot
 */
function instantiateTemplate(template, overrides = {}) {
  if (!template || !template.id) {
    throw new Error('Invalid template');
  }
  return {
    id: `snap_${Date.now()}`,
    name: overrides.name || template.name,
    description: overrides.description || template.description,
    tabs: template.tabs.map(tab => ({ ...tab })),
    tags: overrides.tags || [...template.tags],
    fromTemplate: template.id,
    createdAt: new Date().toISOString(),
  };
}

/**
 * List all templates, optionally filtered by tag
 * @param {object[]} templates
 * @param {string} [tag]
 * @returns {object[]}
 */
function listTemplates(templates, tag) {
  if (!Array.isArray(templates)) return [];
  if (!tag) return [...templates];
  return templates.filter(t => Array.isArray(t.tags) && t.tags.includes(tag));
}

/**
 * Delete a template by id
 * @param {object[]} templates
 * @param {string} id
 * @returns {object[]}
 */
function deleteTemplate(templates, id) {
  if (!Array.isArray(templates)) return [];
  return templates.filter(t => t.id !== id);
}

module.exports = { createTemplate, instantiateTemplate, listTemplates, deleteTemplate };
