import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (f: string) => fs.readFileSync(path.resolve(process.cwd(), f), 'utf8');

describe('blog images go through the image optimizer', () => {
  const page = read('src/components/blog/BlogPage.tsx');
  const post = read('src/components/blog/BlogPostPage.tsx');
  it('no blog cover is a plain <img> any more', () => {
    for (const attr of ['featuredPost.coverImage', 'post.coverImage', 'relatedPost.coverImage']) {
      expect(page + post).not.toContain(`src={${attr}}`);
    }
  });
  it.each([
    ['featured card', page, 'featuredPost.coverImage', 'priority'],
    ['grid card', page, 'post.coverImage', 'lazy'],
    ['post cover', post, 'post.coverImage', 'priority'],
    ['related card', post, 'relatedPost.coverImage', 'lazy'],
  ])('%s uses MediaImg with sizes and %s loading', (_n, src, attr, mode) => {
    const i = src.indexOf(`url={${attr}}`);
    expect(i).toBeGreaterThan(-1);
    const el = src.slice(src.lastIndexOf('<MediaImg', i), src.indexOf('/>', i));
    expect(el).toContain('sizes=');
    expect(el).toContain(mode);
  });
});
