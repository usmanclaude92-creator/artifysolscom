import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publicApi, mapPostToBlogPost, PublicPost } from '../src/lib/publicApi';

describe('mapPostToBlogPost', () => {
  const basePost: PublicPost = {
    slug: 'my-first-post',
    title: 'My First Post',
    body: '<p>Hello world. This is the body of the post.</p>',
    seo: {},
    category: { slug: 'ai-research', name: 'AI Research & Insights' },
    tags: [{ slug: 'ai', name: 'AI' }],
    author: { name: 'Jane Doe', bio: 'An author', avatarUrl: null },
    featuredMedia: null,
    publishedAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-16T00:00:00.000Z',
  };

  it('maps real fields verbatim rather than inventing content', () => {
    const mapped = mapPostToBlogPost(basePost);
    expect(mapped.slug).toBe('my-first-post');
    expect(mapped.title).toBe('My First Post');
    expect(mapped.content).toBe(basePost.body);
    expect(mapped.tags).toEqual(['AI']);
    expect(mapped.category).toBe('AI Research & Insights');
    expect(mapped.author.name).toBe('Jane Doe');
  });

  it('never fabricates engagement stats the CMS does not track', () => {
    const mapped = mapPostToBlogPost(basePost);
    expect(mapped.views).toBe(0);
    expect(mapped.likes).toBe(0);
  });

  it('falls back to an honest default author when none is set', () => {
    const mapped = mapPostToBlogPost({ ...basePost, author: null });
    expect(mapped.author.name).toBe('Artify Solutions Team');
  });

  it('derives a plausible read time from real body length instead of a fixed guess', () => {
    const longBody = `<p>${'word '.repeat(600)}</p>`;
    const mapped = mapPostToBlogPost({ ...basePost, body: longBody });
    expect(mapped.readTime).toMatch(/^\d+ min read$/);
    expect(parseInt(mapped.readTime, 10)).toBeGreaterThan(1);
  });

  it('returns an unpublished-friendly empty date when publishedAt is null', () => {
    const mapped = mapPostToBlogPost({ ...basePost, publishedAt: null });
    expect(mapped.publishDate).toBe('');
  });
});

describe('publicApi.submitLead', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('posts to /public/leads with the honeypot field included', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => ({ success: true, data: { message: 'ok' }, meta: { requestId: 'r1', timestamp: '' } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await publicApi.submitLead({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello',
      consent: true,
      website: '',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/public/leads');
    expect(options.method).toBe('POST');
    const body = JSON.parse(options.body as string);
    expect(body.website).toBe('');
    expect(body.consent).toBe(true);
  });
});
