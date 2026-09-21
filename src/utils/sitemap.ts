export const DEFAULT_BASE_URL = 'https://artifysols.com';

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  type: 'core' | 'product' | 'article' | 'category' | 'portal';
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
}

interface RemoteCategory {
  slug: string;
  name: string;
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
 * called from server.ts) without importing apiClient.ts, which assumes a
 * browser/Vite context. */
function resolveApiBaseUrl(explicit?: string): string | null {
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

async function fetchPublicData(apiBaseUrl?: string): Promise<{
  posts: RemotePost[];
  products: RemoteProduct[];
  categories: RemoteCategory[];
}> {
  const base = resolveApiBaseUrl(apiBaseUrl);
  if (!base) return { posts: [], products: [], categories: [] };

  try {
    const [postsRes, productsRes, categoriesRes] = await Promise.all([
      fetch(`${base}/public/posts?limit=50`),
      fetch(`${base}/public/products?limit=50`),
      fetch(`${base}/public/categories`),
    ]);
    const [postsBody, productsBody, categoriesBody] = await Promise.all([
      postsRes.json(),
      productsRes.json(),
      categoriesRes.json(),
    ]);
    return {
      posts: postsRes.ok && postsBody.success ? postsBody.data.posts : [],
      products: productsRes.ok && productsBody.success ? productsBody.data.products : [],
      categories: categoriesRes.ok && categoriesBody.success ? categoriesBody.data.categories : [],
    };
  } catch {
    // Honest degrade — sitemap just omits dynamic entries rather than
    // fabricating URLs for content that may not exist.
    return { posts: [], products: [], categories: [] };
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
  const { posts, products, categories } = await fetchPublicData(apiBaseUrl);
  const currentDate = formatSitemapDate();

  const entries: SitemapUrlEntry[] = [];

  // 1. Core Top-Level Landing Pages
  entries.push(
    { loc: `${baseUrl}/`, lastmod: currentDate, changefreq: 'daily', priority: 1.0, type: 'core', title: 'Artify Solutions' },
    { loc: `${baseUrl}/solutions`, lastmod: currentDate, changefreq: 'daily', priority: 0.95, type: 'core', title: 'Solutions Catalog' },
    { loc: `${baseUrl}/ai-solutions`, lastmod: currentDate, changefreq: 'daily', priority: 0.9, type: 'core', title: 'AI Solutions' },
    { loc: `${baseUrl}/blog`, lastmod: currentDate, changefreq: 'daily', priority: 0.9, type: 'core', title: 'Blog' },
    { loc: `${baseUrl}/case-studies`, lastmod: currentDate, changefreq: 'weekly', priority: 0.85, type: 'core', title: 'Case Studies' },
    { loc: `${baseUrl}/services`, lastmod: currentDate, changefreq: 'weekly', priority: 0.85, type: 'core', title: 'Services' },
    { loc: `${baseUrl}/about`, lastmod: currentDate, changefreq: 'monthly', priority: 0.8, type: 'core', title: 'About' },
    { loc: `${baseUrl}/contact`, lastmod: currentDate, changefreq: 'monthly', priority: 0.8, type: 'core', title: 'Contact' }
  );

  // 2. Dynamic Product Detail Routes
  products.forEach((product) => {
    entries.push({
      loc: `${baseUrl}/ai-solutions/${product.slug}`,
      lastmod: currentDate,
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

  // 4. Blog Category Hubs
  categories.forEach((cat) => {
    entries.push({
      loc: `${baseUrl}/blog?category=${encodeURIComponent(cat.slug)}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6,
      type: 'category',
      title: `${cat.name} Articles`,
      category: cat.name,
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
 * Generates robots.txt content referencing the dynamic XML sitemap.
 */
export function generateRobotsTxt(customBaseUrl?: string): string {
  const baseUrl = (customBaseUrl || (typeof window !== 'undefined' ? window.location.origin : DEFAULT_BASE_URL)).replace(/\/+$/, '');

  return `# Robots.txt for Artify Solutions (artifysols.com)
User-agent: *
Allow: /
Disallow: /api/
Disallow: /portal/admin/

# Search Engine Sitemap Index
Sitemap: ${baseUrl}/sitemap.xml
`;
}
