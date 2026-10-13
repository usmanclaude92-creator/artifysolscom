/**
 * The head a crawler reads in the raw HTML (injected by the function) must equal the head the
 * browser ends up with after the page mounts. Both come from src/utils/routeMeta.ts.
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { renderSeoForPath, injectMetaIntoHtml } from '../src/utils/ssrMeta';
import { STATIC_ROUTE_META } from '../src/utils/routeMeta';
import { ServicesPage } from '../src/components/pages/ServicesPage';
import { IndustriesPage } from '../src/components/pages/IndustriesPage';
import { LegalPage } from '../src/components/pages/LegalPage';
import { AiSolutionsPage } from '../src/components/solutions/AiSolutionsPage';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: new Proxy({}, { get: () => () => new Promise(() => {}) }) };
});

const SHELL = `<html><head><title>x</title><meta name="description" content="x" /><meta name="robots" content="index, follow" /><link rel="canonical" href="https://artifysols.com/" /></head><body></body></html>`;
const noop = () => {};

async function rawHead(path: string) {
  const { meta } = await renderSeoForPath(path, 'https://artifysols.com');
  const html = injectMetaIntoHtml(SHELL, meta!);
  const dec = (v: string) => v.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const pick = (re: RegExp) => dec((html.match(re) || [])[1] || '');
  return {
    title: pick(/<title>([^<]*)<\/title>/),
    description: pick(/<meta name="description" content="([^"]*)"/),
    canonical: pick(/<link rel="canonical" href="([^"]*)"/),
    robots: pick(/<meta name="robots" content="([^"]*)"/),
  };
}

function domHead() {
  const get = (sel: string, attr: string) => document.querySelector(sel)?.getAttribute(attr) ?? '';
  return {
    title: document.title,
    description: get('meta[name=description]', 'content'),
    canonical: get('link[rel=canonical]', 'href'),
    robots: get('meta[name=robots]', 'content'),
  };
}

afterEach(() => cleanup());

describe('raw HTML head equals the mounted page head', () => {
  const pages: Array<[string, () => React.ReactElement]> = [
    ['/services', () => <ServicesPage onOpenConsultant={noop} onOpenSolutionBuilder={noop} onNavigateToContact={noop} onNavigateToAiSolutions={noop} />],
    ['/industries', () => <IndustriesPage onOpenSolutionBuilder={noop} onNavigateToContact={noop} />],
    ['/data-deletion-status', () => <LegalPage type="data-deletion-status" />],
    ['/ai-solutions', () => <AiSolutionsPage onSelectProduct={noop} onOpenConsultant={noop} onOpenSolutionBuilder={noop} onNavigateToContact={noop} />],
  ];
  for (const [path, el] of pages) {
    it(path, async () => {
      window.scrollTo = vi.fn() as never;
      render(el());
      const raw = await rawHead(path);
      const dom = domHead();
      expect(raw.title).toBe(dom.title);
      expect(raw.description).toBe(dom.description);
      expect(raw.canonical).toBe(dom.canonical);
      if (STATIC_ROUTE_META[path]!.robots) expect(raw.robots).toBe(dom.robots);
    });
  }

  it('every static route has its own raw title, description and canonical', async () => {
    for (const path of Object.keys(STATIC_ROUTE_META)) {
      const raw = await rawHead(path);
      expect(raw.title, path).not.toBe('x');
      expect(raw.description, path).not.toBe('x');
      const expected = path === '/solutions' ? '/ai-solutions' : path;
      expect(raw.canonical, path).toBe(`https://artifysols.com${expected}`);
    }
    expect((await rawHead('/data-deletion-status')).robots).toBe('noindex, nofollow');
  });
});
