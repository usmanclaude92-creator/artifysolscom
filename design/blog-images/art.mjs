/**
 * Illustration components for the Artify blog feature-image system. Each returns HTML for a 680 x 692 art box.
 * They draw only generic shapes and the short labels the article config supplies: no logos, no people, no places,
 * no currency, no invented figures.
 */
export const ART_TYPES = [
  'flow3', 'bars', 'cheque-calendar', 'doc-boq', 'phone-flow',
  'approval-pair', 'ipc-progress', 'bands', 'doc-versions', 'receipt-phone',
];

const CHECK = (s = 46) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const W = [92, 70, 84, 58];
const lines = (n, from = 0, cls = '') => Array.from({ length: n }, (_, i) => `<div class="line ${cls}" style="width:${W[(i + from) % 4]}%"></div>`).join('');
const card = (x, y, w, h, tag, body = '', extra = '') =>
  `<div class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;padding:26px 28px;${extra}">${tag ? `<div class="tag">${tag}</div>` : ''}${body}</div>`;
const ok = (x, y, s = 92) => `<div class="ok" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px">${CHECK(Math.round(s * 0.5))}</div>`;
const arrow = (x, y, w = 70) =>
  `<svg class="abs" style="left:${x}px;top:${y}px" width="${w}" height="30" viewBox="0 0 ${w} 30" fill="none"><path d="M2 15h${w - 14}" stroke="#7C3AED" stroke-width="4" stroke-linecap="round"/><path d="M${w - 22} 4l16 11-16 11" stroke="#7C3AED" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const L = (art, key, i) => {
  const v = (art.labels || {})[key];
  return Array.isArray(v) ? v[i] ?? '' : v ?? '';
};

const builders = {
  'flow3': (a) =>
    card(0, 20, 340, 236, L(a, 'cards', 0), lines(4)) +
    card(330, 160, 340, 236, L(a, 'cards', 1), lines(4, 1)) +
    card(0, 400, 340, 236, L(a, 'cards', 2), lines(4, 2)) +
    ok(520, 470, 118),

  'bars': (a) => {
    const H = [120, 150, 110, 180, 210, 170, 240, 200, 260, 230, 290, 250, 310];
    const bars = H.map((h, i) => `<div class="abs" style="left:${40 + i * 47}px;bottom:78px;width:30px;height:${h}px;border-radius:9px 9px 0 0;background:linear-gradient(180deg,#A78BFA,#6D28D9);opacity:${i < 8 ? 1 : 0.55}"></div>`).join('');
    const pts = H.map((h, i) => `${55 + i * 47},${530 - h - 20}`).join(' ');
    return `<div class="card" style="left:0;top:70px;width:680px;height:560px">
      <div class="tag" style="position:absolute;left:40px;top:30px">${L(a, 'tag', 0)}</div>${bars}
      <svg class="abs" style="left:0;top:0" width="680" height="560"><polyline points="${pts}" fill="none" stroke="#10B981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="abs" style="left:40px;right:40px;bottom:76px;height:2px;background:#E3E1F5"></div></div>`;
  },

  'cheque-calendar': (a) => {
    const tiles = [0, 1, 2, 3].map((i) =>
      `<div class="card" style="left:${i * 172}px;top:440px;width:150px;height:150px;border-radius:22px;text-align:center;padding-top:30px">
        <div style="font-size:26px;font-weight:700;letter-spacing:.1em;color:#7C3AED;text-transform:uppercase">${L(a, 'months', i)}</div>
        <div class="abs" style="left:54px;top:88px;width:42px;height:42px;border-radius:50%;background:${i === 2 ? 'linear-gradient(135deg,#34D399,#10B981)' : 'rgba(124,58,237,.14)'}"></div></div>`).join('');
    return card(0, 90, 660, 290, L(a, 'tag', 0),
      `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:22px"><div class="line" style="width:50%;margin:0"></div><div class="pill" style="position:static">${L(a, 'pill', 0)}</div></div>
       <div class="line" style="width:86%;margin-top:40px"></div><div class="line" style="width:58%"></div>
       <div class="abs" style="right:30px;bottom:26px;width:150px;height:48px;border-radius:12px;background:rgba(124,58,237,.12)"></div>`) + tiles + ok(570, 30, 92);
  },

  'doc-boq': (a) => {
    const rows = [0, 1, 2, 3, 4].map(() => `<div style="display:flex;gap:14px;margin-top:16px"><div class="line" style="width:44%;margin:0"></div><div class="line" style="width:18%;margin:0"></div><div class="line v" style="width:24%;margin:0"></div></div>`).join('');
    const bars = [60, 92, 70, 124, 102, 146].map((h) => `<div style="flex:1;height:${h}px;border-radius:7px 7px 0 0;background:linear-gradient(180deg,#A78BFA,#6D28D9)"></div>`).join('');
    return card(0, 40, 420, 580, L(a, 'a', 0), lines(8)) +
      card(280, 150, 400, 440, L(a, 'b', 0), `${rows}<div class="abs" style="left:28px;right:28px;bottom:30px;display:flex;gap:12px;align-items:flex-end">${bars}</div>`);
  },

  'phone-flow': (a) =>
    `<div class="card" style="left:0;top:30px;width:270px;height:560px;border-radius:44px;padding:36px 26px">
       <div class="tag" style="text-align:center">${L(a, 'phone', 0)}</div>
       <div style="margin:34px auto 0;width:160px;height:160px;border-radius:50%;background:rgba(16,185,129,.12);border:3px solid #10B981;display:flex;align-items:center;justify-content:center">
         <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.4" stroke-linecap="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg></div>
       <div class="line" style="width:78%;margin:38px auto 0"></div><div class="line" style="width:58%;margin:15px auto 0"></div></div>` +
    card(320, 50, 360, 250, L(a, 'b', 0),
      `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:11px;margin-top:24px">${Array.from({ length: 21 }, (_, i) => `<div style="height:32px;border-radius:9px;background:${[9, 10, 11].includes(i) ? 'rgba(124,58,237,.6)' : '#ECEAF8'}"></div>`).join('')}</div>`) +
    card(320, 350, 360, 240, L(a, 'c', 0), `${lines(3)}<div class="abs" style="right:28px;bottom:24px;font-size:34px;font-weight:700;color:#10B981">${L(a, 'ok', 0)}</div>`),

  'approval-pair': (a) => {
    const person = (tint) => `<div style="width:76px;height:76px;border-radius:50%;background:${tint};margin:26px 0 22px"></div>`;
    return card(0, 120, 270, 300, L(a, 'a', 0), person('rgba(124,58,237,.14)') + lines(2)) +
      arrow(285, 250) +
      card(380, 120, 270, 300, L(a, 'b', 0), person('rgba(37,99,235,.14)') + lines(2, 1)) +
      ok(506, 400, 128) +
      card(40, 470, 300, 140, '', lines(3, 2), 'padding-top:12px');
  },

  'ipc-progress': (a) => {
    const row = (label, w, color) => `<div style="margin-top:30px"><div style="font-size:21px;font-weight:600;color:#4A5070;margin-bottom:10px">${label}</div><div style="height:22px;border-radius:12px;background:#ECEAF8"><div style="width:${w}%;height:22px;border-radius:12px;background:${color}"></div></div></div>`;
    return card(0, 50, 640, 520, L(a, 'tag', 0),
      row(L(a, 'rows', 0), 88, 'linear-gradient(90deg,#A78BFA,#7C3AED)') + row(L(a, 'rows', 1), 64, 'linear-gradient(90deg,#60A5FA,#2563EB)') + row(L(a, 'rows', 2), 38, 'linear-gradient(90deg,#34D399,#10B981)') +
      `<div class="abs" style="left:28px;right:28px;bottom:30px">${lines(2, 1)}</div>`) + ok(540, 20, 112);
  },

  'bands': (a) => {
    const cols = ['#10B981', '#06B6D4', '#F59E0B', '#EF4444'];
    const ws = [92, 74, 52, 34];
    const bands = cols.map((c, i) => `<div style="display:flex;align-items:center;gap:20px;margin-top:${i ? 26 : 30}px"><div style="width:${ws[i]}%;height:74px;border-radius:18px;background:${c};opacity:.92;display:flex;align-items:center;padding-left:26px;color:#fff;font-size:28px;font-weight:700">${L(a, 'bands', i)}</div></div>`).join('');
    return card(0, 50, 660, 520, L(a, 'tag', 0), bands);
  },

  'doc-versions': (a) =>
    [2, 1, 0].map((i) => card(40 + i * 44, 40 + (2 - i) * 70, 420, 400, i === 0 ? L(a, 'tag', 0) : '', i === 0 ? lines(6) : '', `opacity:${i === 0 ? 1 : 0.9 - i * 0.18}`)).join('') +
    [0, 1, 2].map((i) => `<div class="pill" style="left:${52 + i * 44}px;top:${12 + (2 - i) * 70}px;padding:6px 14px;font-size:17px">${L(a, 'versions', i)}</div>`).join('') +
    card(460, 90, 200, 190, '', `<div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:-6px"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><div style="font-size:21px;font-weight:700;color:#4A5070">${L(a, 'lock', 0)}</div></div>`, 'padding:34px 20px;text-align:center') +
    card(400, 380, 270, 230, '', `<div style="display:flex;flex-direction:column;align-items:center;gap:16px"><svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg><div style="font-size:23px;font-weight:700;color:#4A5070">${L(a, 'archive', 0)}</div></div>`, 'padding:34px 20px;text-align:center'),

  'receipt-phone': (a) =>
    `<div class="card" style="left:20px;top:20px;width:290px;height:600px;border-radius:46px;padding:40px 26px">
       <div class="tag" style="text-align:center">${L(a, 'phone', 0)}</div>
       <div style="margin:30px auto 0;width:200px;height:250px;border-radius:14px;background:#F5F3FF;border:2px dashed rgba(124,58,237,.4);padding:22px 18px"><div class="tag" style="font-size:14px">${L(a, 'tag', 0)}</div>${lines(5)}</div>
       <div class="abs" style="left:26px;right:26px;bottom:38px;height:56px;border-radius:16px;background:linear-gradient(90deg,#7C3AED,#2563EB)"></div></div>` +
    card(350, 90, 320, 220, '', `<div style="display:flex;flex-direction:column;align-items:center;gap:14px"><svg width="92" height="92" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2.5"/><path d="M6 8l1.2-3.4h9.6L18 8"/><path d="M9 14h6"/></svg><div class="big" style="font-size:26px">${L(a, 'tin', 0)}</div></div>`, 'padding:30px 20px;text-align:center') +
    card(350, 360, 320, 160, '', lines(3, 1), 'padding-top:30px') + ok(540, 470, 104),
};

export function artHtml(art, _colors) {
  return builders[art.type](art);
}
