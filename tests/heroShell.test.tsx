// @vitest-environment node
/**
 * "/" ships the real Hero prerendered into the HTML shell (vite-plugins/heroShell.ts); other routes must not.
 * Runs in the node environment on purpose: that is where the build renders it (no `document`).
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeroShell } from '../src/components/HeroShell';
import { criticalCss } from '../vite-plugins/heroShell';
import { renderSeoForPath, stripHeroShell } from '../src/utils/ssrMeta';

afterEach(() => vi.restoreAllMocks());

describe('prerendered hero markup', () => {
  const html = renderToStaticMarkup(React.createElement(HeroShell));

  it('contains the real headline, copy and calls to action', () => {
    expect(html).toContain('Your Business is Unique.');
    expect(html).toContain('Your Software Should Be Too.');
    expect(html).toContain('Fully Customized and Adaptive Eco-System');
    for (const id of ['hero-primary-cta', 'hero-secondary-cta', 'hero-wizard-cta']) expect(html).toContain(`id="${id}"`);
    expect(html).toContain('/hero-devices-800.webp 800w');
  });

  it('is visible straight away: no entry animation leaves it at opacity 0', () => {
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
    expect(html).toContain('data-hero-shell');
  });
});

describe('criticalCss', () => {
  const css = `@layer theme,base,utilities;
@layer theme{:root{--color-red:#f00;--color-blue:#00f;--unused:1}}
@layer utilities{.text-red{color:var(--color-red)}.lg\\:flex{display:flex}.never-used{color:green}.theme-dark .x{color:#000}.a:not(.b){color:#111}}
@media (min-width:64rem){.lg\\:flex{display:flex}.gone{display:none}}
@keyframes spin{to{opacity:1}}@keyframes unused{to{opacity:0}}
.spin-it{animation:spin 1s}`;
  const out = criticalCss(css, '<div class="text-red lg:flex a spin-it"></div>');

  it('keeps rules for used classes (including escaped ones) and the variables they read', () => {
    expect(out).toContain('.text-red');
    expect(out).toContain('.lg\\:flex');
    expect(out).toContain('--color-red');
    expect(out).toContain('.a:not(.b)');
  });
  it('drops unused rules, unread variables and unused keyframes', () => {
    expect(out).not.toContain('never-used');
    expect(out).not.toContain('.gone');
    expect(out).not.toContain('--color-blue');
    expect(out).not.toContain('--unused');
    expect(out).not.toContain('@keyframes unused');
    expect(out).toContain('@keyframes spin');
  });
});

describe('stripHeroShell', () => {
  const shell = `<head><!--hero-css:start--><link rel="preload" as="style" href="/a.css" /><link rel="stylesheet" href="/a.css" id="app-css" media="print" onload="this.media='all'" /><noscript><link rel="stylesheet" href="/a.css"></noscript><!--hero-css:end--><style id="hero-critical">.x{}</style></head><body><div id="root"><!--hero-shell:start--><div data-hero-shell>hero</div><!--hero-shell:end--></div></body>`;
  it('removes the hero and its CSS and makes the stylesheet blocking again', () => {
    const out = stripHeroShell(shell);
    expect(out).not.toContain('data-hero-shell>');
    expect(out).not.toContain('hero-critical');
    expect(out).toContain('<link rel="stylesheet" href="/a.css">');
    expect(out).not.toContain('media="print"');
    expect(out).toContain('<div id="root"><!--hero-shell:start--><!--hero-shell:end--></div>');
  });
});

describe('which routes keep the hero shell', () => {
  it('keeps it for the built-in homepage only', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ success: true, data: { page: null } }) })));
    const home = await renderSeoForPath('/', 'https://artifysols.com', 'https://api.example.com/api/v1');
    expect(home.heroShell).toBe(true);
    for (const p of ['/about', '/blog', '/ai-solutions', '/privacy']) {
      expect((await renderSeoForPath(p, 'https://artifysols.com', 'https://api.example.com/api/v1')).heroShell).toBeFalsy();
    }
  });
  it('drops it when a CMS homepage replaces the built-in one', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ success: true, data: { page: { slug: 'home', title: 'Home', seoTitle: 'Home', seoDescription: 'd', blocks: [] } } }) })));
    const home = await renderSeoForPath('/', 'https://artifysols.com', 'https://api.example.com/api/v1');
    expect(home.heroShell).toBeFalsy();
  });
});
