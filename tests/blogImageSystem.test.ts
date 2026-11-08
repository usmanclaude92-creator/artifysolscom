/**
 * Guards the blog feature-image design system (design/blog-images): the original logos are untouched, every article config
 * passes the content rules, and the templates cannot recolour or distort a logo.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildHtml, lintArticle } from '../design/blog-images/system.mjs';
import { ART_TYPES } from '../design/blog-images/art.mjs';
import { ICON_NAMES, OBJECT_NAMES } from '../design/blog-images/showcase.mjs';

const dir = path.resolve(process.cwd(), 'design/blog-images');
const tokens = JSON.parse(fs.readFileSync(path.join(dir, 'tokens.json'), 'utf8'));
const articles: Record<string, any>[] = JSON.parse(fs.readFileSync(path.join(dir, 'articles.json'), 'utf8'));
const assets = { fontsUrl: 'file:///fonts', logoUrl: 'file:///light-logo.png', logoDarkUrl: 'file:///dark-logo.png', backgroundUrl: null };
const sha = (rel: string) => crypto.createHash('sha256').update(fs.readFileSync(path.resolve(process.cwd(), rel))).digest('hex');

const simple = { slug: 'x', layout: 'simple-light', kicker: 'K', titleLines: ['T'], subtitle: 'S', art: { type: 'bars', labels: { tag: 'Weeks' } } };

describe('blog image design system', () => {
  it('uses the approved original logo files, byte for byte', () => {
    expect(sha(tokens.logo.file)).toBe(tokens.logoSha256);
    expect(sha(tokens.logoDark.file)).toBe(tokens.logoDark.sha256);
  });

  it('renders 16:9 at 1600 x 900', () => {
    expect(tokens.canvas.width / tokens.canvas.height).toBeCloseTo(16 / 9, 2);
    for (const a of [articles[0], simple]) expect(buildHtml(a, tokens, assets)).toContain('width:1600px;height:900px');
  });

  it('never applies a filter, blend mode or recolour to a logo, in either layout', () => {
    for (const a of [...articles, simple]) {
      const html = buildHtml(a, tokens, assets);
      const logoCss = html.split('\n').filter((l) => /\.logo/.test(l)).join('\n');
      expect(logoCss).not.toMatch(/filter|blend|invert|brightness|hue-rotate|opacity|mask|transform/i);
    }
    expect(buildHtml(articles[0], tokens, assets)).toContain('<img class="logo" src="file:///dark-logo.png"');
    expect(buildHtml(simple, tokens, assets)).toContain('<div class="logo"><img src="file:///light-logo.png"');
  });

  it('every article config passes the content rules', () => {
    for (const a of articles) expect(lintArticle(a, tokens), a.slug).toEqual([]);
    expect(lintArticle(simple, tokens)).toEqual([]);
  });

  it('every article is fully specified: 4 known features, known objects, an approved product name', () => {
    for (const a of articles) {
      expect(a.features).toHaveLength(4);
      for (const f of a.features) expect(ICON_NAMES).toContain(f.icon);
      for (const o of a.objects ?? []) expect(OBJECT_NAMES).toContain(o);
      expect(tokens.cta.brands).toContain(a.cta.brand);
    }
    expect(ART_TYPES.length).toBeGreaterThan(0);
  });

  it('rejects geography, currency and invented figures unless explicitly allowed', () => {
    const base = articles[0];
    expect(lintArticle({ ...base, lead: 'Payroll in Oman' }, tokens).join()).toMatch(/oman/i);
    expect(lintArticle({ ...base, titleViolet: ['The GCC guide'] }, tokens).join()).toMatch(/gcc/i);
    expect(lintArticle({ ...base, device: { ...base.device, statuses: ['AED 25,000'] } }, tokens).length).toBeGreaterThan(0);
    expect(lintArticle({ ...base, features: base.features.map((f: any, i: number) => (i ? f : { ...f, label: '96% faster' })) }, tokens).length).toBeGreaterThan(0);
    expect(lintArticle({ ...base, lead: 'Payroll in Oman', allowTerms: ['oman'] }, tokens)).toEqual([]);
  });

  it('rejects unknown icons, objects, product names and over-long text', () => {
    const base = articles[0];
    expect(lintArticle({ ...base, features: base.features.map((f: any, i: number) => (i ? f : { ...f, icon: 'rocket' })) }, tokens).join()).toMatch(/icon/);
    expect(lintArticle({ ...base, objects: ['person'] }, tokens).join()).toMatch(/object/);
    expect(lintArticle({ ...base, cta: { pre: 'Try', brand: 'SuperSoft' } }, tokens).join()).toMatch(/cta\.brand/);
    expect(lintArticle({ ...base, lead: 'x'.repeat(40) }, tokens).join()).toMatch(/lead/);
  });
});
