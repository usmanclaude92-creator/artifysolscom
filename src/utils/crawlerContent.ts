/**
 * Server-sent page content for crawlers that do not run JavaScript (most AI answer engines, social scrapers, some SEO tools).
 *
 * The app is a client-rendered SPA, so the HTML a bot downloads used to have an empty <div id="root">. This module builds a plain,
 * semantic copy of each page's real content (headings, text, links) that api/index.ts places inside #root. React replaces it the
 * moment the app mounts, so visitors never see it: it is clipped off-screen rather than hidden, which keeps it readable by
 * crawlers and screen readers and costs no layout shift. It only ever repeats text the page itself shows; nothing is invented.
 */
import { CRAWLER_SNAPSHOTS } from '../data/crawlerSnapshots.js';
import type { PublicCaseStudy, PublicPage, PublicPost, PublicProduct } from '../lib/publicApi.js';

const MAX_BLOCKS_CHARS = 14000;

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * CMS bodies are authored by signed-in staff, but this is still the one place HTML from the database reaches the document
 * unescaped, so it is reduced to inert markup: no script/style/embed elements, no event handlers, no javascript: or data: URLs.
 */
export function sanitizeBodyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|form|svg|math|link|meta|base)\b[\s\S]*?(<\/\1\s*>|$)/gi, '')
    .replace(/<\/?(script|style|iframe|object|embed|form|svg|math|link|meta|base)\b[^>]*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(href|src|xlink:href|formaction|srcdoc)\s*=\s*("\s*(javascript|data|vbscript):[^"]*"|'\s*(javascript|data|vbscript):[^']*')/gi, '');
}

/** Wraps page content for placement inside #root: off-screen, still in the document flow of the accessibility tree. */
export function wrapCrawlerContent(innerHtml: string): string {
  return `<div data-ssr-content style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:normal">${innerHtml}</div>`;
}

const plain = (s: string | null | undefined) => (s ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const dateLine = (iso: string | null | undefined, label: string) =>
  iso && !isNaN(new Date(iso).getTime()) ? `<p>${label} <time datetime="${escapeHtml(new Date(iso).toISOString())}">${new Date(iso).toISOString().slice(0, 10)}</time></p>` : '';

export function postContentHtml(post: PublicPost): string {
  const author = post.author?.name || 'Artify Solutions Team';
  return `<article>
<h1>${escapeHtml(post.title)}</h1>
<p>By ${escapeHtml(author)}</p>
${dateLine(post.publishedAt, 'Published')}${dateLine(post.updatedAt, 'Updated')}
${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ''}
${sanitizeBodyHtml(post.body || '')}
</article>
<nav><a href="/blog">All articles</a> · <a href="/">Artify Solutions home</a></nav>`;
}

export function pageContentHtml(page: PublicPage): string {
  return `<article><h1>${escapeHtml(page.title)}</h1>${page.excerpt ? `<p>${escapeHtml(page.excerpt)}</p>` : ''}${sanitizeBodyHtml(page.body || '')}</article>`;
}

export function caseStudyContentHtml(cs: PublicCaseStudy): string {
  const section = (heading: string, text: string | null) => (plain(text) ? `<h2>${heading}</h2><p>${escapeHtml(plain(text))}</p>` : '');
  return `<article>
<h1>${escapeHtml(cs.title)}</h1>
${cs.clientName ? `<p>Client: ${escapeHtml(cs.clientName)}</p>` : ''}${cs.industry ? `<p>Industry: ${escapeHtml(cs.industry.name)}</p>` : ''}
${cs.excerpt ? `<p>${escapeHtml(cs.excerpt)}</p>` : ''}
${section('Challenge', cs.challenge)}${section('Solution', cs.solutionApproach)}${section('Implementation', cs.implementation)}${section('Results', cs.results)}
${sanitizeBodyHtml(cs.body || '')}
</article>`;
}

export function productContentHtml(product: PublicProduct): string {
  const list = (heading: string, items?: string[]) =>
    items && items.length ? `<h2>${heading}</h2><ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : '';
  return `<article>
<h1>${escapeHtml(product.name)}</h1>
<p>${escapeHtml(product.shortDescription)}</p>
${plain(product.description) ? `<p>${escapeHtml(plain(product.description))}</p>` : ''}
${product.businessProblem ? `<h2>The problem it solves</h2><p>${escapeHtml(plain(product.businessProblem))}</p>` : ''}
${list('Benefits', product.benefits)}${list('Features', product.features)}
</article>`;
}

/** A list of links, or nothing at all when there is nothing to list. */
const listOrNothing = (items: string[]) => (items.length > 0 ? `<ul>${items.join('')}</ul>` : '');

export function blogArchiveContentHtml(posts: PublicPost[]): string {
  return `<h1>Intelligence Feed &amp; Research Articles</h1>
${listOrNothing(posts
    .map((p) => `<li><a href="/blog/${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a>${p.excerpt ? ` — ${escapeHtml(p.excerpt)}` : ''}</li>`))}`;
}

export function productCatalogContentHtml(products: PublicProduct[]): string {
  return `<h1>AI Solutions &amp; Product Catalog</h1>
${listOrNothing(
    products.map((p) => `<li><a href="/ai-solutions/${encodeURIComponent(p.slug)}">${escapeHtml(p.name)}</a> — ${escapeHtml(p.shortDescription)}</li>`)
  )}`;
}

export function caseStudyIndexContentHtml(items: { slug: string; title: string; excerpt: string | null }[]): string {
  return `<h1>Enterprise AI Case Studies</h1>
${listOrNothing(
    items.map((c) => `<li><a href="/case-studies/${encodeURIComponent(c.slug)}">${escapeHtml(c.title)}</a>${c.excerpt ? ` — ${escapeHtml(c.excerpt)}` : ''}</li>`)
  )}`;
}

/** The visible copy of a static page, from src/data/crawlerSnapshots.ts (regenerate with scripts/snapshot-crawler-text.mjs). */
export function staticPageContentHtml(path: string): string | null {
  const blocks = CRAWLER_SNAPSHOTS[path];
  if (!blocks || blocks.length === 0) return null;
  let used = 0;
  const out: string[] = [];
  let inList = false;
  for (const b of blocks) {
    if (used + b.text.length > MAX_BLOCKS_CHARS) break;
    used += b.text.length;
    const tag = ['h1', 'h2', 'h3', 'p', 'li'].includes(b.tag) ? b.tag : 'p';
    if (tag === 'li' && !inList) {
      out.push('<ul>');
      inList = true;
    } else if (tag !== 'li' && inList) {
      out.push('</ul>');
      inList = false;
    }
    out.push(`<${tag}>${escapeHtml(b.text)}</${tag}>`);
  }
  if (inList) out.push('</ul>');
  return out.join('\n');
}

/** Puts `contentHtml` inside the (otherwise empty) root of an HTML document; a no-op when the root anchor is missing. */
export function injectContentIntoHtml(html: string, contentHtml: string): string {
  return html.replace('<!--hero-shell:start--><!--hero-shell:end-->', () => `<!--hero-shell:start--><!--hero-shell:end-->${wrapCrawlerContent(contentHtml)}`);
}
