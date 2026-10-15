import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('light theme image overlays', () => {
  it('keeps gradient overlays that follow an <img> transparent', () => {
    const css = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf8');
    expect(css).toMatch(/\.theme-light img \+ div\[class\*="from-black"\]\[class\*="from-black"\]\s*\{\s*background:\s*transparent\s*!important;/);
  });
});
