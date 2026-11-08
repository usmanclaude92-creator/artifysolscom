/**
 * "Showcase" layout: dark premium feature image in the Artify product-marketing style.
 *   left   logo, title (white + violet), light lead line, swoosh
 *   right  a tilted glass product window (table / chart / cards / bands) with topic objects overlapping it
 *   bottom a four-item feature strip and a product call-to-action pill
 * Everything is drawn from shapes and the short labels in the article config. No photos, no people, no places,
 * no currency, no made-up figures: table cells are placeholder bars, status pills carry words only.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONS = {
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  shield: '<path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6z"/><path d="M8.8 12.2l2.3 2.3 4.3-4.6"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.6 3-5.4 6-5.4s5.4 1.8 6 5.4"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.8.6 3 2.2 3.4 4.6"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.7 2.7L16.2 9.4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.4 2"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  wallet: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v4"/><path d="M4 7.5V17a2 2 0 0 0 2 2h13V9H6.5A2.5 2.5 0 0 1 4 7.5z"/><circle cx="15.5" cy="14" r="1.1"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  compare: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  pen: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  stamp: '<path d="M9 14h6l-.8-4.6a3 3 0 1 0-4.4 0z"/><path d="M5 18h14v2H5z"/>',
  percent: '<path d="M19 5L5 19"/><circle cx="7.5" cy="7.5" r="2.3"/><circle cx="16.5" cy="16.5" r="2.3"/>',
};
export const ICON_NAMES = Object.keys(ICONS);
const icon = (name, color, size = 44, sw = 1.8) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.check}</svg>`;

const POSITIVE = /^(matched|approved|on track|paid|certified|current|locked|healthy|high|done|verified|posted)$/i;
const WARN = /^(review|in review|rejected|overdue|loss|late|low|held|exception)$/i;
const pill = (text, d) => {
  const [fg, bg] = POSITIVE.test(text) ? [d.green, 'rgba(52,211,153,.16)'] : WARN.test(text) ? [d.amber, 'rgba(251,191,36,.16)'] : [d.blue, 'rgba(59,130,246,.20)'];
  return `<span style="display:inline-block;font-size:15px;font-weight:700;color:${fg};background:${bg};border:1.5px solid ${fg}55;border-radius:999px;padding:6px 16px">${esc(text)}</span>`;
};
const bar = (w, tone = 'rgba(255,255,255,.22)') => `<div style="height:10px;width:${w}%;border-radius:6px;background:${tone}"></div>`;

/* ---------- product window variants (inner content, 640 x 410) ---------- */
function tableBody(dev, d) {
  const heads = dev.headers.map((h) => `<div style="font-size:14px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${d.violetBright}">${esc(h)}</div>`).join('');
  const cols = `grid-template-columns:1.1fr 1fr 1fr 1.1fr`;
  const rows = dev.statuses.map((s, i) => `<div style="display:grid;${cols};gap:18px;align-items:center;padding:19px 0;border-top:1.5px solid rgba(255,255,255,.10)">
      ${bar([78, 64, 72, 58][i % 4])}${bar([60, 74, 52, 68][i % 4])}${bar([46, 58, 66, 40][i % 4], 'rgba(139,92,246,.55)')}<div>${pill(s, d)}</div></div>`).join('');
  return `<div style="display:grid;${cols};gap:18px;padding-bottom:14px">${heads}</div>${rows}`;
}
function chartBody(dev, d) {
  const H = [110, 140, 100, 170, 200, 160, 230, 190, 250, 220, 280, 240, 300];
  const bars = H.map((h, i) => `<div style="position:absolute;left:${14 + i * 46}px;bottom:0;width:28px;height:${h}px;border-radius:8px 8px 0 0;background:linear-gradient(180deg,#A78BFA,#6D28D9);opacity:${i < 8 ? 1 : .55}"></div>`).join('');
  const pts = H.map((h, i) => `${28 + i * 46},${316 - h - 14}`).join(' ');
  const tiles = (dev.tiles || []).map((t) => `<div style="flex:1;border:1.5px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 16px;background:rgba(255,255,255,.05)"><div style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${d.violetBright}">${esc(t)}</div><div style="margin-top:12px">${bar(70, 'rgba(255,255,255,.3)')}</div></div>`).join('');
  return `<div style="display:flex;gap:14px;margin-bottom:18px">${tiles}</div>
    <div style="position:relative;height:300px">${bars}<svg style="position:absolute;left:0;top:-6px" width="640" height="320"><polyline points="${pts}" fill="none" stroke="${d.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div style="position:absolute;left:0;right:0;bottom:-2px;height:2px;background:rgba(255,255,255,.18)"></div></div>`;
}
function cardsBody(dev, d) {
  return `<div style="display:flex;gap:16px">${dev.cards.map((c, i) => `<div style="flex:1;border:1.5px solid rgba(255,255,255,.14);border-radius:18px;padding:20px 18px;background:rgba(255,255,255,.06);height:330px">
    <div style="display:flex;align-items:center;gap:10px">${icon(c.icon, d.violetBright, 26)}<div style="font-size:17px;font-weight:700;color:#fff">${esc(c.label)}</div></div>
    <div style="margin-top:22px;display:grid;gap:15px">${bar(90)}${bar(64)}${bar(78)}${bar(50, 'rgba(139,92,246,.55)')}${bar(70)}</div>
    <div style="margin-top:28px">${pill(c.status, d)}</div></div>`).join('')}</div>`;
}
function bandsBody(dev, d) {
  const cols = [d.green, d.cyan, d.amber, d.red];
  const ws = [92, 76, 54, 34];
  return `<div style="display:grid;gap:20px;padding-top:8px">${dev.bands.map((b, i) => `<div style="height:70px;width:${ws[i]}%;border-radius:18px;background:${cols[i]};opacity:.92;display:flex;align-items:center;padding-left:26px;font-size:26px;font-weight:700;color:#0B1230">${esc(b)}</div>`).join('')}</div>`;
}
const BODIES = { table: tableBody, chart: chartBody, cards: cardsBody, bands: bandsBody };

function windowHtml(dev, d) {
  const side = ['calendar', 'file', 'chart', 'users', 'lock'].map((n, i) => `<div style="width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:${i === 0 ? 'rgba(139,92,246,.28)' : 'transparent'}">${icon(n, i === 0 ? '#C4B5FD' : 'rgba(255,255,255,.45)', 24)}</div>`).join('');
  return `<div class="win" style="position:absolute;left:0;top:0;width:760px;height:540px;border-radius:30px;border:2px solid rgba(167,139,250,.45);background:linear-gradient(160deg,rgba(26,34,92,.92),rgba(12,16,56,.94));box-shadow:0 40px 90px rgba(3,5,25,.65),0 0 70px rgba(124,58,237,.30);transform:perspective(1800px) rotateY(-9deg) rotateX(3deg);transform-origin:50% 50%;overflow:hidden">
    <div style="height:56px;display:flex;align-items:center;gap:9px;padding:0 24px;border-bottom:1.5px solid rgba(255,255,255,.08)">
      <span style="width:12px;height:12px;border-radius:50%;background:#F87171"></span><span style="width:12px;height:12px;border-radius:50%;background:#FBBF24"></span><span style="width:12px;height:12px;border-radius:50%;background:#34D399"></span>
      <span style="margin-left:22px;font-size:19px;font-weight:700;color:#fff">${esc(dev.title)}</span></div>
    <div style="display:flex;height:484px"><div style="width:84px;padding-top:22px;display:grid;gap:10px;justify-items:center;align-content:start;border-right:1.5px solid rgba(255,255,255,.08)">${side}</div>
      <div style="flex:1;padding:26px 30px;overflow:hidden">${BODIES[dev.type](dev, d)}</div></div></div>`;
}

/* ---------- objects that overlap the window ---------- */
const OBJECTS = {
  shield: (d) => `<div style="position:absolute;left:520px;top:410px;width:190px;height:210px">
      <div style="position:absolute;left:-30px;bottom:-10px;width:250px;height:60px;border-radius:50%;border:2px solid rgba(34,211,238,.5);box-shadow:0 0 40px rgba(34,211,238,.45) inset,0 0 40px rgba(34,211,238,.35)"></div>
      <svg width="190" height="210" viewBox="0 0 190 210"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EE7B7"/><stop offset="1" stop-color="#059669"/></linearGradient></defs>
      <path d="M95 6l78 30v58c0 52-34 92-78 108C51 186 17 146 17 94V36z" fill="url(#sg)" stroke="#A7F3D0" stroke-width="4"/>
      <path d="M58 100l26 26 50-54" fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`,
  cheque: (d) => `<div style="position:absolute;left:-40px;top:370px;width:470px;height:240px;border-radius:20px;background:linear-gradient(150deg,#EEF0FF,#C9CEFF);box-shadow:0 30px 60px rgba(3,5,25,.55);transform:rotate(-6deg);padding:26px 30px">
      <div style="height:12px;width:34%;border-radius:6px;background:rgba(11,18,48,.35)"></div>
      <div style="margin-top:34px;height:12px;width:90%;border-radius:6px;background:rgba(11,18,48,.18)"></div><div style="margin-top:20px;height:12px;width:70%;border-radius:6px;background:rgba(11,18,48,.18)"></div>
      <div style="position:absolute;right:28px;top:78px;width:150px;height:50px;border-radius:10px;border:2px solid rgba(11,18,48,.4)"></div>
      <svg style="position:absolute;left:34px;bottom:24px" width="150" height="54" viewBox="0 0 150 54" fill="none" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round"><path d="M4 40c14-34 24-38 28-26s-12 26 6 22 24-30 34-26-8 24 8 20 26-14 40-10"/></svg></div>`,
  calendar: (d) => `<div style="position:absolute;left:400px;top:390px;width:250px;height:230px;border-radius:22px;background:linear-gradient(160deg,#F5F3FF,#DDD6FE);box-shadow:0 30px 60px rgba(3,5,25,.55);transform:rotate(4deg);overflow:hidden">
      <div style="height:54px;background:linear-gradient(90deg,#7C3AED,#6366F1)"></div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:9px;padding:18px 20px">${Array.from({ length: 21 }, (_, i) => `<div style="height:22px;border-radius:7px;background:${i === 10 ? 'linear-gradient(135deg,#8B5CF6,#4F46E5)' : 'rgba(79,70,229,.14)'}"></div>`).join('')}</div></div>`,
  phone: (d) => `<div style="position:absolute;left:30px;top:330px;width:230px;height:330px;border-radius:38px;background:linear-gradient(160deg,#1B2260,#0B1030);border:2.5px solid rgba(167,139,250,.6);box-shadow:0 36px 70px rgba(3,5,25,.65);transform:rotate(-5deg);padding:30px 22px;text-align:center">
      <div style="width:110px;height:110px;margin:12px auto 0;border-radius:50%;background:rgba(52,211,153,.16);border:3px solid ${d.green};display:flex;align-items:center;justify-content:center">${icon('pin', d.green, 54, 2.2)}</div>
      <div style="margin-top:26px;display:grid;gap:12px;justify-items:center">${bar(80)}${bar(56)}</div>
      <div style="position:absolute;left:22px;right:22px;bottom:26px;height:46px;border-radius:14px;background:linear-gradient(90deg,#7C3AED,#3B82F6)"></div></div>`,
  docs: (d) => [2, 1, 0].map((i) => `<div style="position:absolute;left:${20 + i * 34}px;top:${360 + (2 - i) * 22}px;width:300px;height:250px;border-radius:20px;background:rgba(${i === 0 ? '238,240,255,.97' : '201,206,255,.55'});box-shadow:0 24px 50px rgba(3,5,25,.5);padding:24px;transform:rotate(${-4 + i * 3}deg)">${i === 0 ? `<div style="display:grid;gap:14px;margin-top:6px">${bar(88, 'rgba(11,18,48,.28)')}${bar(64, 'rgba(11,18,48,.18)')}${bar(76, 'rgba(11,18,48,.18)')}${bar(50, 'rgba(124,58,237,.45)')}</div>` : ''}</div>`).join('') +
    `<div style="position:absolute;left:300px;top:420px;width:110px;height:110px;border-radius:30px;background:rgba(15,20,70,.92);border:2px solid rgba(167,139,250,.55);display:flex;align-items:center;justify-content:center;box-shadow:0 20px 50px rgba(3,5,25,.55)">${icon('lock', '#C4B5FD', 54, 2)}</div>`,
  receipt: (d) => `<div style="position:absolute;left:10px;top:340px;width:260px;height:310px;border-radius:18px;background:linear-gradient(160deg,#F5F3FF,#E0E7FF);box-shadow:0 30px 60px rgba(3,5,25,.55);transform:rotate(-5deg);padding:26px 24px"><div style="display:grid;gap:15px">${bar(90, 'rgba(11,18,48,.28)')}${bar(66, 'rgba(11,18,48,.18)')}${bar(80, 'rgba(11,18,48,.18)')}${bar(58, 'rgba(11,18,48,.18)')}${bar(74, 'rgba(124,58,237,.45)')}</div><div style="position:absolute;left:24px;bottom:24px;display:flex;align-items:center;gap:10px">${icon('check', '#059669', 38, 2.4)}</div></div>` +
    `<div style="position:absolute;left:330px;top:400px;width:230px;height:220px;border-radius:26px;background:linear-gradient(160deg,#1B2260,#0B1030);border:2px solid rgba(167,139,250,.55);box-shadow:0 30px 60px rgba(3,5,25,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">${icon('wallet', '#C4B5FD', 76, 1.7)}<div style="font-size:20px;font-weight:700;color:#fff">Petty cash</div></div>`,
  stamp: (d) => `<div style="position:absolute;left:30px;top:370px;width:420px;height:240px;border-radius:20px;background:linear-gradient(150deg,#EEF0FF,#C9CEFF);box-shadow:0 30px 60px rgba(3,5,25,.55);transform:rotate(-5deg);padding:26px 30px"><div style="display:grid;gap:16px;margin-top:6px">${bar(60, 'rgba(11,18,48,.3)')}${bar(90, 'rgba(11,18,48,.18)')}${bar(74, 'rgba(11,18,48,.18)')}</div><div style="position:absolute;right:30px;bottom:26px;display:flex;align-items:center;gap:10px;color:#059669;font-weight:800;font-size:26px;letter-spacing:.08em;border:3px solid #059669;border-radius:12px;padding:6px 16px;transform:rotate(-6deg)">${icon('check', '#059669', 30, 2.8)}</div></div>`,
};
export const OBJECT_NAMES = Object.keys(OBJECTS);

/* ---------- page ---------- */
export function showcaseHtml(a, tokens, assets) {
  const d = tokens.dark;
  const { width: W, height: H } = tokens.canvas;
  const lg = tokens.logoDark;
  const fontFace = tokens.fonts.weights.map((w) => `@font-face{font-family:'AF';font-weight:${w};src:url('${assets.fontsUrl}/plus-jakarta-sans-${w}.woff2') format('woff2')}`).join('');
  const white = (a.titleWhite || []).map((l) => `<div>${esc(l)}</div>`).join('');
  const violet = (a.titleViolet || []).map((l) => `<div class="v">${esc(l)}</div>`).join('');
  const features = a.features.map((f, i) => `<div class="feat">${i ? '<span class="div"></span>' : ''}${icon(f.icon, d.violetBright, 46, 1.7)}<span>${esc(f.label).replace(' ', '<br>')}</span></div>`).join('');
  const objects = (a.objects || []).map((o) => OBJECTS[o](d)).join('');
  const bg = assets.backgroundUrl ? `<img class="bgimg" src="${assets.backgroundUrl}" alt="">` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px}
body{font-family:'AF',sans-serif;color:${d.ink};overflow:hidden;position:relative;
 background:radial-gradient(1000px 700px at 90% 8%,rgba(124,58,237,.50),transparent 62%),radial-gradient(900px 600px at 4% 100%,rgba(59,130,246,.34),transparent 62%),linear-gradient(135deg,${d.bgA} 0%,${d.bgB} 56%,${d.bgC} 100%)}
.bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55}
.swoosh{position:absolute;inset:0}
.logo{position:absolute;left:${lg.position.left}px;top:${lg.position.top}px;width:${lg.renderWidth}px;height:auto;display:block}
.title{position:absolute;left:72px;top:176px;width:720px;font-size:76px;line-height:1.06;font-weight:700;letter-spacing:-.025em}
.title .v{background:linear-gradient(90deg,#A78BFA,#8B5CF6 60%,#6366F1);-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{margin-top:20px;font-size:52px;line-height:1.1;font-weight:500;letter-spacing:-.015em;color:#fff}
.under{margin-top:14px}
.hero{position:absolute;left:790px;top:78px;width:780px;height:640px}
.feats{position:absolute;left:72px;top:752px;height:84px;display:flex;align-items:center}
.feat{display:flex;align-items:center;gap:14px;font-size:19px;line-height:1.22;font-weight:600;color:#fff;padding-right:30px}
.feat .div{width:2px;height:64px;background:rgba(167,139,250,.35);margin-right:30px}
.cta{position:absolute;right:56px;top:752px;height:84px;padding:0 34px;display:flex;align-items:center;border:2.5px solid #8B5CF6;border-radius:999px;background:rgba(124,58,237,.14);font-size:22px;line-height:1.28;font-weight:600;color:#fff;box-shadow:0 0 36px rgba(124,58,237,.35)}
.cta b{color:#A78BFA;font-weight:700}
</style></head><body>${bg}
<svg class="swoosh" viewBox="0 0 ${W} ${H}" fill="none"><path d="M-40 700C260 610 420 880 760 760S1180 520 1700 640" stroke="rgba(139,92,246,.30)" stroke-width="2.5"/><path d="M-40 740C300 660 460 900 800 800S1200 560 1700 690" stroke="rgba(59,130,246,.22)" stroke-width="2"/><path d="M820 -20C940 120 1200 60 1700 220" stroke="rgba(167,139,250,.20)" stroke-width="2"/></svg>
<img class="logo" src="${assets.logoDarkUrl}" alt="Artify Solutions">
<div class="title">${white}${violet}<div class="lead">${esc(a.lead)}</div>
 <svg class="under" width="300" height="22" viewBox="0 0 300 22" fill="none"><path d="M4 16C70 4 150 2 296 10" stroke="#8B5CF6" stroke-width="5" stroke-linecap="round"/></svg></div>
<div class="hero">${windowHtml(a.device, d)}${objects}</div>
<div class="feats">${features}</div>
<div class="cta"><span>${esc(a.cta.pre)}<br><b>${esc(a.cta.brand)}</b></span></div>
</body></html>`;
}
