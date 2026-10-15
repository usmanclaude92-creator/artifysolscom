import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderLegalHtml } from '../src/legal/renderLegalHtml';

const read = (p: string) => readFileSync(path.resolve(process.cwd(), p), 'utf8');

describe('mobile horizontal overflow fixes', () => {
  it('server-rendered legal tables scroll inside their own box instead of widening the page', () => {
    const html = renderLegalHtml('privacy', 'https://artifysols.com');
    expect(html).toContain('.tw{overflow-x:auto}');
    expect(html).toMatch(/<div class="tw"><table>/);
    expect(html.match(/<table>/g)?.length).toBe(html.match(/<div class="tw"><table>/g)?.length);
    expect(html.match(/<\/table>/g)?.length).toBe(html.match(/<\/table><\/div>/g)?.length);
  });

  it('the blog "Filter Type" chips and the catalog type chips wrap on narrow screens', () => {
    expect(read('src/components/blog/BlogPage.tsx')).toContain('<div className="flex flex-wrap items-center gap-2 pt-1">');
    expect(read('src/components/solutions/AiSolutionsPage.tsx')).toContain('<div className="flex flex-wrap items-center gap-2">\n          {([\'ALL\'');
  });
});
