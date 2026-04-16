const { createTemplate, instantiateTemplate, listTemplates, deleteTemplate } = require('./template');

function makeSnapshot(overrides = {}) {
  return {
    id: 'snap_001',
    name: 'My Session',
    description: 'A test session',
    tabs: [
      { url: 'https://github.com', title: 'GitHub', pinned: true },
      { url: 'https://example.com', title: 'Example', pinned: false },
    ],
    tags: ['work', 'dev'],
    ...overrides,
  };
}

describe('createTemplate', () => {
  test('creates a template from a snapshot', () => {
    const snap = makeSnapshot();
    const tpl = createTemplate('My Template', snap);
    expect(tpl.name).toBe('My Template');
    expect(tpl.tabs).toHaveLength(2);
    expect(tpl.tabs[0].url).toBe('https://github.com');
    expect(tpl.tags).toEqual(['work', 'dev']);
    expect(tpl.id).toMatch(/^tpl_/);
    expect(tpl.createdAt).toBeDefined();
  });

  test('throws on invalid name', () => {
    expect(() => createTemplate('', makeSnapshot())).toThrow();
    expect(() => createTemplate(null, makeSnapshot())).toThrow();
  });

  test('throws on invalid snapshot', () => {
    expect(() => createTemplate('Tpl', null)).toThrow();
    expect(() => createTemplate('Tpl', { tabs: 'bad' })).toThrow();
  });

  test('handles snapshot with no tags', () => {
    const snap = makeSnapshot({ tags: undefined });
    const tpl = createTemplate('No Tags', snap);
    expect(tpl.tags).toEqual([]);
  });
});

describe('instantiateTemplate', () => {
  test('creates a snapshot from a template', () => {
    const tpl = createTemplate('Dev Env', makeSnapshot());
    const snap = instantiateTemplate(tpl);
    expect(snap.name).toBe('Dev Env');
    expect(snap.tabs).toHaveLength(2);
    expect(snap.fromTemplate).toBe(tpl.id);
    expect(snap.id).toMatch(/^snap_/);
  });

  test('applies overrides', () => {
    const tpl = createTemplate('Dev Env', makeSnapshot());
    const snap = instantiateTemplate(tpl, { name: 'Custom Name', tags: ['custom'] });
    expect(snap.name).toBe('Custom Name');
    expect(snap.tags).toEqual(['custom']);
  });

  test('throws on invalid template', () => {
    expect(() => instantiateTemplate(null)).toThrow();
    expect(() => instantiateTemplate({})).toThrow();
  });

  test('tabs are copies, not references', () => {
    const tpl = createTemplate('Dev Env', makeSnapshot());
    const snap = instantiateTemplate(tpl);
    snap.tabs[0].url = 'https://changed.com';
    expect(tpl.tabs[0].url).toBe('https://github.com');
  });
});

describe('listTemplates', () => {
  const tpl1 = { id: 'tpl_1', name: 'A', tags: ['work'] };
  const tpl2 = { id: 'tpl_2', name: 'B', tags: ['personal'] };
  const tpl3 = { id: 'tpl_3', name: 'C', tags: ['work', 'dev'] };

  test('lists all templates when no tag given', () => {
    expect(listTemplates([tpl1, tpl2, tpl3])).toHaveLength(3);
  });

  test('filters by tag', () => {
    const result = listTemplates([tpl1, tpl2, tpl3], 'work');
    expect(result).toHaveLength(2);
    expect(result.map(t => t.id)).toEqual(['tpl_1', 'tpl_3']);
  });

  test('returns empty array for non-array input', () => {
    expect(listTemplates(null)).toEqual([]);
  });
});

describe('deleteTemplate', () => {
  test('removes template by id', () => {
    const tpls = [{ id: 'tpl_1' }, { id: 'tpl_2' }];
    const result = deleteTemplate(tpls, 'tpl_1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('tpl_2');
  });

  test('returns same list if id not found', () => {
    const tpls = [{ id: 'tpl_1' }];
    expect(deleteTemplate(tpls, 'tpl_99')).toHaveLength(1);
  });

  test('handles non-array input', () => {
    expect(deleteTemplate(null, 'tpl_1')).toEqual([]);
  });
});
