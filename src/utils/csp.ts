import { createHash } from 'node:crypto';

/**
 * Content-Security-Policy (Report-Only) for the SPA shell. The allow-list is the set of origins the site actually
 * uses (see docs in the Task 7 proposal); inline script/handler hashes are computed from the real shell at request
 * time, so editing the inline theme script or the stylesheet onload handler can never silently break the policy.
 */
export const CSP_REPORT_PATH = '/api/csp-report';

const API_ORIGIN = 'https://cc.artifysols.com';
const MEDIA_ORIGIN = 'https://cfkymotcnccgvkpmcevp.supabase.co';
const SAMPLE_IMAGE_ORIGIN = 'https://images.unsplash.com';
const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com';

const sha256 = (s: string) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;

/** Hashes of the inline <script> bodies (not JSON-LD data blocks) and of inline event-handler attributes in `html`. */
export function inlineHashes(html: string): { scripts: string[]; handlers: string[] } {
  const scripts = new Set<string>();
  for (const m of html.matchAll(/<script\b(?![^>]*\ssrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)) {
    if (m[1]!.trim()) scripts.add(sha256(m[1]!));
  }
  const handlers = new Set<string>();
  for (const m of html.matchAll(/\son[a-z]+="([^"]*)"/g)) handlers.add(sha256(m[1]!));
  return { scripts: [...scripts], handlers: [...handlers] };
}

export function buildCspReportOnly(html: string, apiOrigin: string = API_ORIGIN): string {
  const { scripts, handlers } = inlineHashes(html);
  const scriptSrc = ["'self'", ...scripts, ...(handlers.length ? ["'unsafe-hashes'", ...handlers] : []), TURNSTILE_ORIGIN];
  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${MEDIA_ORIGIN} ${SAMPLE_IMAGE_ORIGIN}`,
    "font-src 'self'",
    `connect-src 'self' ${apiOrigin} ${TURNSTILE_ORIGIN}`,
    `frame-src ${TURNSTILE_ORIGIN}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    `report-uri ${CSP_REPORT_PATH}`,
  ].join('; ');
}

/** One log-friendly record from either report format (legacy `csp-report` object or Reporting API array). */
export function summarizeCspReports(body: unknown): Array<Record<string, string | number | undefined>> {
  const items: unknown[] = Array.isArray(body) ? body : [body];
  const out: Array<Record<string, string | number | undefined>> = [];
  for (const item of items.slice(0, 10)) {
    const r = (item as { body?: unknown; 'csp-report'?: unknown } | null) ?? {};
    const rep = (r['csp-report'] ?? r.body ?? r) as Record<string, unknown>;
    const s = (v: unknown, n = 200) => (typeof v === 'string' ? v.slice(0, n) : undefined);
    out.push({
      directive: s(rep['effectiveDirective'] ?? rep['effective-directive'] ?? rep['violated-directive']),
      blocked: s(rep['blockedURL'] ?? rep['blocked-uri']),
      document: s(rep['documentURL'] ?? rep['document-uri']),
      source: s(rep['sourceFile'] ?? rep['source-file']),
      line: typeof rep['lineNumber'] === 'number' ? rep['lineNumber'] : typeof rep['line-number'] === 'number' ? (rep['line-number'] as number) : undefined,
      sample: s(rep['sample'] ?? rep['script-sample'], 100),
    });
  }
  return out;
}
