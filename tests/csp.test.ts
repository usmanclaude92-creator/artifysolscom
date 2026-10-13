import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { buildCspReportOnly, inlineHashes, summarizeCspReports, CSP_REPORT_PATH } from '../src/utils/csp';

const shell = readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
const sha = (s: string) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;

describe('buildCspReportOnly', () => {
  const csp = buildCspReportOnly(shell);
  const directive = (name: string) => csp.split('; ').find((d) => d.startsWith(`${name} `)) ?? '';

  it('allows the real inline theme script and the stylesheet onload handler by hash, and no other inline script', () => {
    const themeScript = shell.match(/<script>([\s\S]*?)<\/script>/)![1]!;
    expect(directive('script-src')).toContain(sha(themeScript));
    expect(directive('script-src')).not.toContain("'unsafe-inline'");
    // the build adds the non-blocking stylesheet link (vite-plugins/heroShell.ts); its onload handler is hashed too
    const built = shell.replace('</head>', '<link rel="stylesheet" href="/a.css" id="app-css" media="print" onload="this.media=\'all\'" /></head>');
    const builtCsp = buildCspReportOnly(built);
    expect(builtCsp).toContain("'unsafe-hashes'");
    expect(builtCsp).toContain(sha("this.media='all'"));
    expect(readFileSync(path.resolve(process.cwd(), 'vite-plugins/heroShell.ts'), 'utf8')).toContain('onload="this.media=\'all\'"');
    expect(directive('script-src')).not.toContain("'unsafe-eval'");
  });

  it('lists exactly the origins the site uses, with no wildcards', () => {
    expect(directive('connect-src')).toContain('https://cc.artifysols.com');
    expect(directive('img-src')).toContain('https://cfkymotcnccgvkpmcevp.supabase.co');
    expect(directive('img-src')).toContain('https://images.unsplash.com');
    expect(directive('font-src')).toBe("font-src 'self'");
    expect(directive('frame-src')).toBe('frame-src https://challenges.cloudflare.com');
    expect(csp).not.toMatch(/\*|\shttps:(\s|;|$)|\shttp:/);
  });

  it('locks down framing, plugins, base and forms and reports to the collector', () => {
    expect(directive('frame-ancestors')).toBe("frame-ancestors 'none'");
    expect(directive('object-src')).toBe("object-src 'none'");
    expect(directive('base-uri')).toBe("base-uri 'self'");
    expect(directive('form-action')).toBe("form-action 'self'");
    expect(directive('report-uri')).toBe(`report-uri ${CSP_REPORT_PATH}`);
  });

  it('tracks edits: a changed inline script produces a different hash', () => {
    const edited = shell.replace("var de = document.documentElement", "var de = document.documentElement; /* edited */");
    expect(buildCspReportOnly(edited)).not.toBe(csp);
    expect(inlineHashes(edited).scripts).not.toEqual(inlineHashes(shell).scripts);
  });
});

describe('summarizeCspReports', () => {
  it('reads the legacy report-uri format and trims fields', () => {
    const out = summarizeCspReports({ 'csp-report': { 'violated-directive': 'img-src', 'blocked-uri': 'https://x.test/a.png', 'document-uri': 'https://artifysols.com/', 'line-number': 4, 'script-sample': 'x'.repeat(500) } });
    expect(out[0]).toMatchObject({ directive: 'img-src', blocked: 'https://x.test/a.png', document: 'https://artifysols.com/', line: 4 });
    expect(String(out[0]!.sample).length).toBe(100);
  });
  it('reads the Reporting API format and caps the batch', () => {
    const batch = Array.from({ length: 25 }, () => ({ type: 'csp-violation', body: { effectiveDirective: 'script-src-elem', blockedURL: 'inline' } }));
    const out = summarizeCspReports(batch);
    expect(out).toHaveLength(10);
    expect(out[0]).toMatchObject({ directive: 'script-src-elem', blocked: 'inline' });
  });
  it('survives garbage', () => {
    expect(() => summarizeCspReports(null)).not.toThrow();
    expect(() => summarizeCspReports('x')).not.toThrow();
  });
});

describe('vercel.json security headers', () => {
  const cfg = JSON.parse(readFileSync(path.resolve(process.cwd(), 'vercel.json'), 'utf8')) as { headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }> };
  const global = cfg.headers.find((h) => h.source === '/(.*)')!;
  const val = (k: string) => global.headers.find((h) => h.key === k)?.value;
  it('sets the four baseline headers on every path', () => {
    expect(val('X-Content-Type-Options')).toBe('nosniff');
    expect(val('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(val('X-Frame-Options')).toBe('DENY');
    expect(val('Permissions-Policy')).toBe('camera=(), geolocation=(), payment=(), usb=(), microphone=(self)');
  });
});
