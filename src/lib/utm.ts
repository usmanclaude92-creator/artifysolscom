/** Phase 12 — shared website attribution capture (UTM params + landing page), reused by every public lead-capture entry point (ContactAndBrief.tsx, PublicForm.tsx) so attribution is consistent across the site. */
export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export function readUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const out: UtmParams = {};
  const mapping: Record<string, keyof UtmParams> = {
    utm_source: 'utmSource',
    utm_medium: 'utmMedium',
    utm_campaign: 'utmCampaign',
    utm_term: 'utmTerm',
    utm_content: 'utmContent',
  };
  for (const [queryKey, payloadKey] of Object.entries(mapping)) {
    const value = params.get(queryKey);
    if (value) out[payloadKey] = value;
  }
  return out;
}

export function getLandingPagePath(): string | undefined {
  return typeof window !== 'undefined' ? window.location.pathname : undefined;
}
