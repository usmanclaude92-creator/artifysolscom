/**
 * Server-rendered Privacy / Terms / Data Deletion pages (Step 15). Meta's reviewers and crawlers read these URLs without running the SPA, so the
 * text is delivered as plain HTML from the same source as the React pages (src/components/pages/legalContent.ts). Unfilled `{{OWNER: …}}`
 * markers are rendered as visible highlighted placeholders, exactly as in the React page.
 */
import { LEGAL_DOCS, OWNER_MARKER, type LegalDoc, type LegalType } from '../components/pages/legalContent.js';

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const mark = (text: string) => {
  let out = '', last = 0;
  for (const m of text.matchAll(OWNER_MARKER)) {
    out += esc(text.slice(last, m.index)) + `<mark data-owner-confirm="true">[Owner to confirm: ${esc(m[1]!.trim())}]</mark>`;
    last = m.index! + m[0].length;
  }
  return out + esc(text.slice(last));
};

const CSS = 'body{margin:0;background:#f8fafc;color:#0f172a;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}main{max-width:820px;margin:0 auto;padding:32px 20px 64px}h1{font-size:2rem;margin:.2em 0}h2{font-size:1.2rem;margin:1.6em 0 .4em}table{border-collapse:collapse;width:100%;font-size:.9rem}td,th{border:1px solid #cbd5e1;padding:6px 8px;text-align:left;vertical-align:top}mark{background:#fde68a;padding:0 4px;border-radius:3px}nav a{margin-right:14px}a{color:#4c1d95}';

export function renderLegalHtml(type: LegalType, baseUrl: string): string {
  const d: LegalDoc = LEGAL_DOCS[type];
  const body = d.sections.map((s) => `<section><h2>${esc(s.heading)}</h2>${(s.paragraphs ?? []).map((p) => `<p>${mark(p)}</p>`).join('')}${s.bullets ? `<ul>${s.bullets.map((b) => `<li>${mark(b)}</li>`).join('')}</ul>` : ''}${s.table ? `<table><thead><tr>${s.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map((r) => `<tr>${r.map((c) => `<td>${mark(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : ''}</section>`).join('');
  const nav = `<nav aria-label="Legal"><a href="/">Home</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/data-deletion">Data Deletion</a><a href="/data-deletion-status">Deletion request status</a></nav>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.title)} | Artify Solutions</title><meta name="description" content="${esc(d.seoDescription)}"><link rel="canonical" href="${esc(baseUrl + d.path)}"><meta name="robots" content="index,follow"><style>${CSS}</style></head><body><main>${nav}<h1>${esc(d.title)}</h1><p>Effective: ${mark(d.effective)}</p>${d.intro.map((p) => `<p>${mark(p)}</p>`).join('')}${body}</main></body></html>`;
}
