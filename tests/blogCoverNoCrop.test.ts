import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(process.cwd(), 'src/components/blog/BlogPostPage.tsx'), 'utf8');
const cover = src.slice(src.indexOf('id="article-cover-image-showcase"'), src.indexOf('post.coverGradient ||'));

describe('blog post cover image', () => {
  it('shows the whole picture instead of cropping it to a fixed strip', () => {
    expect(cover).toContain('object-contain');
    expect(cover).not.toContain('object-cover');
    const img = cover.slice(cover.indexOf('<img'), cover.indexOf('/>', cover.indexOf('<img')));
    expect(img).toContain('h-auto');
    expect(img).not.toMatch(/aspect-\[/);
  });
  it('does not draw a caption chip over the picture', () => {
    expect(cover).not.toContain('Technical Intelligence');
  });
});
