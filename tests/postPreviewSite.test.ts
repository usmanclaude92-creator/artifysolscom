import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { previewTokenFromSearch } from '../src/utils/previewMode';

const read = (rel: string) => fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8');
const TOKEN = 'a'.repeat(43);

describe('private blog preview (Control Center "Preview" button)', () => {
  it('recognises only a well-formed ?preview=<token>', () => {
    expect(previewTokenFromSearch(`?preview=${TOKEN}`)).toBe(TOKEN);
    expect(previewTokenFromSearch(`?x=1&preview=${TOKEN}`)).toBe(TOKEN);
    expect(previewTokenFromSearch('')).toBeNull();
    expect(previewTokenFromSearch('?preview=')).toBeNull();
    expect(previewTokenFromSearch('?preview=short')).toBeNull();
    expect(previewTokenFromSearch('?preview=<script>alert(1)</script>')).toBeNull();
  });

  it('a preview is not counted as traffic (first-party beacon and GA4 are skipped)', () => {
    const app = read('src/App.tsx');
    const guard = app.indexOf('previewTokenFromSearch(window.location.search)');
    expect(guard).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(app.indexOf('analytics.trackPageView(window.location.pathname)'));
    expect(guard).toBeLessThan(app.indexOf('trackGaPageView(window.location.pathname'));
  });

  it('reader engagement is read-only in a preview', () => {
    const eng = read('src/components/blog/PostEngagement.tsx');
    expect(eng).toContain('usePostEngagement(post: BlogPost, readOnly = false)');
    expect(eng).toMatch(/if \(readOnly \|\| busy\.current\) return;/);
    expect(read('src/components/blog/BlogPostPage.tsx')).toContain('usePostEngagement(post, !!previewNotice)');
  });

  it('the server skips the SEO lookup for a preview and serves it uncached and noindex', () => {
    const api = read('api/index.ts');
    expect(api).toContain('const isBlogPreview = req.path.startsWith("/blog/")');
    expect(api).toMatch(/isBlogPreview \? "no-store"/);
    expect(api).toContain('if (isBlogPreview) res.setHeader("X-Robots-Tag", "noindex, nofollow")');
    expect(api).toContain('robots: "noindex, nofollow"');
  });

  it('only the preview endpoint is used for a preview; published posts keep the normal endpoint', () => {
    expect(read('src/lib/publicApi.ts')).toContain('/public/post-preview/${encodeURIComponent(token)}');
    const page = read('src/components/blog/BlogPage.tsx');
    expect(page).toContain('publicApi.getPostPreview(previewToken)');
    expect(page).toContain('publicApi.getPostBySlug(slug)');
  });
});
