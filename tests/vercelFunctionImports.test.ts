/**
 * Regression guard for the Vercel serverless function (api/index.ts).
 *
 * Vercel runs api/index.ts as native Node ESM, transpiling each file on its
 * own (no bundling). Node's ESM loader does not resolve extensionless
 * relative specifiers, so a bare `from './seo'` in any file the function
 * reaches crashes every /api/* route (sitemap.xml, robots.txt, health, the AI
 * consultant) with ERR_MODULE_NOT_FOUND — and Vite/tsc/vitest all accept the
 * bare form, so nothing else catches it before deploy.
 *
 * Walks every relative import reachable from api/index.ts and requires an
 * explicit `.js`/`.json` extension on each runtime import. `import type` lines
 * are erased at transpile time and are exempt.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(__dirname, '..');
const ENTRY = resolve(ROOT, 'api/index.ts');

// Matches `import ... from '<spec>'`, `export ... from '<spec>'` and `import '<spec>'`.
const SPECIFIER = /^\s*(import|export)\b(?![^;\n]*\btype\b\s*\{)[^;]*?from\s+['"](\.{1,2}\/[^'"]+)['"]|^\s*import\s+['"](\.{1,2}\/[^'"]+)['"]/gm;

function sourceFor(importer: string, spec: string): string {
  const base = resolve(dirname(importer), spec.replace(/\.js$/, ''));
  for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`Cannot resolve ${spec} imported from ${importer}`);
}

function collect(entry: string): { file: string; spec: string }[] {
  const seen = new Set<string>();
  const offenders: { file: string; spec: string }[] = [];
  const queue = [entry];
  while (queue.length) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(SPECIFIER)) {
      const spec = m[2] ?? m[3];
      if (!spec) continue;
      if (!/\.(js|json)$/.test(spec)) offenders.push({ file: file.replace(`${ROOT}/`, ''), spec });
      else if (spec.endsWith('.js')) queue.push(sourceFor(file, spec));
    }
  }
  return offenders;
}

describe('api/index.ts (Vercel function) import graph', () => {
  it('uses explicit .js extensions on every runtime relative import', () => {
    expect(collect(ENTRY)).toEqual([]);
  });
});
