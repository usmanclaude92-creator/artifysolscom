/**
 * Artify blog feature-image design system.
 *
 * Pure functions only (no browser, no file writes), so they can be unit-tested and reused by render.mjs.
 *   lintArticle(article, tokens)  -> string[] of rule violations (empty = ok)
 *   buildHtml(article, tokens, assets) -> full HTML document for one image
 *
 * Layers, bottom to top:  1) background (generated or the built-in gradient)  2) illustration (built-in components)
 *                         3) text (real fonts, exact spelling)  4) the ORIGINAL logo, untouched.
 * The logo is only ever cropped and scaled uniformly: there is deliberately no filter, blend mode, recolour or redraw.
 */
import { artHtml, ART_TYPES } from './art.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Every string the image will show. */
export function visibleText(article) {
  const art = article.art || {};
  const labels = Object.values(art.labels || {}).flat();
  return [article.kicker, ...(article.titleLines || []), article.subtitle, ...labels].filter(Boolean).map(String);
}

export function lintArticle(article, tokens) {
  const problems = [];
  const need = ['slug', 'kicker', 'titleLines', 'subtitle', 'art'];
  for (const k of need) if (!article[k]) problems.push(`missing "${k}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(article.slug || '')) problems.push('slug must be lowercase-hyphenated');
  if (article.art && !ART_TYPES.includes(article.art.type)) problems.push(`unknown art type "${article.art.type}" (use one of: ${ART_TYPES.join(', ')})`);
  if ((article.titleLines || []).length > 4) problems.push('title may use at most 4 lines');
  if ((article.subtitle || '').length > 80) problems.push('subtitle should be 80 characters or fewer');

  const forbidden = [...tokens.forbidden.geography, ...tokens.forbidden.currency];
  const allowGeo = new Set((article.allowTerms || []).map((t) => t.toLowerCase()));
  for (const text of visibleText(article)) {
    const lower = text.toLowerCase();
    for (const term of forbidden) {
      if (allowGeo.has(term)) continue;
      if (new RegExp(`(^|[^a-z])${term}([^a-z]|$)`, 'i').test(lower)) {
        problems.push(`"${text}" contains "${term}": geography and currency are not allowed unless the article lists it in allowTerms`);
      }
    }
    if (/[$€£₹﷼]|\d{3,}|%/.test(text)) problems.push(`"${text}" looks like an invented figure or currency: images must not show made-up numbers`);
  }
  return problems;
}

export function buildHtml(article, tokens, assets) {
  const c = tokens.colors;
  const { width: W, height: H } = tokens.canvas;
  const lines = article.titleLines;
  const hi = article.highlightLine ?? lines.length - 1;
  const title = lines.map((l, i) => (i === hi ? `<span class="hi">${esc(l)}</span>` : esc(l))).join('<br>');
  const lg = tokens.logo.cropBox;
  const scale = tokens.logo.renderWidth / lg.width;
  const logoH = Math.round(lg.height * scale);
  const fontFace = tokens.fonts.weights
    .map((w) => `@font-face{font-family:'AF';font-weight:${w};src:url('${assets.fontsUrl}/plus-jakarta-sans-${w}.woff2') format('woff2')}`)
    .join('');
  const bgLayer = assets.backgroundUrl
    ? `<img class="bg" src="${assets.backgroundUrl}" alt="">`
    : '';

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px}
body{font-family:'AF',sans-serif;color:${c.ink};overflow:hidden;position:relative;
 background:
  radial-gradient(900px 620px at 92% 6%,rgba(124,58,237,.20),transparent 62%),
  radial-gradient(760px 560px at 0% 100%,rgba(6,182,212,.17),transparent 62%),
  radial-gradient(520px 420px at 58% 108%,rgba(192,38,211,.10),transparent 65%),
  linear-gradient(135deg,${c.bgFrom} 0%,${c.bgMid} 52%,${c.bgTo} 100%)}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(79,70,229,.16) 1.2px,transparent 1.4px);background-size:36px 36px;
 -webkit-mask-image:linear-gradient(90deg,transparent 30%,#000 100%);mask-image:linear-gradient(90deg,transparent 30%,#000 100%)}
.logo{position:absolute;left:${tokens.logo.position.left}px;top:${tokens.logo.position.top}px;width:${tokens.logo.renderWidth}px;height:${logoH}px;overflow:hidden}
.logo img{position:absolute;display:block;max-width:none;
 width:${Math.round(1307 * scale)}px;height:${Math.round(700 * scale)}px;left:${-Math.round(lg.x * scale)}px;top:${-Math.round(lg.y * scale)}px}
.left{position:absolute;left:84px;top:236px;width:760px}
.kicker{display:inline-block;font-size:${tokens.type.kicker}px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${c.violet};
 padding:10px 20px;border-radius:999px;background:rgba(124,58,237,.10);border:1.5px solid rgba(124,58,237,.28)}
h1{font-size:${tokens.type.title}px;line-height:1.07;font-weight:700;letter-spacing:-.025em;margin-top:30px;color:${c.ink}}
h1 .hi{background:linear-gradient(90deg,${c.violet},${c.blue} 80%);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{font-size:${tokens.type.subtitle}px;line-height:1.42;font-weight:500;color:${c.inkSoft};margin-top:26px;max-width:660px;text-wrap:balance}
.foot{position:absolute;left:84px;bottom:58px;font-size:${tokens.type.footer}px;font-weight:600;letter-spacing:.05em;color:#8A8FB0}
.art{position:absolute;left:880px;top:104px;width:680px;height:692px}
${artCss(c)}
</style></head><body>
${bgLayer}<div class="dots"></div>
<div class="logo"><img src="${assets.logoUrl}" alt="Artify Solutions"></div>
<div class="left"><span class="kicker">${esc(article.kicker)}</span><h1>${title}</h1><div class="sub">${esc(article.subtitle)}</div></div>
<div class="foot">artifysols.com</div>
<div class="art">${artHtml(article.art, c)}</div>
</body></html>`;
}

function artCss(c) {
  return `
.card{position:absolute;background:rgba(255,255,255,.94);border:1.5px solid rgba(124,58,237,.16);border-radius:24px;box-shadow:0 24px 56px rgba(79,70,229,.15),0 3px 10px rgba(11,18,48,.05)}
.tag{font-size:17px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${c.violet}}
.line{height:11px;border-radius:6px;background:${c.line};margin-top:15px}
.line.v{background:rgba(124,58,237,.35)}
.ok{position:absolute;border-radius:50%;background:linear-gradient(135deg,#34D399,${c.green});display:flex;align-items:center;justify-content:center;box-shadow:0 14px 34px rgba(16,185,129,.38)}
.pill{position:absolute;font-size:19px;font-weight:700;color:${c.violet};background:rgba(124,58,237,.10);border:1.5px solid rgba(124,58,237,.25);border-radius:999px;padding:8px 18px}
.big{font-size:30px;font-weight:700;color:${c.ink}}
.abs{position:absolute}
svg{display:block}
`;
}
