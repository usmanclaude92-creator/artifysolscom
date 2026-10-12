import { describe, expect, it } from 'vitest';
import { mergeIndustries, BUILT_IN_INDUSTRIES } from '../src/lib/useIndustries';

describe('mergeIndustries', () => {
  it('falls back to the built-in list when the API returns nothing or fails', () => {
    expect(mergeIndustries(null)).toBe(BUILT_IN_INDUSTRIES);
    expect(mergeIndustries([])).toBe(BUILT_IN_INDUSTRIES);
  });

  it('uses the Control Center name, description and order, keeping blueprint content for known slugs', () => {
    const list = mergeIndustries([
      { slug: 'healthcare', name: 'Health & Care', description: 'Renamed in the CMS' },
      { slug: 'finance', name: 'Finance & Accounting', description: null },
    ]);
    expect(list.map((i) => i.id).slice(0, 2)).toEqual(['healthcare', 'finance']);
    expect(list[0]!.name).toBe('Health & Care');
    expect(list[0]!.tagline).toBe('Renamed in the CMS');
    expect(list[0]!.keyWorkflows.length).toBeGreaterThan(0);
    expect(list[0]!.icon).toBe('Stethoscope');
  });

  it('shows a newly created industry with no invented content', () => {
    const list = mergeIndustries([{ slug: 'aviation', name: 'Aviation', description: 'Fleet and crew planning' }]);
    const added = list.find((i) => i.id === 'aviation')!;
    expect(added.name).toBe('Aviation');
    expect(added.tagline).toBe('Fleet and crew planning');
    expect(added.coreAgents).toEqual([]);
    expect(added.keyWorkflows).toEqual([]);
    expect(added.metrics).toEqual([]);
  });

  it('drops an industry deleted in the Control Center but keeps the "And Beyond" call to action last', () => {
    const list = mergeIndustries([{ slug: 'finance', name: 'Finance & Accounting', description: null }]);
    expect(list.some((i) => i.id === 'healthcare')).toBe(false);
    expect(list[list.length - 1]!.id).toBe('custom-industry');
  });
});
