export const DEFAULT_BASE_URL = 'https://artifysols.com';

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  type: 'core' | 'product' | 'article' | 'category' | 'portal' | 'landing';
  title?: string;
  category?: string;
  image?: {
    loc: string;
    title?: string;
    caption?: string;
  };
}

interface RemotePost {
  slug: string;
  title: string;
  category: { slug: string; name: string } | null;
  featuredMedia: { url: string } | null;
  publishedAt: string | null;
  updatedAt: string;
}

interface RemoteProduct {
  slug: string;
  name: string;
  shortDescription: string;
  updatedAt?: string | null;
}

// Phase 11 (Case Studies + Content Relationships) — mirrors RemotePost's
// own shape for the same sitemap entry pattern.
interface RemoteCaseStudy {
  slug: string;
  title: string;
  featuredMedia: { url: string } | null;
  publishedAt: string | null;
  updatedAt: string;
}

// Step 12 (Marketing landing pages) — only published, indexable pages come back from this endpoint.
interface RemoteLandingPage {
  slug: string;
  updatedAt: string;
}

/**
 * Normalizes an ISO date string to YYYY-MM-DD for standard sitemap compliance.
 */
export function formatSitemapDate(dateInput?: string | number | Date): string {
  if (!dateInput) {
    return new Date().toISOString().split('T')[0];
  }
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Escapes XML special characters.
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Resolves the Platform API base URL in whatever environment this runs in
 * (browser via Vite's `import.meta.env`, or Node via `process.env` when
 * called from api/index.ts) without importing apiClient.ts, which assumes a
 * browser/Vite context. */
export function resolveApiBaseUrl(explicit?: string): string | null {
  if (explicit) return explicit;
  if (typeof window !== 'undefined') {
    const configured = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
      ?.VITE_PLATFORM_API_BASE_URL;
    return configured && configured.length > 0 ? configured : '/api/v1';
  }
  if (typeof process !== 'undefined' && process.env?.PLATFORM_API_BASE_URL) {
    return process.env.PLATFORM_API_BASE_URL;
  }
  return null;
}

/**
 * The public list endpoints cap `limit` at 50 per page server-side
 * (server/schemas/publicSchemas.ts in Artify-Backend) — a single
 * `?limit=50` request used to silently truncate the sitemap to the first
 * 50 posts/products, omitting everything published after that from
 * search engines entirely. This follows `meta.pagination.totalPages` and
 * fetches every page instead. `maxPages` is a hard ceiling so a runaway
 * total can't turn a build into an unbounded fetch loop.
 */
async function fetchAllPages<T>(base: string, path: string, itemsKey: string, maxPages = 40): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await fetch(`${base}${path}${path.includes('?') ? '&' : '?'}page=${page}&limit=50`);
    const body = await res.json();
    if (!res.ok || !body.success) break;
    items.push(...(body.data[itemsKey] ?? []));
    totalPages = body.meta?.pagination?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages && page <= maxPages);
  return items;
}

async function fetchPublicData(apiBaseUrl?: string): Promise<{
  posts: RemotePost[];
  products: RemoteProduct[];
  caseStudies: RemoteCaseStudy[];
  landingPages: RemoteLandingPage[];
}> {
  const base = resolveApiBaseUrl(apiBaseUrl);
  if (!base) return { posts: [], products: [], caseStudies: [], landingPages: [] };

  try {
    const [posts, products, caseStudies, landingPages] = await Promise.all([
      fetchAllPages<RemotePost>(base, '/public/posts', 'posts'),
      fetchAllPages<RemoteProduct>(base, '/public/products', 'products'),
      fetchAllPages<RemoteCaseStudy>(base, '/public/case-studies', 'caseStudies'),
      // Its own failure (older API, outage) must never drop the rest of the sitemap: it just contributes no entries.
      fetchLandingPages(base),
    ]);
    return {
      posts,
      products,
      caseStudies,
      landingPages,
    };
  } catch {
    // Honest degrade — sitemap just omits dynamic entries rather than
    // fabricating URLs for content that may not exist.
    return { posts: [], products: [], caseStudies: [], landingPages: [] };
  }
}

async function fetchLandingPages(base: string): Promise<RemoteLandingPage[]> {
  try {
    const res = await fetch(`${base}/public/landing`);
    const body = await res.json();
    return res.ok && body.success && Array.isArray(body.data?.pages) ? body.data.pages : [];
  } catch {
    return [];
  }
}

/**
 * Compiles the full structured list of canonical URL entries across the
 * public site. Dynamic entries (articles, products, category hubs) are
 * sourced live from the real Platform API's published/ACTIVE content —
 * never from a static or fabricated list.
 */
export async function getSitemapUrlList(customBaseUrl?: string, apiBaseUrl?: string): Promise<SitemapUrlEntry[]> {
  const baseUrl = (customBaseUrl || (typeof window !== 'undefined' ? window.location.origin : DEFAULT_BASE_URL)).replace(/\/+$/, '');
  const { posts, products, caseStudies, landingPages } = await fetchPublicData(apiBaseUrl);
  // `lastmod` is only ever a real content date. Stamping "today" on pages that did not change teaches Google to ignore the
  // field for the whole site, so pages without a real date simply omit it.
  const latestOf = (items: { updatedAt?: string | null; publishedAt?: string | null }[]): string | undefined => {
    const times = items.map((i) => new Date(i.updatedAt || i.publishedAt || '').getTime()).filter((t) => !isNaN(t));
    return times.length > 0 ? formatSitemapDate(Math.max(...times)) : undefined;
  };

  const entries: SitemapUrlEntry[] = [];

  // 1. Core Top-Level Landing Pages
  entries.push(
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1.0, type: 'core', title: 'Artify Solutions' },
    { loc: `${baseUrl}/ai-solutions`, changefreq: 'daily', priority: 0.9, type: 'core', title: 'AI Solutions' },
    { loc: `${baseUrl}/blog`, lastmod: latestOf(posts), changefreq: 'daily', priority: 0.9, type: 'core', title: 'Blog' },
    { loc: `${baseUrl}/case-studies`, lastmod: latestOf(caseStudies), changefreq: 'weekly', priority: 0.85, type: 'core', title: 'Case Studies' },
    { loc: `${baseUrl}/services`, changefreq: 'weekly', priority: 0.85, type: 'core', title: 'Services' },
    { loc: `${baseUrl}/industries`, changefreq: 'monthly', priority: 0.8, type: 'core', title: 'Industries' },
    { loc: `${baseUrl}/ecosystem`, changefreq: 'monthly', priority: 0.85, type: 'core', title: 'Our Ecosystem' },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.8, type: 'core', title: 'About' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.8, type: 'core', title: 'Contact' },
    { loc: `${baseUrl}/privacy`, changefreq: 'yearly', priority: 0.3, type: 'core', title: 'Privacy Policy' },
    { loc: `${baseUrl}/terms`, changefreq: 'yearly', priority: 0.3, type: 'core', title: 'Terms of Service' },
    { loc: `${baseUrl}/data-deletion`, changefreq: 'yearly', priority: 0.3, type: 'core', title: 'Data Deletion Instructions' }
  );

  // 2. Dynamic Product Detail Routes
  products.forEach((product) => {
    entries.push({
      loc: `${baseUrl}/ai-solutions/${product.slug}`,
      lastmod: product.updatedAt ? formatSitemapDate(product.updatedAt) : undefined,
      changefreq: 'weekly',
      priority: 0.85,
      type: 'product',
      title: product.name,
    });
  });

  // 3. Dynamic Blog Post Detail Routes — published only, straight from the API
  posts.forEach((post) => {
    entries.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: formatSitemapDate(post.updatedAt || post.publishedAt || undefined),
      changefreq: 'weekly',
      priority: 0.75,
      type: 'article',
      title: post.title,
      category: post.category?.name,
      image: post.featuredMedia ? { loc: post.featuredMedia.url, title: post.title } : undefined,
    });
  });

  // 3b. Dynamic Case Study Detail Routes — published only, straight from the API
  caseStudies.forEach((cs) => {
    entries.push({
      loc: `${baseUrl}/case-studies/${cs.slug}`,
      lastmod: formatSitemapDate(cs.updatedAt || cs.publishedAt || undefined),
      changefreq: 'weekly',
      priority: 0.8,
      type: 'article',
      title: cs.title,
      image: cs.featuredMedia ? { loc: cs.featuredMedia.url, title: cs.title } : undefined,
    });
  });

  // 3c. Landing pages — published AND indexable only (the API filters; a noindex or unpublished page never appears)
  landingPages.forEach((lp) => {
    entries.push({
      loc: `${baseUrl}/lp/${lp.slug}`,
      lastmod: formatSitemapDate(lp.updatedAt),
      changefreq: 'weekly',
      priority: 0.7,
      type: 'landing',
      title: lp.slug,
    });
  });

  return entries;
}

/**
 * Generates a standards-compliant XML Sitemap string for Google, Bing, etc.
 */
export async function generateSitemapXml(customBaseUrl?: string, apiBaseUrl?: string): Promise<string> {
  const entries = await getSitemapUrlList(customBaseUrl, apiBaseUrl);

  const xmlUrls = entries
    .map((entry) => {
      let imageXml = '';
      if (entry.image?.loc) {
        imageXml = `
    <image:image>
      <image:loc>${escapeXml(entry.image.loc)}</image:loc>${
          entry.image.title ? `\n      <image:title>${escapeXml(entry.image.title)}</image:title>` : ''
        }
    </image:image>`;
      }

      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${
        entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''
      }${
        entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : ''
      }${
        entry.priority !== undefined ? `\n    <priority>${entry.priority.toFixed(2)}</priority>` : ''
      }${imageXml}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlUrls}
</urlset>`;
}

/**
 * Crawlers that fetch pages for search and AI answer engines. They are named explicitly so the policy is on record rather than
 * implied by the wildcard group; a named group replaces the wildcard one, so each repeats the same two Disallow rules.
 */
export const AI_CRAWLER_USER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
] as const;

const ROBOTS_DISALLOW = ['/api/', '/portal/admin/'];

/**
 * Generates robots.txt content referencing the dynamic XML sitemap.
 */
export function generateRobotsTxt(customBaseUrl?: string): string {
  const baseUrl = (customBaseUrl || (typeof window !== 'undefined' ? window.location.origin : DEFAULT_BASE_URL)).replace(/\/+$/, '');
  const rules = ['Allow: /', ...ROBOTS_DISALLOW.map((d) => `Disallow: ${d}`)].join('\n');
  const aiGroups = AI_CRAWLER_USER_AGENTS.map((ua) => `User-agent: ${ua}\n${rules}`).join('\n\n');

  return `# Robots.txt for Artify Solutions (artifysols.com)
User-agent: *
${rules}

# Search and AI answer-engine crawlers are welcome on all public pages.

${aiGroups}

# Search Engine Sitemap Index
Sitemap: ${baseUrl}/sitemap.xml
`;
}

/**
 * /llms.txt: a plain-markdown map of the site for AI answer engines (llmstxt.org). Built from the same live API data as the
 * sitemap, so it lists only what is actually published.
 */
export async function generateLlmsTxt(customBaseUrl?: string, apiBaseUrl?: string): Promise<string> {
  const entries = await getSitemapUrlList(customBaseUrl, apiBaseUrl);
  const link = (e: SitemapUrlEntry) => `- [${e.title || e.loc}](${e.loc})`;
  const core = entries.filter((e) => e.type === 'core' && !/\/(privacy|terms|data-deletion)$/.test(e.loc));
  const legal = entries.filter((e) => e.type === 'core' && /\/(privacy|terms|data-deletion)$/.test(e.loc));
  const products = entries.filter((e) => e.type === 'product');
  const articles = entries.filter((e) => e.type === 'article' && /\/blog\//.test(e.loc));
  const caseStudies = entries.filter((e) => e.type === 'article' && /\/case-studies\//.test(e.loc));
  const section = (heading: string, items: SitemapUrlEntry[]) => (items.length ? `\n## ${heading}\n\n${items.map(link).join('\n')}\n` : '');

  return `# Artify Solutions

> Artify Solutions builds AI-native software, autonomous agent swarms, business automation and fully customized digital solutions designed around an organization's unique workflows.
${section('Key pages', core)}${section('Solutions', products)}${section('Articles', articles)}${section('Case studies', caseStudies)}${section('Legal', legal)}`;
}
