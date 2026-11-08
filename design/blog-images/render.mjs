#!/usr/bin/env node
/**
 * Renders the Artify blog feature images.
 *
 *   node design/blog-images/render.mjs                    render every article in articles.json
 *   node design/blog-images/render.mjs --slug cash-flow-forecast
 *   node design/blog-images/render.mjs --bg design/blog-images/backgrounds   use <slug>.png from that folder as the background layer
 *   node design/blog-images/render.mjs --out some/dir
 *
 * Needs Playwright with a Chromium: set PLAYWRIGHT_MODULE (path to playwright/index.mjs) and, if Chromium is not
 * on the default path, CHROMIUM_PATH. Writes <slug>.png and <slug>.webp (16:9, 1600 x 900) to the output folder.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildHtml, lintArticle } from './system.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const tokens = JSON.parse(fs.readFileSync(path.join(here, 'tokens.json'), 'utf8'));
const articles = JSON.parse(fs.readFileSync(path.join(here, 'articles.json'), 'utf8'));
const outDir = path.resolve(opt('out') || path.join(here, 'output'));
const bgDir = opt('bg') ? path.resolve(opt('bg')) : null;
const only = opt('slug');

// 1. The original logo must be exactly the file the brand approved.
const logoPath = path.join(root, tokens.logo.file);
const sha = crypto.createHash('sha256').update(fs.readFileSync(logoPath)).digest('hex');
if (sha !== tokens.logoSha256) {
  console.error(`Logo check failed: ${tokens.logo.file} does not match the approved file (sha256 ${sha}). Restore the original logo; do not edit it.`);
  process.exit(1);
}

// 2. Content rules.
const selected = articles.filter((a) => !only || a.slug === only);
if (selected.length === 0) {
  console.error(`No article matches "${only}".`);
  process.exit(1);
}
let failed = false;
for (const a of selected) {
  for (const p of lintArticle(a, tokens)) {
    console.error(`[${a.slug}] ${p}`);
    failed = true;
  }
}
if (failed) process.exit(1);

// 3. Render.
fs.mkdirSync(outDir, { recursive: true });
const tmp = path.join(outDir, '.tmp');
fs.mkdirSync(tmp, { recursive: true });
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--allow-file-access-from-files'] });
const page = await (await browser.newContext({ viewport: { width: tokens.canvas.width, height: tokens.canvas.height }, deviceScaleFactor: 1 })).newPage();
const kb = (f) => `${Math.round(fs.statSync(f).size / 1024)} KB`;

for (const a of selected) {
  const bgFile = bgDir ? path.join(bgDir, `${a.slug}.png`) : null;
  const html = buildHtml(a, tokens, {
    fontsUrl: pathToFileURL(path.join(root, tokens.fonts.dir)).href,
    logoUrl: pathToFileURL(logoPath).href,
    backgroundUrl: bgFile && fs.existsSync(bgFile) ? pathToFileURL(bgFile).href : null,
  });
  const htmlFile = path.join(tmp, `${a.slug}.html`);
  fs.writeFileSync(htmlFile, html);
  await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const png = await page.screenshot({ type: 'png' });
  const pngFile = path.join(outDir, `${a.slug}.png`);
  fs.writeFileSync(pngFile, png);

  // WebP through the browser's own encoder, so no extra tools are needed.
  const b64 = png.toString('base64');
  const webpB64 = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', 0.9).split(',')[1];
  }, b64);
  const webpFile = path.join(outDir, `${a.slug}.webp`);
  fs.writeFileSync(webpFile, Buffer.from(webpB64, 'base64'));
  console.log(`${a.slug.padEnd(32)} png ${kb(pngFile).padStart(7)}   webp ${kb(webpFile).padStart(6)}`);
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
