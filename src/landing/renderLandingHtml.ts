/**
 * Landing page renderer (Step 12): turns the Control Center's public landing projection into a standalone HTML document.
 * Server-rendered, no React bundle, no inline script. Every text value is HTML-escaped; links and image URLs are re-validated
 * here even though the API already validated them (defence in depth). See Artify-Backend docs/MARKETING_LANDING_PAGES.md.
 */

export interface LandingMedia { url: string; alt: string; width: number | null; height: number | null }
export interface LandingBlock { id: string; type: string; props: Record<string, any> }
export interface LandingPageData {
  slug: string;
  title: string;
  seo: { title: string; description: string | null; noindex: boolean; ogImageUrl: string | null };
  blocks: LandingBlock[];
  media: Record<string, LandingMedia>;
  updatedAt: string;
  preview: boolean;
}

export const LANDING_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** https://…, /path, #anchor, mailto:, tel: only. Anything else renders as "#". */
export function safeHref(raw: unknown): string {
  const v = String(raw ?? '').trim();
  if (!v || /[\s\u0000-\u001f]/.test(v)) return '#';
  if (v.startsWith('#')) return v.length > 1 ? v : '#';
  if (v.startsWith('/')) return v.startsWith('//') || v.includes('\\') ? '#' : v;
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(v) || /^tel:\+?[0-9()\-.\s]{3,30}$/i.test(v)) return v;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' && u.hostname ? u.toString() : '#';
  } catch {
    return '#';
  }
}

const isExternal = (href: string) => /^https:/i.test(href);
const link = (cta: { label?: string; href?: string } | undefined, cls: string) => {
  if (!cta?.label) return '';
  const href = safeHref(cta.href);
  return `<a class="btn ${cls}" href="${esc(href)}"${isExternal(href) ? ' rel="noopener noreferrer"' : ''}>${esc(cta.label)}</a>`;
};

function image(media: Record<string, LandingMedia>, ref: { mediaId?: string; alt?: string } | undefined, opts: { eager?: boolean; cls?: string } = {}): string {
  if (!ref?.mediaId) return '';
  const m = media[ref.mediaId];
  if (!m || !/^https:\/\//i.test(m.url)) return '';
  const size = m.width && m.height ? ` width="${Number(m.width)}" height="${Number(m.height)}"` : '';
  const loading = opts.eager ? ' fetchpriority="high"' : ' loading="lazy"';
  return `<img class="${opts.cls ?? 'media'}" src="${esc(m.url)}" alt="${esc(ref.alt ?? m.alt)}"${size}${loading} decoding="async">`;
}

function hero(b: LandingBlock, media: Record<string, LandingMedia>): string {
  const p = b.props;
  const img = image(media, p.image, { eager: true, cls: 'hero-img' });
  return `<section class="hero" aria-labelledby="${esc(b.id)}-h"><div class="wrap hero-grid"><div>
${p.eyebrow ? `<p class="eyebrow">${esc(p.eyebrow)}</p>` : ''}<h1 id="${esc(b.id)}-h">${esc(p.headline)}</h1>
${p.subheadline ? `<p class="lead">${esc(p.subheadline)}</p>` : ''}<div class="actions">${link(p.primaryCta, 'btn-primary')}${link(p.secondaryCta, 'btn-secondary')}</div>
</div>${img ? `<div>${img}</div>` : ''}</div></section>`;
}

function benefits(b: LandingBlock): string {
  const p = b.props;
  return `<section class="band" aria-labelledby="${esc(b.id)}-h"><div class="wrap"><h2 id="${esc(b.id)}-h">${esc(p.heading)}</h2>
<ul class="cards">${(p.items ?? []).map((i: any) => `<li class="card"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></li>`).join('')}</ul></div></section>`;
}

function features(b: LandingBlock, media: Record<string, LandingMedia>): string {
  const p = b.props;
  return `<section aria-labelledby="${esc(b.id)}-h"><div class="wrap"><h2 id="${esc(b.id)}-h">${esc(p.heading)}</h2>${p.intro ? `<p class="lead">${esc(p.intro)}</p>` : ''}
<ul class="features">${(p.items ?? []).map((i: any) => `<li class="feature"><div><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>${image(media, i.image)}</li>`).join('')}</ul></div></section>`;
}

function testimonials(b: LandingBlock, media: Record<string, LandingMedia>): string {
  const p = b.props;
  return `<section class="band" aria-labelledby="${esc(b.id)}-h"><div class="wrap"><h2 id="${esc(b.id)}-h">${esc(p.heading)}</h2>
<ul class="cards">${(p.items ?? []).map((i: any) => `<li class="card"><figure><blockquote><p>${esc(i.quote)}</p></blockquote><figcaption><strong>${esc(i.authorName)}</strong>${i.authorRole || i.company ? `<br><span class="muted">${esc([i.authorRole, i.company].filter(Boolean).join(', '))}</span>` : ''}</figcaption></figure></li>`).join('')}</ul></div></section>`;
}

function pricing(b: LandingBlock): string {
  const p = b.props;
  return `<section aria-labelledby="${esc(b.id)}-h"><div class="wrap"><h2 id="${esc(b.id)}-h">${esc(p.heading)}</h2>${p.intro ? `<p class="lead">${esc(p.intro)}</p>` : ''}
<ul class="cards">${(p.plans ?? []).map((pl: any) => `<li class="card${pl.highlighted ? ' highlight' : ''}"><h3>${esc(pl.name)}</h3><p class="price">${esc(pl.price)}${pl.period ? ` <span class="muted">${esc(pl.period)}</span>` : ''}</p>
${pl.description ? `<p>${esc(pl.description)}</p>` : ''}${(pl.features ?? []).length ? `<ul class="ticks">${pl.features.map((f: string) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}${link(pl.cta, pl.highlighted ? 'btn-primary' : 'btn-secondary')}</li>`).join('')}</ul>
${p.footnote ? `<p class="muted small">${esc(p.footnote)}</p>` : ''}</div></section>`;
}

function faq(b: LandingBlock): string {
  const p = b.props;
  return `<section class="band" aria-labelledby="${esc(b.id)}-h"><div class="wrap narrow"><h2 id="${esc(b.id)}-h">${esc(p.heading)}</h2>
${(p.items ?? []).map((i: any) => `<details><summary>${esc(i.question)}</summary><p>${esc(i.answer)}</p></details>`).join('')}</div></section>`;
}

function cta(b: LandingBlock): string {
  const p = b.props;
  return `<section class="cta" aria-labelledby="${esc(b.id)}-h"><div class="wrap narrow center"><h2 id="${esc(b.id)}-h">${esc(p.heading)}</h2>${p.text ? `<p class="lead">${esc(p.text)}</p>` : ''}${link(p.cta, 'btn-inverse')}</div></section>`;
}

function field(f: any, id: string): string {
  const req = f.required ? ' required aria-required="true"' : '';
  const label = `<label for="${id}">${esc(f.label)}${f.required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>`;
  const name = esc(f.key);
  if (f.type === 'textarea') return `<div class="field">${label}<textarea id="${id}" name="${name}" rows="4" maxlength="5000"${req}></textarea></div>`;
  if (f.type === 'select') {
    return `<div class="field">${label}<select id="${id}" name="${name}"${req}><option value="">Choose…</option>${(f.options ?? []).map((o: any) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select></div>`;
  }
  const type = f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'text';
  const ac = f.key === 'email' ? 'email' : f.key === 'phone' ? 'tel' : f.key === 'name' ? 'name' : f.key === 'company' ? 'organization' : 'off';
  return `<div class="field">${label}<input id="${id}" name="${name}" type="${type}" maxlength="500" autocomplete="${ac}"${req}></div>`;
}

function form(b: LandingBlock, ctx: { slug: string; apiBase: string | null; preview: boolean }): string {
  const p = b.props;
  const consent = p.consent?.enabled
    ? `<div class="field consent"><input id="${esc(b.id)}-consent" name="consent" type="checkbox" value="true" required aria-required="true"><label for="${esc(b.id)}-consent">${esc(p.consent.text)} <a href="${esc(safeHref(p.consent.privacyUrl))}">Privacy policy</a></label></div>`
    : '';
  const action = ctx.preview ? '' : ` method="post" action="/lp/${esc(ctx.slug)}/submit"`;
  return `<section class="band" id="contact" aria-labelledby="${esc(b.id)}-h"><div class="wrap narrow"><h2 id="${esc(b.id)}-h">${esc(p.heading)}</h2>${p.intro ? `<p class="lead">${esc(p.intro)}</p>` : ''}
${ctx.preview ? '<p class="notice" role="note">Preview: the form is disabled here.</p>' : ''}
<form id="lp-form" class="form"${action}${ctx.apiBase ? ` data-api="${esc(ctx.apiBase)}"` : ''} data-slug="${esc(ctx.slug)}" novalidate${ctx.preview ? ' data-preview="1"' : ''}>
<fieldset${ctx.preview ? ' disabled' : ''}><legend class="sr">${esc(p.heading)}</legend>
${(p.fields ?? []).map((f: any, i: number) => field(f, `${esc(b.id)}-f${i}`)).join('')}
<div class="hp" aria-hidden="true"><label>Leave this field empty<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
${consent}<button class="btn btn-primary" type="submit">${esc(p.submitLabel || 'Send')}</button></fieldset>
<div id="lp-status" role="status" aria-live="polite" class="status"></div></form></div></section>`;
}

function footer(b: LandingBlock): string {
  const p = b.props;
  const links = (p.links ?? []).map((l: any) => `<a href="${esc(safeHref(l.href))}">${esc(l.label)}</a>`).join('');
  return `<footer class="foot"><div class="wrap">${p.text ? `<p>${esc(p.text)}</p>` : ''}${links ? `<nav aria-label="Footer">${links}</nav>` : ''}${p.copyright ? `<p class="muted small">${esc(p.copyright)}</p>` : ''}</div></footer>`;
}

const CSS = `
:root{--brand:#7C3AED;--brand-h:#6D28D9;--brand-s:#EDE9FE;--ink:#0F172A;--muted:#475569;--line:#E2E8F0;--bg:#fff;--alt:#F8FAFC}
*,*::before,*::after{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6;font-size:1rem}
.wrap{max-width:68rem;margin:0 auto;padding:0 1rem}.narrow{max-width:44rem}.center{text-align:center}
a{color:var(--brand-h)}a:hover{color:var(--brand)}
:focus-visible{outline:3px solid var(--brand);outline-offset:2px;border-radius:4px}
.skip{position:absolute;left:-999px;top:0;background:#fff;color:var(--ink);padding:.5rem 1rem;z-index:10}.skip:focus{left:0}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.top{border-bottom:1px solid var(--line)}.top .wrap{display:flex;align-items:center;min-height:3.5rem}.top img{height:28px;width:auto;display:block}
h1,h2,h3{line-height:1.2;margin:0 0 .75rem;font-weight:700;letter-spacing:-.01em}
h1{font-size:clamp(2rem,6vw,3.25rem)}h2{font-size:clamp(1.5rem,4vw,2.25rem)}h3{font-size:1.125rem}
section{padding:3rem 0}.band{background:var(--alt)}
.hero{padding:3rem 0 3.5rem;background:linear-gradient(180deg,var(--brand-s),#fff)}.hero-grid{display:grid;gap:2rem;align-items:center}
.eyebrow{color:var(--brand-h);font-weight:700;text-transform:uppercase;font-size:.8125rem;letter-spacing:.06em;margin:0 0 .5rem}
.lead{font-size:1.125rem;color:var(--muted);margin:0 0 1.25rem}.muted{color:var(--muted)}.small{font-size:.875rem}
.actions{display:flex;flex-wrap:wrap;gap:.75rem}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:2.75rem;padding:.625rem 1.25rem;border-radius:.75rem;font-weight:700;font-size:1rem;text-decoration:none;border:2px solid transparent;cursor:pointer;font-family:inherit}
.btn-primary{background:var(--brand);color:#fff}.btn-primary:hover{background:var(--brand-h);color:#fff}
.btn-secondary{background:#fff;color:var(--brand-h);border-color:var(--brand)}.btn-secondary:hover{background:var(--brand-s);color:var(--brand-h)}
.btn-inverse{background:#fff;color:var(--brand-h)}.btn-inverse:hover{background:var(--brand-s);color:var(--brand-h)}
.cards{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:1rem}
.card{background:#fff;border:1px solid var(--line);border-radius:1rem;padding:1.25rem}.card.highlight{border:2px solid var(--brand)}.card p{margin:.25rem 0 .75rem;color:var(--muted)}
.price{font-size:1.75rem;font-weight:700;color:var(--ink)!important}
.ticks{margin:.5rem 0 1rem;padding-left:1.25rem}
.features{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:1.5rem}.feature{display:grid;gap:1rem;align-items:center}.feature p{color:var(--muted);margin:0}
.media,.hero-img{max-width:100%;height:auto;border-radius:1rem;display:block}
blockquote{margin:0 0 .75rem;font-size:1.0625rem}blockquote p{color:var(--ink)!important;margin:0!important}figure{margin:0}
details{background:#fff;border:1px solid var(--line);border-radius:.75rem;padding:.75rem 1rem;margin:.5rem 0}summary{font-weight:700;cursor:pointer}details p{margin:.5rem 0 0;color:var(--muted)}
.cta{background:var(--brand);color:#fff}.cta .lead{color:#F5F3FF}.cta a:focus-visible{outline-color:#fff}
.form{margin-top:1.25rem}fieldset{border:0;padding:0;margin:0}.field{margin-bottom:1rem}.field label{display:block;font-weight:600;margin-bottom:.25rem}
.field input[type=text],.field input[type=email],.field input[type=tel],.field textarea,.field select{width:100%;padding:.625rem .75rem;border:1px solid #94A3B8;border-radius:.625rem;font:inherit;background:#fff;color:var(--ink)}
.field input[aria-invalid=true],.field textarea[aria-invalid=true],.field select[aria-invalid=true]{border-color:#B91C1C}
.req{color:#B91C1C}.consent{display:flex;gap:.625rem;align-items:flex-start}.consent input{margin-top:.35rem;width:1.125rem;height:1.125rem}.consent label{font-weight:400;margin:0}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.status{margin-top:1rem;font-weight:600}.status.ok{color:#047857}.status.err{color:#B91C1C}
.notice{background:#FEF3C7;color:#78350F;padding:.5rem .75rem;border-radius:.5rem}
.foot{border-top:1px solid var(--line);padding:2rem 0;font-size:.9375rem}.foot nav{display:flex;flex-wrap:wrap;gap:1rem;margin:.5rem 0}
.previewbar{background:#1E1B4B;color:#fff;text-align:center;padding:.5rem 1rem;font-size:.875rem}
@media(min-width:48rem){.hero-grid{grid-template-columns:1.1fr .9fr}.cards{grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))}.feature{grid-template-columns:1fr 1fr}.wrap{padding:0 1.5rem}}
@media(prefers-reduced-motion:no-preference){.btn{transition:background-color .15s,color .15s}}
`;

export interface RenderContext { baseUrl: string; apiBase: string | null }

/** Content-Security-Policy for landing pages: no inline script, same-origin script, API origin for the form and beacon. */
export function landingCsp(apiBase: string | null): string {
  let connect = "'self'";
  try { if (apiBase) connect += ' ' + new URL(apiBase).origin; } catch { /* ignore a malformed base */ }
  return [
    "default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "font-src https://fonts.gstatic.com",
    "img-src 'self' https: data:", `connect-src ${connect}`, "form-action 'self'", "base-uri 'none'", "frame-ancestors 'none'", "object-src 'none'",
  ].join('; ');
}

export function renderLandingHtml(page: LandingPageData, ctx: RenderContext): string {
  const base = ctx.baseUrl.replace(/\/+$/, '');
  const canonical = `${base}/lp/${page.slug}`;
  const heroBlock = page.blocks.find((b) => b.type === 'lp_hero');
  const heroMedia = heroBlock?.props.image?.mediaId ? page.media[heroBlock.props.image.mediaId] : undefined;
  const ogImage = page.seo.ogImageUrl || heroMedia?.url || `${base}/og-banner.jpg`;
  const robots = page.preview || page.seo.noindex ? 'noindex, nofollow' : 'index, follow';
  const desc = page.seo.description || '';
  const body = page.blocks
    .map((b) => {
      switch (b.type) {
        case 'lp_hero': return hero(b, page.media);
        case 'lp_benefits': return benefits(b);
        case 'lp_features': return features(b, page.media);
        case 'lp_testimonials': return testimonials(b, page.media);
        case 'lp_pricing': return pricing(b);
        case 'lp_faq': return faq(b);
        case 'lp_cta': return cta(b);
        case 'lp_form': return form(b, { slug: page.slug, apiBase: ctx.apiBase, preview: page.preview });
        case 'lp_footer': return footer(b);
        default: return ''; // unknown block types are never rendered
      }
    })
    .join('\n');
  const hasFooter = page.blocks.some((b) => b.type === 'lp_footer');
  const scriptTag = `<script src="/lp.js" defer${page.preview ? ' data-preview="1"' : ''}${ctx.apiBase ? ` data-api="${esc(ctx.apiBase)}"` : ''}></script>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.seo.title)}</title>
${desc ? `<meta name="description" content="${esc(desc)}">` : ''}
<meta name="robots" content="${robots}">
${page.preview ? '<meta name="referrer" content="no-referrer">' : ''}<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Artify Solutions">
<meta property="og:title" content="${esc(page.seo.title)}">${desc ? `\n<meta property="og:description" content="${esc(desc)}">` : ''}
<meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.seo.title)}">${desc ? `\n<meta name="twitter:description" content="${esc(desc)}">` : ''}
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="theme-color" content="#7C3AED">
<link rel="icon" href="/favicon.ico"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap">
<style>${CSS}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${page.preview ? '<div class="previewbar" role="note">Private preview of the saved draft. Not public, not indexed.</div>' : ''}
<header class="top"><div class="wrap"><a href="/" aria-label="Artify Solutions home"><img src="/logo-header-light.webp" alt="Artify Solutions" width="140" height="28"></a></div></header>
<main id="main">
${body}
</main>
${hasFooter ? '' : '<footer class="foot"><div class="wrap"><p class="muted small">&copy; Artify Solutions</p></div></footer>'}
${scriptTag}
</body>
</html>`;
}

export function renderMessagePage(opts: { title: string; heading: string; text: string; baseUrl: string; homeLabel?: string; backHref?: string }): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title)}</title><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#7C3AED">
<style>${CSS}</style></head>
<body><main id="main" class="wrap narrow" style="padding:4rem 1rem"><h1>${esc(opts.heading)}</h1><p class="lead">${esc(opts.text)}</p>
${opts.backHref ? `<p><a class="btn btn-secondary" href="${esc(safeHref(opts.backHref))}">Go back</a></p>` : ''}
<p><a class="btn btn-primary" href="/">${esc(opts.homeLabel ?? 'Go to artifysols.com')}</a></p></main></body></html>`;
}
