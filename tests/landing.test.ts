/**
 * Step 12 — marketing landing pages on the public site: escaping, link/image safety, status handling (200/301/404/410/503),
 * preview privacy, no-JS form fallback, CSP, and sitemap inclusion (unchanged when no landing page is published).
 */
// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { esc, safeHref, renderLandingHtml, landingCsp, type LandingPageData } from '../src/landing/renderLandingHtml';
import { handleLandingPage, handleLandingPreview, handleLandingSubmit, touchFromReferer } from '../src/landing/landingHandlers';
import { getSitemapUrlList } from '../src/utils/sitemap';

const MEDIA_ID = '4f1c2b1e-6f0b-4b5a-9a63-0d4b0f6a9a11';
const XSS = '<script>alert(1)</script>"\'&';

function page(over: Partial<LandingPageData> = {}): LandingPageData {
  return {
    slug: 'spring-sale', title: 'Spring', updatedAt: '2026-10-01T00:00:00.000Z', preview: false,
    seo: { title: `Spring ${XSS}`, description: `Desc ${XSS}`, noindex: false, ogImageUrl: null },
    media: { [MEDIA_ID]: { url: 'https://cdn.example.com/hero.jpg', alt: 'A hero', width: 1200, height: 600 } },
    blocks: [
      { id: 'hero', type: 'lp_hero', props: { eyebrow: XSS, headline: `Headline ${XSS}`, subheadline: XSS, primaryCta: { label: XSS, href: 'javascript:alert(1)' }, secondaryCta: { label: 'Docs', href: 'https://example.com/docs' }, image: { mediaId: MEDIA_ID, alt: `Alt ${XSS}` } } },
      { id: 'ben', type: 'lp_benefits', props: { heading: 'Why', items: [{ title: XSS, text: XSS }, { title: 'b', text: 'b' }] } },
      { id: 'feat', type: 'lp_features', props: { heading: 'Features', items: [{ title: 'f', text: 'f', image: { mediaId: 'missing', alt: 'x' } }] } },
      { id: 'tes', type: 'lp_testimonials', props: { heading: 'Quotes', items: [{ quote: XSS, authorName: XSS, company: XSS }] } },
      { id: 'price', type: 'lp_pricing', props: { heading: 'Pricing', plans: [{ name: XSS, price: '10', features: [XSS], cta: { label: 'Buy', href: 'data:text/html,x' }, highlighted: true }] } },
      { id: 'faq', type: 'lp_faq', props: { heading: 'FAQ', items: [{ question: XSS, answer: XSS }] } },
      { id: 'cta', type: 'lp_cta', props: { heading: 'Go', cta: { label: 'Go', href: '#contact' } } },
      { id: 'form', type: 'lp_form', props: {
        heading: 'Contact', fields: [{ key: 'name', label: XSS, type: 'text', required: true }, { key: 'email', label: 'Email', type: 'email', required: true }, { key: 'topic', label: 'Topic', type: 'select', required: false, options: [{ value: XSS, label: XSS }] }],
        consent: { enabled: true, text: XSS, privacyUrl: '/privacy' }, submitLabel: 'Send', successMessage: 'ok' } },
      { id: 'foot', type: 'lp_footer', props: { text: XSS, links: [{ label: 'Imprint', href: 'vbscript:x' }], copyright: XSS } },
      { id: 'weird', type: 'lp_evil', props: { html: '<img src=x onerror=alert(1)>' } },
    ],
    ...over,
  };
}
const ctx = { baseUrl: 'https://artifysols.com', apiBase: 'https://cc.example.com/api/v1' };

describe('renderLandingHtml', () => {
  const out = renderLandingHtml(page(), ctx);

  it('escapes every text value: no raw script, quote or tag from content survives', () => {
    expect(out).not.toContain('<script>alert(1)</script>');
    expect(out).not.toMatch(/<img src=x/);
    expect(out).not.toContain('onerror=');
    expect(out).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(out.match(/<script\b[^>]*>/g)).toEqual(['<script src="/lp.js" defer data-api="https://cc.example.com/api/v1">']);
    expect(out).not.toMatch(/\son[a-z]+=/i);
  });
  it('neutralises unsafe links and drops unknown blocks and unresolved images', () => {
    expect(out).not.toMatch(/href="javascript:/i);
    expect(out).not.toMatch(/href="data:/i);
    expect(out).not.toMatch(/href="vbscript:/i);
    expect(out).toContain('href="https://example.com/docs" rel="noopener noreferrer"');
    expect(out).not.toContain('lp_evil');
    expect(out).toContain('src="https://cdn.example.com/hero.jpg"');
    expect((out.match(/<img /g) ?? []).length).toBe(2); // logo + hero; the unresolved feature image is omitted
  });
  it('has exactly one H1, a main landmark, skip link, labelled fields and a consent checkbox with privacy link', () => {
    expect((out.match(/<h1\b/g) ?? []).length).toBe(1);
    expect(out).toContain('<main id="main">');
    expect(out).toContain('class="skip"');
    expect(out).toMatch(/<label for="form-f0">/);
    expect(out).toContain('name="consent" type="checkbox" value="true" required');
    expect(out).toContain('href="/privacy">Privacy policy</a>');
    expect(out).toContain('role="status" aria-live="polite"');
    expect(out).toContain('name="website"'); // honeypot, off-screen
    expect(out).toContain('method="post" action="/lp/spring-sale/submit"');
  });
  it('sets title, description, canonical, robots and Open Graph', () => {
    expect(out).toContain('<link rel="canonical" href="https://artifysols.com/lp/spring-sale">');
    expect(out).toContain('<meta name="robots" content="index, follow">');
    expect(out).toContain('property="og:image" content="https://cdn.example.com/hero.jpg"');
    expect(out).toContain('<title>Spring &lt;script&gt;');
  });
  it('noindex pages and previews say so; the preview form is disabled and posts nowhere', () => {
    expect(renderLandingHtml(page({ seo: { ...page().seo, noindex: true } }), ctx)).toContain('content="noindex, nofollow"');
    const pv = renderLandingHtml(page({ preview: true }), ctx);
    expect(pv).toContain('content="noindex, nofollow"');
    expect(pv).toContain('<fieldset disabled>');
    expect(pv).not.toContain('action="/lp/');
    expect(pv).toContain('name="referrer" content="no-referrer"');
  });
  it('helpers', () => {
    expect(esc(`<>"'&`)).toBe('&lt;&gt;&quot;&#39;&amp;');
    for (const bad of ['javascript:x', 'data:x', '//evil.com', 'http://x.com', ' ', '/a\\b']) expect(safeHref(bad), bad).toBe('#');
    for (const ok of ['https://a.com/x', '/p', '#f', 'mailto:a@b.co', 'tel:+4912345']) expect(safeHref(ok), ok).toBe(ok.startsWith('https') ? new URL(ok).toString() : ok);
    const csp = landingCsp('https://cc.example.com/api/v1');
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain('connect-src \'self\' https://cc.example.com');
    expect(csp).toMatch(/script-src 'self';/);
  });
});

function api(handlers: Record<string, { status: number; json?: unknown } | Error>) {
  return vi.fn(async (url: string) => {
    const key = Object.keys(handlers).find((k) => String(url).endsWith(k));
    const h = key ? handlers[key] : { status: 404, json: { success: false } };
    if (h instanceof Error) throw h;
    return { status: h!.status, ok: h!.status < 300, json: async () => h!.json } as unknown as Response;
  });
}

describe('landing handlers', () => {
  afterEach(() => vi.restoreAllMocks());

  it('serves a live page with CDN caching and CSP', async () => {
    const f = api({ '/public/landing/spring-sale': { status: 200, json: { success: true, data: { page: page() } } } });
    const r = await handleLandingPage('spring-sale', '', { ...ctx, fetchImpl: f as never });
    expect(r.status).toBe(200);
    expect(r.headers['Cache-Control']).toBe('public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    expect(r.headers['Content-Security-Policy']).toContain("script-src 'self'");
    expect(r.headers['X-Robots-Tag']).toBeUndefined();
    expect(r.body).toContain('<h1');
  });
  it('adds X-Robots-Tag for noindex pages', async () => {
    const f = api({ '/public/landing/spring-sale': { status: 200, json: { data: { page: page({ seo: { ...page().seo, noindex: true } }) } } } });
    expect((await handleLandingPage('spring-sale', '', { ...ctx, fetchImpl: f as never })).headers['X-Robots-Tag']).toBe('noindex, nofollow');
  });
  it('answers 410 for unpublished, 404 for unknown, and rejects bad slugs without calling the API', async () => {
    const f = api({ '/public/landing/gone-page': { status: 410, json: {} }, '/public/landing/nope': { status: 404, json: {} } });
    const gone = await handleLandingPage('gone-page', '', { ...ctx, fetchImpl: f as never });
    expect(gone.status).toBe(410);
    expect(gone.headers['X-Robots-Tag']).toBe('noindex, nofollow');
    expect((await handleLandingPage('nope', '', { ...ctx, fetchImpl: f as never })).status).toBe(404);
    f.mockClear();
    for (const bad of ['../etc', 'A_B', 'x'.repeat(90), 'a--b']) expect((await handleLandingPage(bad, '', { ...ctx, fetchImpl: f as never })).status, bad).toBe(404);
    expect(f).not.toHaveBeenCalled();
  });
  it('301 after a slug change keeps the query string; never redirects off-site', async () => {
    const f = api({ '/public/landing/old': { status: 200, json: { data: { redirect: { toPath: '/lp/new' } } } }, '/public/landing/evil': { status: 200, json: { data: { redirect: { toPath: 'https://evil.com' } } } } });
    const r = await handleLandingPage('old', 'utm_source=x', { ...ctx, fetchImpl: f as never });
    expect(r.status).toBe(301);
    expect(r.headers.Location).toBe('/lp/new?utm_source=x');
    expect((await handleLandingPage('evil', '', { ...ctx, fetchImpl: f as never })).status).toBe(404);
  });
  it('never caches an API outage', async () => {
    const down = await handleLandingPage('spring-sale', '', { ...ctx, fetchImpl: api({ '/public/landing/spring-sale': new Error('boom') }) as never });
    expect(down.status).toBe(503);
    expect(down.headers['Cache-Control']).toBe('no-store');
    expect((await handleLandingPage('spring-sale', '', { ...ctx, apiBase: undefined })).status).toBe(503);
  });
  it('preview: no-store, noindex, no-referrer, banner; bad token is a 404 without an API call', async () => {
    const token = 'a'.repeat(43);
    const f = api({ [`/public/landing-preview/${token}`]: { status: 200, json: { data: { page: page({ preview: true }) } } } });
    const r = await handleLandingPreview(token, { ...ctx, fetchImpl: f as never });
    expect(r.status).toBe(200);
    expect(r.headers['Cache-Control']).toBe('no-store');
    expect(r.headers['X-Robots-Tag']).toBe('noindex, nofollow');
    expect(r.headers['Referrer-Policy']).toBe('no-referrer');
    expect(r.body).toContain('Private preview');
    f.mockClear();
    expect((await handleLandingPreview('short', { ...ctx, fetchImpl: f as never })).status).toBe(404);
    expect(f).not.toHaveBeenCalled();
    const expired = await handleLandingPreview('b'.repeat(43), { ...ctx, fetchImpl: api({}) as never });
    expect(expired.status).toBe(404);
    expect(expired.headers['Cache-Control']).toBe('no-store');
  });
  it('no-JS form fallback forwards fields, honeypot, visitor IP and UTM from the Referer', async () => {
    const f = api({ '/public/landing/spring-sale/submit': { status: 201, json: { success: true, data: { message: 'Thanks!', redirectUrl: null } } } });
    const r = await handleLandingSubmit('spring-sale', { name: 'A', email: 'a@example.com', consent: 'true', website: '', 'Bad Key': 'x', topic: ['arr'] }, {
      ...ctx, fetchImpl: f as never, clientIp: '203.0.113.5', referer: 'https://artifysols.com/lp/spring-sale?utm_source=newsletter&utm_campaign=c1',
    });
    expect(r.status).toBe(200);
    expect(r.body).toContain('Thanks!');
    const [, init] = f.mock.calls[0]! as unknown as [string, RequestInit];
    const sent = JSON.parse(String(init.body));
    expect(sent.data).toEqual({ name: 'A', email: 'a@example.com', consent: 'true' });
    expect(sent.lastTouch.utmSource).toBe('newsletter');
    expect((init.headers as Record<string, string>)['X-Forwarded-For']).toBe('203.0.113.5');
  });
  it('form fallback maps API errors to readable pages and follows safe redirects only', async () => {
    const mk = (status: number, json: unknown) => api({ '/public/landing/spring-sale/submit': { status, json } });
    expect((await handleLandingSubmit('spring-sale', {}, { ...ctx, fetchImpl: mk(400, { error: { message: '"Email" is required.' } }) as never })).body).toContain('&quot;Email&quot; is required.');
    expect((await handleLandingSubmit('spring-sale', {}, { ...ctx, fetchImpl: mk(429, {}) as never })).status).toBe(429);
    expect((await handleLandingSubmit('spring-sale', {}, { ...ctx, fetchImpl: mk(410, {}) as never })).status).toBe(410);
    const ok = await handleLandingSubmit('spring-sale', {}, { ...ctx, fetchImpl: mk(201, { data: { message: 'x', redirectUrl: 'https://example.com/thanks' } }) as never });
    expect(ok.status).toBe(303);
    expect(ok.headers.Location).toBe('https://example.com/thanks');
    const bad = await handleLandingSubmit('spring-sale', {}, { ...ctx, fetchImpl: mk(201, { data: { message: 'x', redirectUrl: 'javascript:alert(1)' } }) as never });
    expect(bad.status).toBe(200);
  });
  it('touchFromReferer only returns UTM data', () => {
    expect(touchFromReferer('https://x.com/lp/a?utm_source=s&foo=bar')).toMatchObject({ utmSource: 's', landingPath: '/lp/a' });
    expect(touchFromReferer('https://x.com/lp/a?foo=bar')).toBeUndefined();
    expect(touchFromReferer('not a url')).toBeUndefined();
    expect(touchFromReferer(undefined)).toBeUndefined();
  });
});

describe('sitemap', () => {
  afterEach(() => vi.restoreAllMocks());
  const listResponse = (data: unknown) => ({ ok: true, json: async () => ({ success: true, data, meta: { pagination: { totalPages: 1 } } }) });
  const mock = (landing: unknown) =>
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      const u = String(url);
      if (u.includes('/public/landing')) { if (landing instanceof Error) throw landing; return listResponse({ pages: landing }); }
      if (u.includes('/public/posts')) return listResponse({ posts: [] });
      if (u.includes('/public/products')) return listResponse({ products: [] });
      if (u.includes('/public/case-studies')) return listResponse({ caseStudies: [] });
      if (u.includes('/public/categories')) return listResponse({ categories: [] });
      throw new Error(`Unexpected fetch: ${u}`);
    }));

  it('lists published landing pages, and is identical to the old output when there are none', async () => {
    mock([]);
    const none = await getSitemapUrlList('https://artifysols.com', 'https://api.example.com');
    expect(none.some((e) => e.loc.includes('/lp/'))).toBe(false);
    mock([{ slug: 'spring-sale', updatedAt: '2026-10-01T10:00:00Z' }]);
    const some = await getSitemapUrlList('https://artifysols.com', 'https://api.example.com');
    expect(some.filter((e) => e.loc.includes('/lp/')).map((e) => e.loc)).toEqual(['https://artifysols.com/lp/spring-sale']);
    expect(some.filter((e) => !e.loc.includes('/lp/'))).toEqual(none);
  });
  it('a failing landing endpoint never removes the rest of the sitemap', async () => {
    mock(new Error('down'));
    const entries = await getSitemapUrlList('https://artifysols.com', 'https://api.example.com');
    expect(entries.length).toBeGreaterThanOrEqual(9);
  });
});

describe('lp.js', () => {
  const js = readFileSync(resolve(__dirname, '../public/lp.js'), 'utf8');
  it('is dependency-free, never evals, and captures first and last touch', () => {
    expect(js).not.toMatch(/\beval\(|new Function|innerHTML|document\.write/);
    expect(js).toContain('lp_first_touch');
    expect(js).toContain('lp_last_touch');
    expect(js).toContain("/public/landing/'");
    expect(js).not.toMatch(/^\s*(import|export)\b/m);
  });
});
