/**
 * Industries come from the Control Center (GET /public/industries), so adding, renaming, reordering or deleting one there is
 * reflected on the site. The rich blueprint content (agents, workflows, systems, metrics, icon) only exists for the built-in
 * sectors and is matched by slug; an industry created later shows its name and description and hides the sections it has no
 * content for. If the API is unreachable or returns nothing, the built-in list is shown so the page is never empty.
 */
import { useEffect, useState } from 'react';
import { publicApi, type PublicIndustry } from './publicApi';
import { INDUSTRIES_DATA } from '../data/solutionsData';
import type { Industry } from '../types';

/** The "And Beyond..." card is a call to action for sectors not listed, not a real industry record. */
const BEYOND_ID = 'custom-industry';

export const BUILT_IN_INDUSTRIES: Industry[] = INDUSTRIES_DATA;

export function mergeIndustries(fromApi: PublicIndustry[] | null | undefined): Industry[] {
  if (!fromApi || fromApi.length === 0) return BUILT_IN_INDUSTRIES;
  const builtIn = new Map(BUILT_IN_INDUSTRIES.map((i) => [i.id, i]));
  const merged: Industry[] = fromApi.map((row) => {
    const known = builtIn.get(row.slug);
    return {
      id: row.slug,
      name: row.name,
      icon: known?.icon ?? 'Sparkles',
      tagline: row.description ?? known?.tagline ?? '',
      description: known?.description ?? '',
      coreAgents: known?.coreAgents ?? [],
      keyWorkflows: known?.keyWorkflows ?? [],
      connectedSystems: known?.connectedSystems ?? [],
      metrics: known?.metrics ?? [],
    };
  });
  const beyond = builtIn.get(BEYOND_ID);
  return beyond && !merged.some((i) => i.id === BEYOND_ID) ? [...merged, beyond] : merged;
}

let inflight: Promise<Industry[]> | null = null;

function loadIndustries(): Promise<Industry[]> {
  if (!inflight) {
    inflight = publicApi
      .listIndustries()
      .then(mergeIndustries)
      .catch(() => BUILT_IN_INDUSTRIES)
      .finally(() => {
        // Keep the result for this page view only; the next visit asks again so Control Center edits show up.
        setTimeout(() => { inflight = null; }, 60_000);
      });
  }
  return inflight;
}

export function useIndustries(): { industries: Industry[]; loading: boolean } {
  const [industries, setIndustries] = useState<Industry[]>(BUILT_IN_INDUSTRIES);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    loadIndustries().then((list) => {
      if (!cancelled) { setIndustries(list); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);
  return { industries, loading };
}
