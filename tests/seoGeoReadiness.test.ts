/**
 * SEO + GEO readiness: crawler-visible page content, honest sitemap dates, AI-crawler policy, llms.txt, structured data.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  sanitizeBodyHtml,
  postContentHtml,
  blogArchiveContentHtml,
  staticPageContentHtml,
  caseStudyIndexContentHtml,
  productCatalogContentHtml,
  injectContentIntoHtml,
  wrapCrawlerContent,
} from '../src/utils/crawlerContent';
import { generateRobotsTxt, generateLlmsTxt, getSitemapUrlList, AI_CRAWLER_USER_AGENTS } from '../src/utils/sitemap';
import { renderSeoForPath, buildStaticPageJsonLd } from '../src/utils/ssrMeta';
import { generateBlogPostSeo } from '../src/utils/seo';
import { mapPostToBlogPost, type PublicPost } from '../src/lib/publicApi';
import { STATIC_ROUTE_META } from '../src/utils/routeMeta';

const post: PublicPost = {
  slug: 'hello', title: 'Hello <World>', body: '<p>Body text</p><script>alert(1)</script><a href="javascript:alert(1)" onclick="x()">link</a>',
  excerpt: 'Short excerpt', seo: {}, category: null, tags: [{ slug: 'erp', name: 'ERP' }], author: null, featuredMedia: null,
  publishedAt: '2026-10-18T11:30:00.000Z', updatedAt: '2026-10-18T11:34:00.000Z',
};

describe('crawler content', () => {
  it('strips scripts, handlers and javascript: links from CMS html', () => {
    const out = sanitizeBodyHtml(post.body);
    expect(out).toContain('<p>Body text</p>');
    expect(out).not.toMatch(/<script|onclick|javascript:/i);
  });

  it('renders a post as a real article with the title as h1, escaped', () => {
    const html = postContentHtml(post);
    expect(html).toContain('<h1>Hello &lt;World&gt;</h1>');
    expect(html).toContain('<p>By Artify Solutions Team</p>');
    expect(html).toContain('Body text');
    expect(html).not.toContain('<script');
  });

  it('lists archive posts as links', () => {
    expect(blogArchiveContentHtml([post])).toContain('<a href="/blog/hello">Hello &lt;World&gt;</a>');
  });

  it('has captured copy for every static page that needs it, each with an h1', () => {
    for (const path of ['/about', '/services', '/industries', '/contact', '/ecosystem']) {
      const html = staticPageContentHtml(path);
      expect(html, path).toBeTruthy();
      expect(html, path).toMatch(/<h1>/);
      expect(html!.length, path).toBeGreaterThan(400);
    }
  });

  it('captures every industry sector, not only the one the picker opens on', () => {
    const html = staticPageContentHtml('/industries')!;
    for (const sector of ['Finance &amp; Accounting', 'Healthcare', 'Construction', 'Logistics &amp; Fleet', 'Energy &amp; Utilities']) {
      expect(html).toContain(`<h3>${sector}</h3>`);
    }
  });

  it('does not repeat a card as a glued list item plus a heading and paragraph', () => {
    const html = staticPageContentHtml('/ecosystem')!;
    expect(html).not.toMatch(/<li>PeoplePeople/);
    expect(html).toContain('<h3>People &amp; Workforce</h3>');
  });

  it('leaves out a list when there is nothing to list', () => {
    expect(caseStudyIndexContentHtml([])).toBe('<h1>Enterprise AI Case Studies</h1>\n');
    expect(caseStudyIndexContentHtml([])).not.toContain('<ul>');
    expect(blogArchiveContentHtml([])).not.toContain('<ul>');
    expect(productCatalogContentHtml([])).not.toContain('<ul>');
  });

  it('puts the content in the empty root, clipped off-screen, and is a no-op without the anchor', () => {
    const shell = '<div id="root"><!--hero-shell:start--><!--hero-shell:end--></div>';
    const out = injectContentIntoHtml(shell, '<h1>X</h1>');
    expect(out).toContain('data-ssr-content');
    expect(out).toContain('<h1>X</h1>');
    expect(out).toContain('clip:rect(0 0 0 0)');
    expect(out).not.toContain('display:none');
    expect(injectContentIntoHtml('<div id="root"></div>', '<h1>X</h1>')).toBe('<div id="root"></div>');
    expect(wrapCrawlerContent('a')).toContain('position:absolute');
  });
});

describe('server render returns crawler content', () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    global.fetch = vi.fn(async (url: string) => {
      const u = String(url);
      const data = u.includes('/public/posts/hello')
        ? { post }
        : u.includes('/public/posts')
          ? { posts: [post] }
          : u.includes('/public/products')
            ? { products: [{ slug: 'cas', name: 'CAS', shortDescription: 'Construction accounting' }] }
            : u.includes('/public/case-studies')
              ? { caseStudies: [] }
              : {};
      return { ok: true, status: 200, json: async () => ({ success: true, data }) } as Response;
    }) as unknown as typeof fetch;
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('blog post, archive, catalog and static pages all carry body text', async () => {
    const api = 'https://api.example/api/v1';
    expect((await renderSeoForPath('/blog/hello', 'https://artifysols.com', api)).contentHtml).toContain('<h1>Hello &lt;World&gt;</h1>');
    expect((await renderSeoForPath('/blog', 'https://artifysols.com', api)).contentHtml).toContain('/blog/hello');
    expect((await renderSeoForPath('/ai-solutions', 'https://artifysols.com', api)).contentHtml).toContain('<a href="/ai-solutions/cas">CAS</a>');
    expect((await renderSeoForPath('/about', 'https://artifysols.com', api)).contentHtml).toMatch(/<h1>/);
    expect((await renderSeoForPath('/ecosystem', 'https://artifysols.com', api)).contentHtml).toMatch(/<h1>/);
  });

  it('the blog archive asks for card fields so the page-sized request stays small', async () => {
    await renderSeoForPath('/blog', 'https://artifysols.com', 'https://api.example/api/v1');
    const urls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.map((c) => String(c[0]));
    expect(urls.some((u) => u.includes('fields=card'))).toBe(true);
  });

  it('the homepage keeps its prerendered hero and gets no injected copy', async () => {
    const r = await renderSeoForPath('/', 'https://artifysols.com', 'https://api.example/api/v1');
    expect(r.contentHtml).toBeUndefined();
  });
});

describe('sitemap dates', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('never stamps today on pages that did not change', async () => {
    global.fetch = vi.fn(async (url: string) => {
      const u = String(url);
      const data = u.includes('/public/posts')
        ? { posts: [{ slug: 'a', title: 'A', category: null, featuredMedia: null, publishedAt: '2026-01-05T00:00:00Z', updatedAt: '2026-02-10T00:00:00Z' }] }
        : u.includes('/public/products')
          ? { products: [{ slug: 'p', name: 'P', shortDescription: 's' }] }
          : u.includes('/public/case-studies')
            ? { caseStudies: [] }
            : { pages: [] };
      return { ok: true, status: 200, json: async () => ({ success: true, data, meta: { pagination: { totalPages: 1 } } }) } as Response;
    }) as unknown as typeof fetch;
    const entries = await getSitemapUrlList('https://artifysols.com', 'https://api.example/api/v1');
    const byLoc = (suffix: string) => entries.find((e) => e.loc === `https://artifysols.com${suffix}`)!;
    expect(byLoc('/blog').lastmod).toBe('2026-02-10');
    expect(byLoc('/about').lastmod).toBeUndefined();
    expect(byLoc('/').lastmod).toBeUndefined();
    expect(byLoc('/ai-solutions/p').lastmod).toBeUndefined();
    expect(byLoc('/blog/a').lastmod).toBe('2026-02-10');
  });
});

describe('robots.txt and llms.txt', () => {
  it('names every AI/search crawler and keeps the private paths blocked for each', () => {
    const robots = generateRobotsTxt('https://artifysols.com');
    for (const ua of AI_CRAWLER_USER_AGENTS) {
      const group = robots.split('\n\n').find((g) => g.startsWith(`User-agent: ${ua}\n`));
      expect(group, ua).toBeTruthy();
      expect(group).toContain('Disallow: /api/');
      expect(group).toContain('Disallow: /portal/admin/');
    }
    expect(robots).toContain('Sitemap: https://artifysols.com/sitemap.xml');
  });

  it('llms.txt is a markdown map built from published content only', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn(async (url: string) => {
      const u = String(url);
      const data = u.includes('/public/posts')
        ? { posts: [{ slug: 'a', title: 'Article A', category: null, featuredMedia: null, publishedAt: null, updatedAt: '2026-02-10T00:00:00Z' }] }
        : u.includes('/public/products')
          ? { products: [{ slug: 'p', name: 'Product P', shortDescription: 's' }] }
          : u.includes('/public/case-studies')
            ? { caseStudies: [] }
            : { pages: [] };
      return { ok: true, status: 200, json: async () => ({ success: true, data, meta: { pagination: { totalPages: 1 } } }) } as Response;
    }) as unknown as typeof fetch;
    const txt = await generateLlmsTxt('https://artifysols.com', 'https://api.example/api/v1');
    global.fetch = originalFetch;
    expect(txt.startsWith('# Artify Solutions\n\n> ')).toBe(true);
    expect(txt).toContain('[Article A](https://artifysols.com/blog/a)');
    expect(txt).toContain('[Product P](https://artifysols.com/ai-solutions/p)');
    expect(txt).toContain('## Legal');
    expect(txt).not.toContain('## Case studies');
  });
});

describe('structured data', () => {
  it('static pages get WebPage + breadcrumb data tied to the site entities', () => {
    const ld = buildStaticPageJsonLd('/about', { title: 'About Artify Solutions - We Believe', description: 'd', canonicalUrl: 'https://artifysols.com/about' }) as { '@graph': Record<string, unknown>[] };
    expect(ld['@graph'][0]!['@type']).toBe('AboutPage');
    expect(ld['@graph'][0]!.isPartOf).toEqual({ '@id': 'https://artifysols.com/#website' });
    expect(JSON.stringify(ld['@graph'][1])).toContain('"position":2');
    for (const path of Object.keys(STATIC_ROUTE_META).filter((p) => !STATIC_ROUTE_META[p]!.robots)) {
      expect(buildStaticPageJsonLd(path, { title: 'T | Artify Solutions', description: 'd', canonicalUrl: `https://artifysols.com${path}` })).toBeTruthy();
    }
  });

  it('blog posts: BlogPosting, real keywords only, valid author image, real logo, /blog breadcrumb, no thin rating', () => {
    const seo = generateBlogPostSeo(mapPostToBlogPost({ ...post, rating: { average: 5, count: 1 } }), { baseUrl: 'https://artifysols.com' });
    const article = (seo.jsonLd as { '@graph': Record<string, any>[] })['@graph'][0]!;
    expect(article['@type']).toBe('BlogPosting');
    expect(article.keywords).toBe('ERP');
    expect(article.author.image).toBeUndefined();
    expect(article.publisher.logo.url).toBe('https://artifysols.com/logo.png');
    expect(article.aggregateRating).toBeUndefined();
    const crumbs = (seo.jsonLd as { '@graph': Record<string, any>[] })['@graph'][1]!.itemListElement;
    expect(crumbs[1].item).toBe('https://artifysols.com/blog');
  });

  it('a rating from five or more readers is published', () => {
    const seo = generateBlogPostSeo(mapPostToBlogPost({ ...post, rating: { average: 4.6, count: 8 } }), { baseUrl: 'https://artifysols.com' });
    const article = (seo.jsonLd as { '@graph': Record<string, any>[] })['@graph'][0]!;
    expect(article.aggregateRating.ratingCount).toBe(8);
  });
});

describe('small files', () => {
  it('ships a web manifest and links it from the document head', async () => {
    const fs = await import('node:fs');
    const manifest = JSON.parse(fs.readFileSync('public/manifest.webmanifest', 'utf8'));
    expect(manifest.name).toBe('Artify Solutions');
    expect(fs.readFileSync('index.html', 'utf8')).toContain('<link rel="manifest" href="/manifest.webmanifest" />');
  });
});
