import fs from 'node:fs';
import path from 'node:path';
import postcss, { type AtRule, type ChildNode, type Container, type Rule } from 'postcss';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

/** Classes that are on <html>/<body>/the shell wrapper in the other theme, so their CSS must ship too. */
const ALWAYS_PRESENT = ['theme-light', 'theme-dark', 'bg-[#050505]', 'text-[#F5F5F5]', 'bg-[#F8FAFC]', 'text-slate-900'];

function classesIn(html: string): Set<string> {
  const out = new Set<string>(ALWAYS_PRESENT);
  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) for (const c of m[1]!.split(/\s+/)) if (c) out.add(c);
  return out;
}

function selectorClasses(selector: string): string[] {
  const stripped = selector.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, '');
  return [...stripped.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)].map((m) => m[1]!.replace(/\\(.)/g, '$1'));
}

function ruleIsUsed(rule: Rule, used: Set<string>): boolean {
  return rule.selectors.some((sel) => selectorClasses(sel).every((c) => used.has(c)));
}

function prune(node: Container, used: Set<string>): void {
  node.each((child: ChildNode) => {
    if (child.type === 'rule') {
      if (!ruleIsUsed(child, used)) child.remove();
    } else if (child.type === 'atrule') {
      const at = child as AtRule;
      if (['keyframes', 'font-face', 'property', 'charset', 'import'].includes(at.name.replace(/^-\w+-/, ''))) return;
      if (at.nodes) {
        prune(at, used);
        if (at.nodes.length === 0 && at.name !== 'layer') at.remove();
        else if (at.nodes.length === 0) at.remove();
      }
    }
  });
}

/** The subset of the built stylesheet that the given markup needs, plus the global resets/variables. */
export function criticalCss(css: string, html: string): string {
  const root = postcss.parse(css);
  prune(root, classesIn(html));
  // keep only the keyframes the surviving rules reference
  const body = root.toString();
  root.walkAtRules(/keyframes$/, (kf) => {
    if (!new RegExp(`animation[^;}]*\\b${kf.params}\\b`).test(body)) kf.remove();
  });
  // drop custom properties (and @property registrations) nothing in the surviving CSS reads
  for (let pass = 0; pass < 4; pass++) {
    const text = root.toString();
    const read = new Set([...text.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]!));
    let removed = 0;
    root.walkDecls(/^--/, (d) => {
      if (!read.has(d.prop)) { d.remove(); removed++; }
    });
    root.walkAtRules('property', (a) => {
      if (!read.has(a.params.trim())) { a.remove(); removed++; }
    });
    root.walkRules((r) => { if (r.nodes?.length === 0) r.remove(); });
    root.walkAtRules((a) => { if (a.nodes && a.nodes.length === 0) a.remove(); });
    if (!removed) break;
  }
  return root.toString();
}

/**
 * Renders the real <Hero> to static HTML at build time and inlines it, with only the CSS it needs,
 * into the shell, so "/" paints before any JavaScript. api/index.ts removes it again for every other route.
 */
export function heroShellPlugin() {
  return {
    name: 'hero-shell',
    apply: 'build' as const,
    async closeBundle() {
      const root = path.resolve(__dirname, '..');
      const dist = path.join(root, 'dist');
      const file = ['app-shell.html', 'index.html'].map((f) => path.join(dist, f)).find((f) => fs.existsSync(f));
      if (!file) return;

      const server = await createServer({
        root,
        configFile: false,
        plugins: [react()],
        appType: 'custom',
        logLevel: 'silent',
        server: { middlewareMode: true, hmr: false, watch: null },
        optimizeDeps: { noDiscovery: true, include: [] },
      });
      let markup: string;
      try {
        const mod = await server.ssrLoadModule('/src/components/HeroShell.tsx');
        markup = renderToStaticMarkup(React.createElement(mod.HeroShell));
      } finally {
        await server.close();
      }

      let html = fs.readFileSync(file, 'utf8');
      const cssHref = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"/)?.[1];
      if (!cssHref) throw new Error('hero-shell: built stylesheet link not found');
      const css = criticalCss(fs.readFileSync(path.join(dist, cssHref), 'utf8'), markup + html);

      if (!html.includes('<!--hero-shell:start--><!--hero-shell:end-->') || !html.includes('<!--hero-critical-css-->')) {
        throw new Error('hero-shell: markers missing from the HTML shell');
      }
      // On "/" the full stylesheet must not block the first paint of the prerendered hero (main.tsx waits for it before React renders).
      const blockingLink = html.match(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]+\.css"[^>]*>/)![0];
      html = html.replace(
        blockingLink,
        () =>
          `<!--hero-css:start--><link rel="preload" as="style" crossorigin href="${cssHref}" />` +
          `<link rel="stylesheet" crossorigin href="${cssHref}" id="app-css" media="print" onload="this.media='all'" />` +
          `<noscript>${blockingLink}</noscript><!--hero-css:end-->`
      );
      html = html
        .replace('<!--hero-shell:start--><!--hero-shell:end-->', () => `<!--hero-shell:start-->${markup}<!--hero-shell:end-->`)
        .replace('<!--hero-critical-css-->', () => `<style id="hero-critical">${css}</style>`);
      fs.writeFileSync(file, html);
      console.log(`hero-shell: ${(markup.length / 1024).toFixed(1)} KB markup, ${(css.length / 1024).toFixed(1)} KB critical CSS`);
    },
  };
}
