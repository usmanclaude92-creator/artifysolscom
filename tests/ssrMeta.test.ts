/**
 * Phase 8 (Advanced SEO Control Center) — the server-side meta-injection
 * module api/index.ts relies on to make per-page SEO crawler-visible in
 * the actual HTML response, not just via client-side document.head
 * mutation. No DOM here — pure functions + fetch mocking only.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resolveSsrRoute,
  buildCmsPageMeta,
  buildPostMeta,
  buildProductMeta,
  buildBlogArchiveMeta,
  injectMetaIntoHtml,
  renderSeoForPath,
} from '../src/utils/ssrMeta';
import type { PublicPage, PublicPost, PublicProduct } from '../src/lib/publicApi';

const BASE_URL = 'https://artifysols.com';

const STATIC_HTML = `<!doctype html>
<html>
  <head>
    <title>Artify Solutions | Default</title>
    <meta name="description" content="Default description." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://artifysols.com/" />
    <meta property="og:title" content="Default OG title" />
    <meta property="og:description" content="Default OG description" />
    <meta property="og:url" content="https://artifysols.com/" />
    <meta property="og:image" content="https://artifysols.com/og-banner.jpg" />
    <meta name="twitter:title" content="Default Twitter title" />
    <meta name="twitter:description" content="Default Twitter description" />
    <meta name="twitter:image" content="https://artifysols.com/og-banner.jpg" />
  </head>
  <body><div id="root"></div></body>
</html>`;

describe('resolveSsrRoute', () => {
  it('classifies real content routes correctly', () => {
    expect(resolveSsrRoute('/')).toEqual({ kind: 'home' });
    expect(resolveSsrRoute('/blog')).toEqual({ kind: 'blog-archive' });
    expect(resolveSsrRoute('/blog/my-post')).toEqual({ kind: 'blog-post', slug: 'my-post' });
    expect(resolveSsrRoute('/ai-solutions/my-product')).toEqual({ kind: 'product-detail', slug: 'my-product' });
    expect(resolveSsrRoute('/about-us')).toEqual({ kind: 'cms-page', slug: 'about-us' });
  });

  it('treats reserved marketing routes and multi-segment paths as "other" (no SSR override)', () => {
    expect(resolveSsrRoute('/about')).toEqual({ kind: 'other' });
    expect(resolveSsrRoute('/contact')).toEqual({ kind: 'other' });
    expect(resolveSsrRoute('/solutions')).toEqual({ kind: 'other' });
    expect(resolveSsrRoute('/ai-solutions')).toEqual({ kind: 'other' });
    expect(resolveSsrRoute('/some/deep/path')).toEqual({ kind: 'other' });
  });
});

describe('buildCmsPageMeta', () => {
  const page: PublicPage = {
    slug: 'about-us',
    title: 'About Us',
    body: '<p>We build real software.</p>',
    excerpt: null,
    seo: {},
    featuredMedia: null,
    editorBlocks: null,
    publishedAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  it('uses real page data, not fabricated content', () => {
    const meta = buildCmsPageMeta(page, BASE_URL, '/about-us');
    expect(meta.title).toBe('About Us | Artify Solutions');
    expect(meta.description).toBe('We build real software.');
    expect(meta.canonicalUrl).toBe('https://artifysols.com/about-us');
  });

  it('prefers explicit SEO metadata over derived defaults', () => {
    const withSeo: PublicPage = { ...page, seo: { metaTitle: 'Custom Title', metaDescription: 'Custom description.', ogImage: 'https://x/img.jpg' } };
    const meta = buildCmsPageMeta(withSeo, BASE_URL, '/about-us');
    expect(meta.title).toBe('Custom Title');
    expect(meta.description).toBe('Custom description.');
    expect(meta.ogImage).toBe('https://x/img.jpg');
  });
});

describe('buildPostMeta / buildProductMeta / buildBlogArchiveMeta', () => {
  it('builds real per-post metadata including JSON-LD, matching BlogPostPage.tsx', () => {
    const post: PublicPost = {
      slug: 'my-article',
      title: 'My Article',
      body: '<p>Article body.</p>',
      excerpt: 'A short summary.',
      seo: {},
      category: { slug: 'news', name: 'News' },
      tags: [],
      author: { name: 'Jane Doe', bio: null, avatarUrl: null },
      featuredMedia: null,
      publishedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    const meta = buildPostMeta(post, BASE_URL);
    expect(meta.title).toBe('My Article');
    expect(meta.canonicalUrl).toBe('https://artifysols.com/blog/my-article');
    expect(meta.jsonLd).toBeTruthy();
  });

  it('builds real per-product metadata, not a fabricated description', () => {
    const product: PublicProduct = {
      slug: 'my-product',
      code: 'P1',
      name: 'My Product',
      type: 'PRODUCT',
      shortDescription: 'Real short description.',
      description: 'Full description.',
      isFeatured: false,
      displayOrder: 1,
    };
    const meta = buildProductMeta(product, BASE_URL);
    expect(meta.title).toBe('My Product | Artify Solutions');
    expect(meta.description).toBe('Real short description.');
    expect(meta.canonicalUrl).toBe('https://artifysols.com/ai-solutions/my-product');
  });

  it('builds a real archive meta for the blog listing', () => {
    const meta = buildBlogArchiveMeta(BASE_URL);
    expect(meta.canonicalUrl).toBe('https://artifysols.com/blog');
    expect(meta.title).toMatch(/Intelligence Feed/);
  });
});

describe('injectMetaIntoHtml', () => {
  it('replaces title/description/canonical/OG/Twitter tags with real values', () => {
    const html = injectMetaIntoHtml(STATIC_HTML, {
      title: 'Real Page Title',
      description: 'Real page description.',
      canonicalUrl: 'https://artifysols.com/real-page',
      ogTitle: 'Real OG Title',
      ogDescription: 'Real OG description',
      ogImage: 'https://artifysols.com/real.jpg',
    });
    expect(html).toContain('<title>Real Page Title</title>');
    expect(html).toContain('content="Real page description."');
    expect(html).toContain('href="https://artifysols.com/real-page"');
    expect(html).toContain('content="Real OG Title"');
    expect(html).toContain('content="Real OG description"');
    expect(html).toContain('content="https://artifysols.com/real.jpg"');
    // Twitter falls back to the same real title/description/image when not set explicitly.
    expect(html).toContain('name="twitter:title" content="Real Page Title"');
  });

  it('escapes HTML-unsafe characters so injected content cannot break out of its tag', () => {
    const html = injectMetaIntoHtml(STATIC_HTML, {
      title: 'Title with "quotes" & <tags>',
      description: 'desc',
    });
    expect(html).not.toContain('<tags>');
    expect(html).toContain('&lt;tags&gt;');
  });

  it('forces noindex when the response represents an error, overriding any saved robots directive', () => {
    const html = injectMetaIntoHtml(STATIC_HTML, { title: 'x', description: 'y', robots: 'index, follow' }, { statusIsError: true });
    expect(html).toContain('name="robots" content="noindex, nofollow"');
  });

  it('leaves the document untouched when an anchor tag is not found (safe degrade)', () => {
    const minimalHtml = '<html><head></head><body></body></html>';
    const html = injectMetaIntoHtml(minimalHtml, { title: 'x', description: 'y' });
    expect(html).toBe(minimalHtml);
  });

  it('appends a page-specific JSON-LD script before </head> without removing the existing static one', () => {
    const html = injectMetaIntoHtml(STATIC_HTML, {
      title: 'x',
      description: 'y',
      jsonLd: { '@type': 'Article', headline: 'Real headline' },
    });
    expect(html).toContain('id="ssr-page-jsonld"');
    expect(html).toContain('"headline":"Real headline"');
  });

  it('escapes "<" in JSON-LD content so a post title/excerpt containing "</script>" cannot break out of the script tag', () => {
    const html = injectMetaIntoHtml(STATIC_HTML, {
      title: 'x',
      description: 'y',
      jsonLd: { '@type': 'Article', headline: '</script><script>alert(1)</script>' },
    });
    // The raw closing sequence must never appear literally inside the script's content.
    expect(html).not.toContain('</script><script>alert(1)');
    expect(html).toContain('\\u003c/script>\\u003cscript>alert(1)\\u003c/script>');
    // Exactly one script tag actually closes the ld+json block — the escaped
    // content inside it doesn't introduce a second one.
    const scriptCloses = html.match(/<\/script>/g) ?? [];
    expect(scriptCloses.length).toBe(1);
  });
});

describe('Our Ecosystem route', () => {
  it('resolves /ecosystem to its own SSR route (not a CMS page) with the specified metadata', async () => {
    expect(resolveSsrRoute('/ecosystem')).toEqual({ kind: 'ecosystem' });
    const result = await renderSeoForPath('/ecosystem', BASE_URL, 'https://api.example.com/api/v1');
    expect(result.status).toBe(200);
    expect(result.meta?.title).toBe('Our Ecosystem | Artify Solutions');
    expect(result.meta?.canonicalUrl).toBe(`${BASE_URL}/ecosystem`);
    expect(result.meta?.description).toMatch(/connected people, processes, data, applications and AI/);
  });
});

describe('renderSeoForPath (orchestrator, mocked network)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns real page metadata and 200 when the CMS page exists', async () => {
    const page: PublicPage = {
      slug: 'about-us',
      title: 'About Us',
      body: '<p>Real content.</p>',
      excerpt: null,
      seo: {},
      featuredMedia: null,
      editorBlocks: null,
      publishedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { page } }),
    });

    const result = await renderSeoForPath('/about-us', BASE_URL, 'https://api.example.com/api/v1');
    expect(result.status).toBe(200);
    expect(result.meta?.title).toBe('About Us | Artify Solutions');
    expect(result.redirect).toBeNull();
  });

  it('uses Site Identity defaults (title, description, social image) for the home link preview when no CMS homepage exists', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url: string) => {
      if (String(url).includes('/public/homepage')) return { ok: true, json: async () => ({ success: true, data: { page: null } }) };
      return {
        ok: true,
        json: async () => ({
          success: true,
          data: {
            settings: {
              identity: {
                defaultMetaTitle: 'Identity Title',
                defaultMetaDescription: 'Identity description.',
                socialImage: { url: 'https://cdn.example.com/share.png' },
              },
            },
          },
        }),
      };
    });

    const result = await renderSeoForPath('/', BASE_URL, 'https://api.example.com/api/v1');
    expect(result.meta?.ogTitle).toBe('Identity Title');
    expect(result.meta?.ogDescription).toBe('Identity description.');
    expect(result.meta?.ogImage).toBe('https://cdn.example.com/share.png');

    const html = '<head><title>x</title><meta name="description" content="x" /><meta property="og:title" content="x" /><meta property="og:description" content="x" /><meta property="og:image" content="x" /></head>';
    const out = injectMetaIntoHtml(html, result.meta!);
    expect(out).toContain('<meta property="og:image" content="https://cdn.example.com/share.png" />');
    expect(out).toContain('<meta property="og:title" content="Identity Title" />');
  });

  it('applies the Social Share Card overrides (title, description, image alt) and drops the stock image size tags', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(async (url: string) => {
      if (String(url).includes('/public/homepage')) return { ok: true, json: async () => ({ success: true, data: { page: null } }) };
      return {
        ok: true,
        json: async () => ({
          success: true,
          data: {
            settings: {
              identity: {
                defaultMetaTitle: 'Meta Title',
                defaultMetaDescription: 'Meta description.',
                socialTitle: 'Share Title',
                socialDescription: 'Share description.',
                socialImageAlt: 'A banner',
                socialImage: { url: '/uploads/share.png' },
              },
            },
          },
        }),
      };
    });
    const result = await renderSeoForPath('/', BASE_URL, 'https://api.example.com/api/v1');
    expect(result.meta?.title).toBe('Meta Title');
    expect(result.meta?.ogTitle).toBe('Share Title');
    expect(result.meta?.ogDescription).toBe('Share description.');
    expect(result.meta?.ogImage).toBe(`${BASE_URL}/uploads/share.png`);

    const html =
      '<head><title>x</title><meta property="og:title" content="x" /><meta property="og:image" content="x" />\n<meta property="og:image:width" content="1200" />\n<meta property="og:image:height" content="630" /></head>';
    const out = injectMetaIntoHtml(html, result.meta!);
    expect(out).toContain('<meta property="og:title" content="Share Title" />');
    expect(out).toContain('<meta property="og:image:alt" content="A banner" />');
    expect(out).not.toContain('og:image:width');
    expect(out).not.toContain('og:image:height');
  });

  it('follows a real redirect instead of rendering a 404 when one exists', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) }) // page lookup 404s
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { redirect: { toPath: '/new-slug', statusCode: 301 } } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { redirect: null } }) }); // chain ends

    const result = await renderSeoForPath('/old-slug', BASE_URL, 'https://api.example.com/api/v1');
    expect(result.redirect).toEqual({ toPath: '/new-slug', statusCode: 301 });
    expect(result.meta).toBeNull();
  });

  it('returns a real 404 with noindex when nothing matches and no redirect exists', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) }) // page lookup 404s
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { redirect: null } }) }); // no redirect

    const result = await renderSeoForPath('/nonexistent', BASE_URL, 'https://api.example.com/api/v1');
    expect(result.status).toBe(404);
    expect(result.meta?.robots).toBe('noindex, nofollow');
  });

  it('never resolves a redirect cycle into an infinite loop', async () => {
    // /a -> /b -> /a : a real cycle, which must terminate rather than hang.
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: false, json: async () => ({ success: false }) }) // page lookup for /a 404s
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { redirect: { toPath: '/b', statusCode: 301 } } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { redirect: { toPath: '/a', statusCode: 301 } } }) });

    const result = await renderSeoForPath('/a', BASE_URL, 'https://api.example.com/api/v1');
    expect(result.redirect).not.toBeNull();
    expect(['/b', '/a']).toContain(result.redirect?.toPath);
  });

  it('leaves metadata untouched for a route this module does not override', async () => {
    const result = await renderSeoForPath('/about', BASE_URL, 'https://api.example.com/api/v1');
    expect(result.meta).toBeNull();
    expect(result.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('account action pages', () => {
  it('serves /verify-email and /reset-password as noindex, not CMS pages', async () => {
    for (const path of ['/verify-email', '/reset-password']) {
      expect(resolveSsrRoute(path)).toEqual({ kind: 'account-action', path });
      const result = await renderSeoForPath(path, BASE_URL, 'https://api.example.com/api/v1');
      expect(result.status).toBe(200);
      expect(result.meta?.robots).toBe('noindex, nofollow');
    }
  });
});
