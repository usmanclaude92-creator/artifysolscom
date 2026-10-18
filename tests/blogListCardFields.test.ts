import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { mapPostToBlogPost, type PublicPost } from '../src/lib/publicApi';

const base: PublicPost = {
  slug: 'p', title: 'P', body: '', excerpt: 'An excerpt', seo: {}, category: null, tags: [], author: null,
  featuredMedia: null, publishedAt: '2026-10-16T00:00:00.000Z', updatedAt: '2026-10-16T00:00:00.000Z',
};

const read = (rel: string) => fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8');

describe('blog hub loads cards without article bodies', () => {
  it('uses the API reading time when the body is omitted', () => {
    expect(mapPostToBlogPost({ ...base, readingMinutes: 9 }).readTime).toBe('9 min read');
  });
  it('still derives reading time from the body for full posts', () => {
    const body = `<p>${'word '.repeat(450)}</p>`;
    expect(mapPostToBlogPost({ ...base, body }).readTime).toBe('2 min read');
  });
  it('the hub asks for fields=card; other callers are untouched', () => {
    expect(read('src/components/blog/BlogPage.tsx')).toContain("listPosts({ limit: 50, fields: 'card' })");
    expect(read('src/components/BlogPreviewSection.tsx')).not.toContain('fields');
    expect(read('src/lib/publicApi.ts')).toContain("query.set('fields', params.fields)");
  });
  it('opening a post fetches the full article first', () => {
    const src = read('src/components/blog/BlogPage.tsx');
    expect(src).toContain('publicApi.getPostBySlug(card.slug)');
  });
});
