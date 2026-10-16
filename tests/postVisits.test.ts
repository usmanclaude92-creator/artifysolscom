import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { mapPostToBlogPost, type PublicPost } from '../src/lib/publicApi';

const base: PublicPost = {
  slug: 'p', title: 'P', body: '<p>x</p>', excerpt: null, seo: {}, category: null, tags: [], author: null,
  featuredMedia: null, publishedAt: '2026-10-16T00:00:00.000Z', updatedAt: '2026-10-16T00:00:00.000Z',
};

describe('post visits come from the API, never invented', () => {
  it('maps the real visit count', () => {
    expect(mapPostToBlogPost({ ...base, visits: 7 }).views).toBe(7);
  });
  it('is 0 when the API does not report visits', () => {
    expect(mapPostToBlogPost(base).views).toBe(0);
  });
  it('the post page shows the real session count through the visits pill', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/components/blog/BlogPostPage.tsx'), 'utf8');
    expect(src).toContain('<VisitsPill visits={eng.visits} />');
    expect(src).not.toMatch(/4820|\|\| 48/);
  });
});
