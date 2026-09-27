/**
 * Phase 5 (SEO Control Center) — the sitemap used to fetch a single
 * `?limit=50` page of posts/products, silently omitting everything
 * published after the 50th from search engines. Verifies it now follows
 * `meta.pagination.totalPages` to fetch every page.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSitemapUrlList } from '../src/utils/sitemap';

function makePost(n: number) {
  return {
    slug: `post-${n}`,
    title: `Post ${n}`,
    category: null,
    featuredMedia: null,
    publishedAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('getSitemapUrlList pagination', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches every page of posts, not just the first 50', async () => {
    const totalPosts = 120; // 3 pages at the server's 50-per-page cap
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/public/posts')) {
        const page = Number(new URL(url, 'http://x').searchParams.get('page') ?? '1');
        const start = (page - 1) * 50;
        const items = Array.from({ length: Math.max(0, Math.min(50, totalPosts - start)) }, (_, i) => makePost(start + i + 1));
        const totalPages = Math.ceil(totalPosts / 50);
        return { ok: true, json: async () => ({ success: true, data: { posts: items }, meta: { pagination: { page, limit: 50, total: totalPosts, totalPages } } }) };
      }
      if (url.includes('/public/products')) {
        return { ok: true, json: async () => ({ success: true, data: { products: [] }, meta: { pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } } }) };
      }
      if (url.includes('/public/categories')) {
        return { ok: true, json: async () => ({ success: true, data: { categories: [] } }) };
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const entries = await getSitemapUrlList('https://artifysols.com', 'https://api.example.com/api/v1');

    const articleEntries = entries.filter((e) => e.type === 'article');
    expect(articleEntries).toHaveLength(totalPosts);
    expect(articleEntries.some((e) => e.loc === 'https://artifysols.com/blog/post-1')).toBe(true);
    expect(articleEntries.some((e) => e.loc === 'https://artifysols.com/blog/post-120')).toBe(true);

    const postFetchCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes('/public/posts'));
    expect(postFetchCalls).toHaveLength(3);
  });

  it('degrades honestly (omits dynamic entries) rather than throwing when the API is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      })
    );

    const entries = await getSitemapUrlList('https://artifysols.com', 'https://api.example.com/api/v1');
    expect(entries.some((e) => e.type === 'article')).toBe(false);
    expect(entries.some((e) => e.type === 'core')).toBe(true);
  });
});
