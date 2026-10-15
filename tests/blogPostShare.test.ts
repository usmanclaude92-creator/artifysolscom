import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(process.cwd(), 'src/components/blog/BlogPostPage.tsx'), 'utf8');

describe('blog post page', () => {
  it('has no leftover dev label on the cover image', () => {
    expect(src).not.toContain('Viewport Cover Showcase');
  });
  it('lets the share row wrap on narrow screens', () => {
    expect(src).toMatch(/flex flex-wrap items-center gap-2">\s*<span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1\.5">/);
    expect(src).toMatch(/Social Share Buttons \*\/\}\s*<div className="flex flex-wrap items-center gap-1\.5">/);
  });
});
