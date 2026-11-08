/**
 * Guards the blog feature-image design system (design/blog-images): the original logo is untouched, every article config
 * passes the content rules, and the template cannot recolour or distort the logo.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildHtml, lintArticle } from '../design/blog-images/system.mjs';
import { ART_TYPES } from '../design/blog-images/art.mjs';

const dir = path.resolve(process.cwd(), 'design/blog-images');
const tokens = JSON.parse(fs.readFileSync(path.join(dir, 'tokens.json'), 'utf8'));
const articles: Record<string, any>[] = JSON.parse(fs.readFileSync(path.join(dir, 'articles.json'), 'utf8'));
const assets = { fontsUrl: 'file:///fonts', logoUrl: 'file:///logo.png', backgroundUrl: null };

describe('blog image design system', () => {
  it('uses the approved original logo file, byte for byte', () => {
    const file = fs.readFileSync(path.resolve(process.cwd(), tokens.logo.file));
    expect(crypto.createHash('sha256').update(file).digest('hex')).toBe(tokens.logoSha256);
  });

  it('renders 16:9 at 1600 x 900', () => {
    expect(tokens.canvas.width / tokens.canvas.height).toBeCloseTo(16 / 9, 2);
    const html = buildHtml(articles[0], tokens, assets);
    expect(html).toContain('width:1600px;height:900px');
  });

  it('never applies a filter, blend mode or recolour to the logo', () => {
    for (const a of articles) {
      const html = buildHtml(a, tokens, assets);
      const logoCss = html.split('\n').filter((l) => /\.logo/.test(l)).join('\n');
      expect(logoCss).not.toMatch(/filter|blend|invert|brightness|hue-rotate|opacity|mask/i);
      expect(html).toContain('<div class="logo"><img src="file:///logo.png"');
    }
  });

  it('every article config passes the content rules', () => {
    for (const a of articles) expect(lintArticle(a, tokens), a.slug).toEqual([]);
  });

  it('every article uses a known art type, and every art type is used', () => {
    for (const a of articles) expect(ART_TYPES).toContain(a.art.type);
    expect(new Set(articles.map((a) => a.art.type))).toEqual(new Set(ART_TYPES));
  });

  it('rejects geography, currency and invented figures unless explicitly allowed', () => {
    const base = { slug: 'x', kicker: 'K', titleLines: ['T'], subtitle: 'S', art: { type: 'bars', labels: { tag: 'Weeks' } } };
    expect(lintArticle({ ...base, titleLines: ['Payroll in Oman'] }, tokens).join()).toMatch(/oman/i);
    expect(lintArticle({ ...base, subtitle: 'Serving the GCC' }, tokens).join()).toMatch(/gcc/i);
    expect(lintArticle({ ...base, art: { type: 'bars', labels: { tag: 'AED 25,000' } } }, tokens).length).toBeGreaterThan(0);
    expect(lintArticle({ ...base, art: { type: 'bars', labels: { tag: '96% attendance' } } }, tokens).length).toBeGreaterThan(0);
    expect(lintArticle({ ...base, titleLines: ['Payroll in Oman'], allowTerms: ['oman'] }, tokens)).toEqual([]);
  });

  it('keeps titles and subtitles short enough to fit', () => {
    for (const a of articles) {
      expect(a.titleLines.length).toBeLessThanOrEqual(4);
      expect(a.subtitle.length).toBeLessThanOrEqual(80);
    }
  });
});
