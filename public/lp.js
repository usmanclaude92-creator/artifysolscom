/* Landing page enhancement (Step 12). Same-origin, no dependencies. Without JavaScript the page and the form still work. */
(function () {
  'use strict';
  var script = document.currentScript || document.querySelector('script[src="/lp.js"]');
  var api = (script && script.getAttribute('data-api') || '').replace(/\/+$/, '');
  var preview = !!(script && script.getAttribute('data-preview'));
  var KEYS = [['utm_source', 'utmSource'], ['utm_medium', 'utmMedium'], ['utm_campaign', 'utmCampaign'], ['utm_term', 'utmTerm'], ['utm_content', 'utmContent']];
  var FIRST = 'lp_first_touch', LAST = 'lp_last_touch', SESSION = 'artify_analytics_session';

  function get(store, key) { try { return JSON.parse(store.getItem(key) || 'null'); } catch (e) { return null; } }
  function set(store, key, value) { try { store.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ } }

  function currentTouch() {
    var q = new URLSearchParams(location.search), t = {}, any = false;
    KEYS.forEach(function (k) { var v = q.get(k[0]); if (v) { t[k[1]] = v.slice(0, 200); any = true; } });
    var ref = document.referrer;
    try { if (ref && new URL(ref).origin !== location.origin) { t.referrer = ref.slice(0, 2000); any = true; } } catch (e) { /* ignore */ }
    t.landingPath = location.pathname.slice(0, 500);
    t.at = new Date().toISOString();
    return { touch: t, informative: any };
  }

  var cur = currentTouch();
  var first = get(localStorage, FIRST), last = get(localStorage, LAST);
  if (!preview) {
    if (cur.informative) { last = cur.touch; set(localStorage, LAST, last); }
    if (!first) { first = cur.touch; set(localStorage, FIRST, first); }
  }

  function sessionId() {
    try {
      var id = sessionStorage.getItem(SESSION);
      if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)); sessionStorage.setItem(SESSION, id); }
      return id;
    } catch (e) { return undefined; }
  }

  // Page-view beacon: first-party, no personal data, fire-and-forget (same contract as the main site's analytics).
  if (api && !preview) {
    var body = { eventType: 'page_view', path: location.pathname, sessionId: sessionId() };
    if (document.referrer) body.referrer = document.referrer.slice(0, 2000);
    KEYS.forEach(function (k) { if (cur.touch[k[1]]) body[k[1]] = cur.touch[k[1]]; });
    try { fetch(api + '/public/analytics/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true }).catch(function () {}); } catch (e) { /* ignore */ }
  }

  var form = document.getElementById('lp-form');
  if (!form || !api || form.getAttribute('data-preview')) return;
  var status = document.getElementById('lp-status');

  function say(text, ok) { status.textContent = text; status.className = 'status ' + (ok ? 'ok' : 'err'); }
  function clearErrors() { Array.prototype.forEach.call(form.elements, function (el) { if (el.removeAttribute) el.removeAttribute('aria-invalid'); }); }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    clearErrors();
    var firstBad = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.name && el.name !== 'website' && el.required && (el.type === 'checkbox' ? !el.checked : !String(el.value).trim())) { el.setAttribute('aria-invalid', 'true'); firstBad = firstBad || el; }
      else if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) { el.setAttribute('aria-invalid', 'true'); firstBad = firstBad || el; }
    });
    if (firstBad) { say('Please complete the highlighted fields.', false); firstBad.focus(); return; }

    var data = {}, honeypot = '';
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.tagName === 'BUTTON') return;
      if (el.name === 'website') { honeypot = el.value; return; }
      if (el.type === 'checkbox') { if (el.checked) data[el.name] = 'true'; return; }
      if (el.value !== '') data[el.name] = el.value;
    });
    var btn = form.querySelector('button[type=submit]');
    if (btn) btn.disabled = true;
    say('Sending…', true);
    var payload = { data: data, lastTouch: last || cur.touch, firstTouch: first || cur.touch };
    if (honeypot) payload.website = honeypot;
    var slug = form.getAttribute('data-slug');
    fetch(api + '/public/landing/' + encodeURIComponent(slug) + '/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, json: j }; }); })
      .then(function (res) {
        if (res.ok) {
          var d = res.json && res.json.data || {};
          if (d.redirectUrl) { location.assign(d.redirectUrl); return; }
          form.reset(); say(d.message || 'Thank you. We received your message.', true);
          return;
        }
        if (btn) btn.disabled = false;
        say(res.status === 429 ? 'Too many attempts. Please wait a few minutes and try again.' : ((res.json && res.json.error && res.json.error.message) || 'Something went wrong. Please try again.'), false);
      })
      .catch(function () { if (btn) btn.disabled = false; say('Network problem. Please try again.', false); });
  });
})();
