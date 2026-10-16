import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (f: string) => fs.readFileSync(path.resolve(process.cwd(), f), 'utf8');
const imgClass = (src: string, srcAttr: string) => {
  const i = src.indexOf(`src={${srcAttr}}`);
  expect(i).toBeGreaterThan(-1);
  return src.slice(i, src.indexOf('/>', i));
};

describe('blog card images are shown whole, not cropped', () => {
  const page = read('src/components/blog/BlogPage.tsx');
  const post = read('src/components/blog/BlogPostPage.tsx');
  it.each([
    ['featured card', page, 'featuredPost.coverImage'],
    ['grid card', page, 'post.coverImage'],
    ['related card', post, 'relatedPost.coverImage'],
  ])('%s uses object-contain with no zoom', (_n, src, attr) => {
    const img = imgClass(src, attr);
    expect(img).toContain('object-contain');
    expect(img).not.toContain('object-cover');
    expect(img).not.toContain('scale-105');
  });
});
