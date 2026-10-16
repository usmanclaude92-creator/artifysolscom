import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(process.cwd(), 'src/components/blog/BlogPostPage.tsx'), 'utf8');

describe('blog post page shows no made-up engagement data', () => {
  it.each([
    ['fabricated visit count', '4820'],
    ['rating widget', 'Rate this Research Paper'],
    ['reaction chips', 'Game Changer'],
    ['non-persistent comments', 'Architectural Discussion'],
    ['invented author bio', 'Pioneering distributed AI systems'],
    ['unchecked "Verified Author" badge', 'Verified Author'],
    ['unchecked "Moderated & Verified" claim', 'Moderated & Verified'],
    ['local-only like counter', 'like-post-btn'],
  ])('has no %s', (_n, needle) => {
    expect(src).not.toContain(needle);
  });
  it('still shows read time and date', () => {
    expect(src).toContain('post.readTime');
    expect(src).toContain('post.publishDate');
  });
});
