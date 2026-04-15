/**
 * Validate snapshot structure and tab data integrity.
 */

const REQUIRED_SNAPSHOT_FIELDS = ['id', 'name', 'tabs', 'createdAt'];
const REQUIRED_TAB_FIELDS = ['url', 'title'];

function validateTab(tab, index) {
  const errors = [];

  for (const field of REQUIRED_TAB_FIELDS) {
    if (tab[field] === undefined || tab[field] === null) {
      errors.push(`Tab[${index}] missing required field: "${field}"`);
    }
  }

  if (tab.url && typeof tab.url !== 'string') {
    errors.push(`Tab[${index}] "url" must be a string`);
  }

  if (tab.url && !isValidUrl(tab.url)) {
    errors.push(`Tab[${index}] "url" is not a valid URL: ${tab.url}`);
  }

  if (tab.title && typeof tab.title !== 'string') {
    errors.push(`Tab[${index}] "title" must be a string`);
  }

  return errors;
}

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function validateSnapshot(snapshot) {
  const errors = [];

  if (!snapshot || typeof snapshot !== 'object') {
    return { valid: false, errors: ['Snapshot must be a non-null object'] };
  }

  for (const field of REQUIRED_SNAPSHOT_FIELDS) {
    if (snapshot[field] === undefined || snapshot[field] === null) {
      errors.push(`Snapshot missing required field: "${field}"`);
    }
  }

  if (snapshot.id && typeof snapshot.id !== 'string') {
    errors.push('Snapshot "id" must be a string');
  }

  if (snapshot.name && typeof snapshot.name !== 'string') {
    errors.push('Snapshot "name" must be a string');
  }

  if (snapshot.tabs !== undefined) {
    if (!Array.isArray(snapshot.tabs)) {
      errors.push('Snapshot "tabs" must be an array');
    } else {
      snapshot.tabs.forEach((tab, i) => {
        errors.push(...validateTab(tab, i));
      });
    }
  }

  if (snapshot.createdAt && isNaN(Date.parse(snapshot.createdAt))) {
    errors.push('Snapshot "createdAt" is not a valid date string');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateSnapshot, validateTab, isValidUrl };
