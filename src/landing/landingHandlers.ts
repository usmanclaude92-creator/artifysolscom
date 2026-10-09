/**
 * Request handlers for /lp/:slug, /lp-preview/:token and the no-JS form fallback POST /lp/:slug/submit. Framework-free: each
 * returns { status, headers, body } so api/index.ts only has to send it (and tests can call them directly).
 * Relative imports carry explicit .js extensions (the Vercel function runs as native ESM; see tests/vercelFunctionImports.test.ts).
 */
import { LANDING_SLUG_PATTERN, landingCsp, renderLandingHtml, renderMessagePage, safeHref, type LandingPageData } from './renderLandingHtml.js';

export interface LandingResponse { status: number; headers: Record<string, string>; body: string }
export interface LandingContext {
  baseUrl: string;
  /** Platform API base, e.g. https://cc.example.com/api/v1 (PLATFORM_API_BASE_URL). */
  apiBase: string | undefined;
  fetchImpl?: typeof fetch;
  clientIp?: string;
  referer?: string;
}

const CACHE_PUBLIC = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300';
const CACHE_NONE = 'no-store';
const PREVIEW_TOKEN = /^[A-Za-z0-9_-]{20,100}$/;
const SECURITY = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };

const html = (status: number, body: string, cache: string, extra: Record<string, string> = {}): LandingResponse => ({
  status, body, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': cache, ...SECURITY, ...extra },
});

const messagePage = (ctx: LandingContext, status: number, cache: string, heading: string, text: string, backHref?: string) =>
  html(status, renderMessagePage({ title: `${heading} | Artify Solutions`, heading, text, baseUrl: ctx.baseUrl, backHref }), cache, {
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Security-Policy': landingCsp(null),
  });

const notFound = (ctx: LandingContext) => messagePage(ctx, 404, CACHE_PUBLIC, 'Page not found', 'This page does not exist.');
const gone = (ctx: LandingContext) => messagePage(ctx, 410, CACHE_PUBLIC, 'This page is no longer available', 'The offer or campaign this page belonged to has ended.');
const unavailable = (ctx: LandingContext) => messagePage(ctx, 503, CACHE_NONE, 'Temporarily unavailable', 'Please try again in a moment.');

async function call(ctx: LandingContext, path: string, init?: RequestInit): Promise<{ status: number; json: any } | null> {
  if (!ctx.apiBase) return null;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 5000);
  try {
    const res = await (ctx.fetchImpl ?? fetch)(`${ctx.apiBase.replace(/\/+$/, '')}${path}`, { ...init, signal: ctl.signal });
    let json: any = null;
    try { json = await res.json(); } catch { /* non-JSON error body */ }
    return { status: res.status, json };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function pageResponse(ctx: LandingContext, page: LandingPageData, preview: boolean): LandingResponse {
  const body = renderLandingHtml({ ...page, preview }, { baseUrl: ctx.baseUrl, apiBase: ctx.apiBase ?? null });
  const extra: Record<string, string> = { 'Content-Security-Policy': landingCsp(ctx.apiBase ?? null) };
  if (preview || page.seo.noindex) extra['X-Robots-Tag'] = 'noindex, nofollow';
  if (preview) extra['Referrer-Policy'] = 'no-referrer';
  return html(200, body, preview ? CACHE_NONE : CACHE_PUBLIC, extra);
}

export async function handleLandingPage(slug: string, query: string, ctx: LandingContext): Promise<LandingResponse> {
  if (!LANDING_SLUG_PATTERN.test(slug) || slug.length > 80) return notFound(ctx);
  const r = await call(ctx, `/public/landing/${encodeURIComponent(slug)}`);
  if (!r) return unavailable(ctx); // never cached: an API outage must not turn into a cached error
  if (r.status === 410) return gone(ctx);
  if (r.status === 200 && r.json?.data?.redirect?.toPath) {
    const to = safeHref(r.json.data.redirect.toPath);
    if (to.startsWith('/lp/')) return { status: 301, headers: { Location: `${to}${query ? `?${query}` : ''}`, 'Cache-Control': CACHE_PUBLIC }, body: '' };
    return notFound(ctx);
  }
  if (r.status === 200 && r.json?.data?.page) return pageResponse(ctx, r.json.data.page as LandingPageData, false);
  if (r.status === 404) return notFound(ctx);
  return unavailable(ctx);
}

export async function handleLandingPreview(token: string, ctx: LandingContext): Promise<LandingResponse> {
  const priv = { 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' };
  if (!PREVIEW_TOKEN.test(token)) return { ...messagePage(ctx, 404, CACHE_NONE, 'Preview not found', 'This preview link is invalid or has expired.'), };
  const r = await call(ctx, `/public/landing-preview/${encodeURIComponent(token)}`);
  if (!r) return unavailable(ctx);
  if (r.status === 200 && r.json?.data?.page) {
    const res = pageResponse(ctx, r.json.data.page as LandingPageData, true);
    return { ...res, headers: { ...res.headers, ...priv } };
  }
  return messagePage(ctx, 404, CACHE_NONE, 'Preview not found', 'This preview link is invalid or has expired.');
}

const UTM_KEYS: Array<[string, string]> = [['utm_source', 'utmSource'], ['utm_medium', 'utmMedium'], ['utm_campaign', 'utmCampaign'], ['utm_term', 'utmTerm'], ['utm_content', 'utmContent']];

/** UTM parameters of the page the visitor came from (the Referer of a no-JS form post), or undefined. */
export function touchFromReferer(referer: string | undefined): Record<string, string> | undefined {
  if (!referer) return undefined;
  try {
    const u = new URL(referer);
    const t: Record<string, string> = {};
    for (const [q, k] of UTM_KEYS) { const v = u.searchParams.get(q); if (v) t[k] = v.slice(0, 200); }
    if (Object.keys(t).length === 0) return undefined;
    t.landingPath = u.pathname.slice(0, 500);
    return t;
  } catch { return undefined; }
}

/** No-JS fallback for the lead form (the JS-enhanced form posts straight to the API from the browser). */
export async function handleLandingSubmit(slug: string, form: Record<string, unknown>, ctx: LandingContext): Promise<LandingResponse> {
  if (!LANDING_SLUG_PATTERN.test(slug) || slug.length > 80) return notFound(ctx);
  const back = `/lp/${slug}`;
  const data: Record<string, string> = {};
  let honeypot: string | undefined;
  for (const [k, v] of Object.entries(form)) {
    if (typeof v !== 'string') continue;
    if (k === 'website') { honeypot = v; continue; }
    if (/^[a-z][a-z0-9_]{0,29}$/.test(k)) data[k] = v.slice(0, 5000);
  }
  const touch = touchFromReferer(ctx.referer);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (ctx.clientIp) headers['X-Forwarded-For'] = ctx.clientIp;
  const r = await call(ctx, `/public/landing/${encodeURIComponent(slug)}/submit`, {
    method: 'POST', headers, body: JSON.stringify({ data, ...(honeypot ? { website: honeypot } : {}), ...(touch ? { firstTouch: touch, lastTouch: touch } : {}) }),
  });
  if (!r) return unavailable(ctx);
  if (r.status === 201 || r.status === 200) {
    const redirect = r.json?.data?.redirectUrl;
    if (typeof redirect === 'string' && safeHref(redirect) !== '#') {
      return { status: 303, headers: { Location: safeHref(redirect), 'Cache-Control': CACHE_NONE }, body: '' };
    }
    return messagePage(ctx, 200, CACHE_NONE, 'Thank you', String(r.json?.data?.message ?? 'We received your message.'));
  }
  if (r.status === 429) return messagePage(ctx, 429, CACHE_NONE, 'Too many requests', 'Please wait a few minutes and try again.', back);
  if (r.status === 404 || r.status === 410) return gone(ctx);
  const msg = typeof r.json?.error?.message === 'string' ? r.json.error.message : 'Please check the form and try again.';
  return messagePage(ctx, 422, CACHE_NONE, 'We could not send your message', msg, back);
}
