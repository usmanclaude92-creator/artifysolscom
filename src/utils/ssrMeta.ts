/**
 * Phase 8 (Advanced SEO Control Center, Artify-Backend repo) — server-side
 * (and build-tool-side; no `document` access anywhere in this file)
 * computation of per-route `<head>` metadata, consumed by api/index.ts to
 * inject real, per-page title/description/canonical/OG/Twitter/JSON-LD
 * tags into the HTML response BEFORE it reaches the browser or a crawler.
 *
 * Before this file existed, every one of these tags was set by
 * `updatePageSeo()` (src/utils/seo.ts) mutating `document.head` inside a
 * `useEffect` — invisible to any crawler that doesn't execute JavaScript
 * (or budgets it away), and briefly wrong even for ones that do (the
 * static `index.html` defaults paint first). This module computes the
 * exact same `SeoConfig` shape each page component already builds
 * client-side — see the "mirrors X.tsx's own SEO block" comment on each
 * function below — so the server-rendered and client-rendered tags never
 * drift apart; the client's own `updatePageSeo()` call still runs after
 * mount and simply re-applies the same values (a harmless no-op), so no
 * existing client-side behavior changes.
 */
import { generateBlogPostSeo, type SeoConfig } from './seo.js';
import { resolveApiBaseUrl } from './sitemap.js';
import { mapPostToBlogPost, type PublicPage, type PublicPost, type PublicProduct, type PublicCaseStudy } from '../lib/publicApi.js';

const DEFAULT_BASE_URL = 'https://artifysols.com';
const SITE_NAME = 'Artify Solutions';

/** Mirrors apiClient.ts's envelope shape without importing it (that module assumes a browser/Vite context). */
async function fetchPublicJson<T>(apiBase: string, path: string): Promise<T | null> {
  try {
    const res = await fetch(`${apiBase}${path}`);
    if (!res.ok) return null;
    const body = await res.json();
    if (!body?.success) return null;
    return body.data as T;
  } catch {
    return null;
  }
}

/**
 * Site Identity defaults managed in the Control Center (Website → Site
 * Identity): default meta title, default meta description and default social
 * share image. These drive the link-preview card (og:title / og:description /
 * og:image) whenever the page itself doesn't supply its own.
 */
export interface SiteIdentityDefaults {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  /** Social-card overrides (Site Identity → Social Share Card); blank falls back to title/description. */
  socialTitle?: string;
  socialDescription?: string;
}

async function fetchSiteIdentityDefaults(apiBase: string): Promise<SiteIdentityDefaults> {
  const data = await fetchPublicJson<{
    settings: {
      identity?: {
        defaultMetaTitle?: string;
        defaultMetaDescription?: string;
        socialTitle?: string;
        socialDescription?: string;
        socialImageAlt?: string;
        socialImage?: { url?: string } | null;
      };
    } | null;
  }>(apiBase, '/public/site-settings');
  const identity = data?.settings?.identity;
  return {
    title: identity?.defaultMetaTitle?.trim() || undefined,
    description: identity?.defaultMetaDescription?.trim() || undefined,
    image: identity?.socialImage?.url || undefined,
    imageAlt: identity?.socialImageAlt?.trim() || undefined,
    socialTitle: identity?.socialTitle?.trim() || undefined,
    socialDescription: identity?.socialDescription?.trim() || undefined,
  };
}

function absoluteUrl(url: string | undefined, baseUrl: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Builds home-route metadata purely from Site Identity defaults; null when none are configured. */
export function buildSiteIdentityMeta(defaults: SiteIdentityDefaults, baseUrl: string): SeoConfig | null {
  if (!defaults.title && !defaults.description && !defaults.image && !defaults.socialTitle && !defaults.socialDescription) return null;
  return {
    title: defaults.title || '',
    description: defaults.description || '',
    canonicalUrl: `${baseUrl}/`,
    ogType: 'website',
    ogTitle: defaults.socialTitle || defaults.title,
    ogDescription: defaults.socialDescription || defaults.description,
    ogImage: absoluteUrl(defaults.image, baseUrl),
    ogImageAlt: defaults.imageAlt,
  };
}

function plainTextExcerpt(html: string, maxLen = 160): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? `${text.slice(0, maxLen - 3)}...` : text;
}

/** Mirrors CmsPageRoute.tsx's and DynamicHomeRoute.tsx's identical inline SEO block. */
export function buildCmsPageMeta(page: PublicPage, baseUrl: string, canonicalPath: string): SeoConfig {
  const seo = (page.seo || {}) as { metaTitle?: string; metaDescription?: string; ogImage?: string; robotsDirective?: string };
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const description = seo.metaDescription || page.excerpt || plainTextExcerpt(page.body || '') || page.title;
  return {
    title: seo.metaTitle || `${page.title} | ${SITE_NAME}`,
    description,
    canonicalUrl,
    ogType: 'website',
    ogTitle: seo.metaTitle || page.title,
    ogDescription: description,
    ogImage: seo.ogImage || page.featuredMedia?.url,
    robots: seo.robotsDirective,
    jsonLd: {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: page.title,
      description,
    },
  };
}

/** Mirrors BlogPostPage.tsx's `generateBlogPostSeo(post, { baseUrl })` call. */
export function buildPostMeta(post: PublicPost, baseUrl: string): SeoConfig {
  return generateBlogPostSeo(mapPostToBlogPost(post), { baseUrl });
}

/** Mirrors AiProductDetailPage.tsx's inline SEO block. */
export function buildProductMeta(product: PublicProduct, baseUrl: string): SeoConfig {
  const canonicalUrl = `${baseUrl}/ai-solutions/${product.slug}`;
  return {
    title: `${product.name} | ${SITE_NAME}`,
    description: product.shortDescription,
    canonicalUrl,
    ogType: 'website',
    ogTitle: product.name,
    ogDescription: product.shortDescription,
    twitterCard: 'summary_large_image',
    jsonLd: {
      '@type': 'Product',
      '@id': `${canonicalUrl}#product`,
      name: product.name,
      description: product.shortDescription,
      brand: { '@type': 'Brand', name: SITE_NAME },
    },
  };
}

/** Mirrors CaseStudyDetailPage.tsx's inline SEO block (Phase 11). */
export function buildCaseStudyMeta(caseStudy: PublicCaseStudy, baseUrl: string): SeoConfig {
  const seo = caseStudy.seo as { metaTitle?: string; metaDescription?: string; ogImage?: string };
  const canonicalUrl = `${baseUrl}/case-studies/${caseStudy.slug}`;
  const description = seo.metaDescription || caseStudy.excerpt || plainTextExcerpt(caseStudy.body || '') || caseStudy.title;
  return {
    title: seo.metaTitle || `${caseStudy.title} | ${SITE_NAME} Case Studies`,
    description,
    canonicalUrl,
    ogType: 'article',
    ogTitle: seo.metaTitle || caseStudy.title,
    ogDescription: description,
    ogImage: seo.ogImage || caseStudy.featuredMedia?.url,
    twitterCard: 'summary_large_image',
    publishedTime: caseStudy.publishedAt ?? undefined,
    modifiedTime: caseStudy.updatedAt,
    jsonLd: {
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: caseStudy.title,
      description,
      datePublished: caseStudy.publishedAt ?? undefined,
      dateModified: caseStudy.updatedAt,
      image: caseStudy.featuredMedia?.url ?? seo.ogImage,
    },
  };
}

/** Mirrors BlogPage.tsx's unfiltered (archive) SEO block. */
export function buildBlogArchiveMeta(baseUrl: string): SeoConfig {
  const canonicalUrl = `${baseUrl}/blog`;
  return {
    title: `Intelligence Feed & Research Articles | ${SITE_NAME}`,
    description:
      'Read the latest deep dives on autonomous multi-agent swarms, deterministic financial architectures, vector RAG governance, and enterprise AI engineering.',
    canonicalUrl,
    ogType: 'website',
    ogTitle: 'Artify Solutions Intelligence Feed & Engineering Research',
    ogDescription: 'Deep dives into autonomous agent fleets, deterministic finance, and enterprise AI architecture.',
    twitterCard: 'summary_large_image',
    jsonLd: { '@type': 'CollectionPage', '@id': `${canonicalUrl}#collection`, url: canonicalUrl, name: 'Intelligence Feed & Research Articles' },
  };
}

/** Mirrors EcosystemPage.tsx's SEO block. */
export function buildEcosystemMeta(baseUrl: string): SeoConfig {
  const canonicalUrl = `${baseUrl}/ecosystem`;
  const description =
    'Explore the Artify enterprise ecosystem — connected people, processes, data, applications and AI designed to work together around your business.';
  return {
    title: `Our Ecosystem | ${SITE_NAME}`,
    description,
    canonicalUrl,
    ogType: 'website',
    ogTitle: `Our Ecosystem | ${SITE_NAME}`,
    ogDescription: description,
    twitterCard: 'summary_large_image',
    jsonLd: { '@type': 'WebPage', '@id': `${canonicalUrl}#webpage`, url: canonicalUrl, name: 'Our Ecosystem', description },
  };
}

/** Account-email landing pages (/verify-email, /reset-password): never indexed, token-bearing URLs. */
export function buildAccountActionMeta(baseUrl: string, path: string): SeoConfig {
  return {
    title: `Account | ${SITE_NAME}`,
    description: 'Secure account action for the Artify client portal.',
    canonicalUrl: `${baseUrl}${path}`,
    robots: 'noindex, nofollow',
  };
}

export type SsrRoute =
  | { kind: 'account-action'; path: string }
  | { kind: 'home' }
  | { kind: 'ecosystem' }
  | { kind: 'blog-archive' }
  | { kind: 'blog-post'; slug: string }
  | { kind: 'product-detail'; slug: string }
  | { kind: 'case-study-detail'; slug: string }
  | { kind: 'cms-page'; slug: string }
  | { kind: 'other' };

/**
 * A deliberately small subset of App.tsx's `getRouteFromPath` — only the
 * routes this module actually computes real per-route metadata for.
 * Anything else (`other`) falls through to the static `index.html`
 * defaults untouched, exactly as every route did before this file existed.
 */
export function resolveSsrRoute(pathname: string): SsrRoute {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';
  if (path === '/') return { kind: 'home' };
  if (path === '/ecosystem') return { kind: 'ecosystem' };
  if (path === '/verify-email' || path === '/reset-password') return { kind: 'account-action', path };
  if (path === '/blog') return { kind: 'blog-archive' };
  const blogPost = path.match(/^\/blog\/([^/]+)$/);
  if (blogPost) return { kind: 'blog-post', slug: decodeURIComponent(blogPost[1]!) };
  const product = path.match(/^\/ai-solutions\/([^/]+)$/);
  if (product) return { kind: 'product-detail', slug: decodeURIComponent(product[1]!) };
  const caseStudy = path.match(/^\/case-studies\/([^/]+)$/);
  if (caseStudy) return { kind: 'case-study-detail', slug: decodeURIComponent(caseStudy[1]!) };
  const RESERVED = new Set(['solutions', 'solutions-catalog', 'ai-solutions', 'services', 'industries', 'case-studies', 'about', 'contact', 'privacy', 'terms', 'data-deletion', 'data-deletion-status', 'ecosystem', 'verify-email', 'reset-password']);
  const singleSegment = path.match(/^\/([^/]+)$/);
  if (singleSegment && !RESERVED.has(singleSegment[1]!)) return { kind: 'cms-page', slug: decodeURIComponent(singleSegment[1]!) };
  return { kind: 'other' };
}

export interface SsrResult {
  /** Present only for a route this module actually computed real metadata for; `null` means "leave index.html's static defaults alone." */
  meta: SeoConfig | null;
  status: number;
  /** A real redirect to perform server-side instead of rendering anything. */
  redirect: { toPath: string; statusCode: number } | null;
}

/**
 * Follows the real Redirect table (server-side, via the public API) with a
 * depth guard — mirrors the cycle protection added to
 * redirectService.createRedirect/updateRedirect in the Artify-Backend repo,
 * defensively, in case a redirect was created before that guard existed or
 * via direct DB access. Never loops more than `maxHops` times.
 */
async function lookupRedirect(apiBase: string, path: string): Promise<{ toPath: string; statusCode: number } | null> {
  const data = await fetchPublicJson<{ redirect: { toPath: string; statusCode: number } | null }>(
    apiBase,
    `/public/redirects?path=${encodeURIComponent(path)}`
  );
  return data?.redirect ?? null;
}

async function resolveRedirectChain(
  apiBase: string,
  fromPath: string,
  maxHops = 5
): Promise<{ toPath: string; statusCode: number } | null> {
  const first = await lookupRedirect(apiBase, fromPath);
  if (!first) return null;

  let result = first;
  const visited = new Set<string>([fromPath, first.toPath]);
  for (let hop = 1; hop < maxHops; hop++) {
    const next = await lookupRedirect(apiBase, result.toPath);
    if (!next || visited.has(next.toPath)) break;
    visited.add(next.toPath);
    result = { toPath: next.toPath, statusCode: result.statusCode };
  }
  return result;
}

/** The orchestrator api/index.ts's catch-all handler calls for every HTML document request. */
export async function renderSeoForPath(pathname: string, baseUrl: string, explicitApiBase?: string): Promise<SsrResult> {
  const route = resolveSsrRoute(pathname);
  const apiBase = resolveApiBaseUrl(explicitApiBase) || `${baseUrl}/api/v1`;

  if (route.kind === 'other') return { meta: null, status: 200, redirect: null };

  if (route.kind === 'home') {
    const homepage = await fetchPublicJson<{ page: PublicPage | null }>(apiBase, '/public/homepage').then((d) => d?.page ?? null);
    if (!homepage) {
      // No CMS homepage: the static shell's own tags would show on a shared link, so apply the Site Identity defaults instead.
      const defaults = await fetchSiteIdentityDefaults(apiBase);
      return { meta: buildSiteIdentityMeta(defaults, baseUrl), status: 200, redirect: null };
    }
    const meta = buildCmsPageMeta(homepage, baseUrl, '/');
    if (!meta.ogImage) {
      const defaults = await fetchSiteIdentityDefaults(apiBase);
      if (defaults.image) {
        meta.ogImage = absoluteUrl(defaults.image, baseUrl);
        meta.ogImageAlt = defaults.imageAlt;
      }
    }
    return { meta, status: 200, redirect: null };
  }

  if (route.kind === 'account-action') {
    return { meta: buildAccountActionMeta(baseUrl, route.path), status: 200, redirect: null };
  }

  if (route.kind === 'ecosystem') {
    return { meta: buildEcosystemMeta(baseUrl), status: 200, redirect: null };
  }

  if (route.kind === 'blog-archive') {
    return { meta: buildBlogArchiveMeta(baseUrl), status: 200, redirect: null };
  }

  if (route.kind === 'blog-post') {
    const post = await fetchPublicJson<{ post: PublicPost }>(apiBase, `/public/posts/${encodeURIComponent(route.slug)}`).then((d) => d?.post ?? null);
    if (post) return { meta: buildPostMeta(post, baseUrl), status: 200, redirect: null };
    const redirect = await resolveRedirectChain(apiBase, `/blog/${route.slug}`);
    if (redirect) return { meta: null, status: 200, redirect };
    return { meta: { title: '404 — Not Found', description: 'This article could not be found.', robots: 'noindex, nofollow' }, status: 404, redirect: null };
  }

  if (route.kind === 'product-detail') {
    const product = await fetchPublicJson<{ product: PublicProduct }>(apiBase, `/public/products/${encodeURIComponent(route.slug)}`).then(
      (d) => d?.product ?? null
    );
    if (product) return { meta: buildProductMeta(product, baseUrl), status: 200, redirect: null };
    return { meta: { title: '404 — Not Found', description: 'This solution could not be found.', robots: 'noindex, nofollow' }, status: 404, redirect: null };
  }

  if (route.kind === 'case-study-detail') {
    const caseStudy = await fetchPublicJson<{ caseStudy: PublicCaseStudy }>(apiBase, `/public/case-studies/${encodeURIComponent(route.slug)}`).then(
      (d) => d?.caseStudy ?? null
    );
    if (caseStudy) return { meta: buildCaseStudyMeta(caseStudy, baseUrl), status: 200, redirect: null };
    const redirect = await resolveRedirectChain(apiBase, `/case-studies/${route.slug}`);
    if (redirect) return { meta: null, status: 200, redirect };
    return { meta: { title: '404 — Not Found', description: 'This case study could not be found.', robots: 'noindex, nofollow' }, status: 404, redirect: null };
  }

  // cms-page
  const page = await fetchPublicJson<{ page: PublicPage }>(apiBase, `/public/pages/${encodeURIComponent(route.slug)}`).then((d) => d?.page ?? null);
  if (page) return { meta: buildCmsPageMeta(page, baseUrl, `/${route.slug}`), status: 200, redirect: null };
  const redirect = await resolveRedirectChain(apiBase, `/${route.slug}`);
  if (redirect) return { meta: null, status: 200, redirect };
  // No matching page and no redirect: genuinely unknown path. Leave
  // index.html's defaults in place but mark the response as a true 404 —
  // every path returned 200 before this file existed, a classic "soft
  // 404" that both confuses crawlers and silently hides broken links.
  return { meta: { title: '404 — Not Found', description: 'This page could not be found.', robots: 'noindex, nofollow' }, status: 404, redirect: null };
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeHtmlText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function replaceTag(html: string, pattern: RegExp, replacement: string): string {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

/**
 * Injects `meta` into the real, already-built `index.html` document
 * string (fetched at request time from this same deployment — see
 * api/index.ts — so the asset script/link tags are always the actual
 * hashed production bundle, never a stale copy). Every replacement is a
 * no-op (leaves the static default in place) if its anchor tag isn't
 * found, so a future edit to `index.html`'s structure degrades safely
 * instead of corrupting the document.
 */
export function injectMetaIntoHtml(html: string, meta: SeoConfig, opts: { statusIsError?: boolean } = {}): string {
  let out = html;

  if (meta.title) {
    out = replaceTag(out, /<title>[^<]*<\/title>/, `<title>${escapeHtmlText(meta.title)}</title>`);
  }
  if (meta.description) {
    out = replaceTag(
      out,
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtmlAttr(meta.description)}" />`
    );
  }
  const robots = opts.statusIsError ? 'noindex, nofollow' : meta.robots;
  if (robots) {
    out = replaceTag(out, /<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="${escapeHtmlAttr(robots)}" />`);
  }
  if (meta.canonicalUrl) {
    out = replaceTag(out, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeHtmlAttr(meta.canonicalUrl)}" />`);
  }
  if (meta.ogTitle || meta.title) {
    out = replaceTag(out, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeHtmlAttr(meta.ogTitle || meta.title)}" />`);
  }
  if (meta.ogDescription || meta.description) {
    out = replaceTag(
      out,
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtmlAttr(meta.ogDescription || meta.description)}" />`
    );
  }
  if (meta.canonicalUrl) {
    out = replaceTag(out, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeHtmlAttr(meta.canonicalUrl)}" />`);
  }
  if (meta.ogImage) {
    out = replaceTag(out, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${escapeHtmlAttr(meta.ogImage)}" />`);
    // The shell's fixed 1200x630 size describes the stock banner, not whatever image was supplied here.
    out = out.replace(/\s*<meta property="og:image:(width|height)" content="[^"]*"\s*\/?>/g, '');
    if (meta.ogImageAlt && !/property="og:image:alt"/.test(out)) {
      out = out.replace(
        /(<meta property="og:image" content="[^"]*"\s*\/?>)/,
        `$1\n    <meta property="og:image:alt" content="${escapeHtmlAttr(meta.ogImageAlt)}" />`
      );
    }
  }
  if (meta.twitterTitle || meta.title) {
    out = replaceTag(
      out,
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeHtmlAttr(meta.twitterTitle || meta.title)}" />`
    );
  }
  if (meta.twitterDescription || meta.description) {
    out = replaceTag(
      out,
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeHtmlAttr(meta.twitterDescription || meta.description)}" />`
    );
  }
  if (meta.twitterImage || meta.ogImage) {
    out = replaceTag(
      out,
      /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:image" content="${escapeHtmlAttr(meta.twitterImage || meta.ogImage || '')}" />`
    );
  }

  if (meta.jsonLd) {
    const graph = typeof meta.jsonLd === 'object' && !Array.isArray(meta.jsonLd) && (meta.jsonLd as Record<string, unknown>)['@graph']
      ? (meta.jsonLd as { '@graph': unknown[] })['@graph']
      : [meta.jsonLd];
    // Escaping every `<` (not just a literal "</script>") is the standard
    // safe way to embed arbitrary JSON inside a <script> block: it also
    // blocks "<!--" and any other HTML-significant sequence a post
    // title/excerpt could contain, without needing to parse the JSON to
    // find them. < is valid inside a JSON string and parses back to
    // the same "<" character, so the structured data itself is unchanged.
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
    const script = `<script type="application/ld+json" id="ssr-page-jsonld">${json}</script>\n  </head>`;
    if (out.includes('</head>')) out = out.replace(/<\/head>/, script);
  }

  return out;
}
