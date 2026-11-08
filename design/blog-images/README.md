# Artify blog feature-image design system

Repeatable, on-brand 16:9 feature images (1600 x 900) for artifysols.com articles. Every image is built in layers so the
logo and the text are exact, never "drawn" by an image model.

## Two layouts

- **Showcase (default, dark):** the Artify product-marketing look. Navy background with violet and blue glows, original dark-theme
  logo top-left, white and violet title with a light lead line, a tilted glass product window (table, chart, cards or bands) with
  topic objects overlapping it (cheque, calendar, shield, phone, documents, receipt, stamp), a four-item feature strip and a product
  call-to-action pill.
- **`"layout": "simple-light"`:** a lighter, simpler card layout (kicker, title, subtitle, small illustration) that uses the
  original full-colour logo. Kept for cases where a light image suits the article.

## The rules (enforced by `render.mjs` and `tests/blogImageSystem.test.ts`)

1. **The original logos only.** Dark backgrounds use `public/logo-header-dark.png` (the site's own dark-theme logo); the light
   layout uses `assets/Header logo.png`. Both SHA-256 hashes are recorded in `tokens.json` and rendering refuses to run if either file
   changes. A logo is only scaled evenly (and, for the light one, cropped of transparent padding). No recolour, filter, blend mode,
   opacity, mask, transform, redraw or AI regeneration, and the templates contain no CSS that could do so.
2. **Small and discreet.** About 210 px wide, top-left, on a transparent background that matches the image.
3. **No geography, no currency, no invented figures.** Titles, labels and statuses are linted: Oman, GCC, Muscat, currencies, `%` and
   three-digit numbers are rejected unless the article lists the term in `allowTerms` (only when the article is specifically about that
   place). Table cells are placeholder bars, not made-up amounts or dates.
4. **No people, landmarks or photos** are drawn. If a photographic backdrop is wanted, generate it as a separate background layer (below).
5. **Text is real text.** Titles, labels and pills are typeset in Plus Jakarta Sans (the site font) by the browser, so spelling is exact.
   Never ask an image model to render words.
6. **Product names are an allowlist:** the call-to-action may only name Artify Next Gen ERP, CAS by Artify Solutions or Artify HCMS
   (`tokens.json` -> `cta.brands`), and its words must stay within what the published articles confirm.
7. **Social-safe.** Keep important content inside y 31-869 so a 1.91:1 social crop never cuts it.
8. **Output:** optimized PNG and WebP per article in `design/blog-images/output/` (git-ignored). 16:9, 1600 x 900.

## Add a new article image (showcase layout)

1. Add an entry to `articles.json`:
   ```json
   { "slug": "my-article", "titleWhite": ["Short"], "titleViolet": ["Keyword"], "lead": "A light lead line",
     "device": { "type": "table", "title": "Window title", "headers": ["A", "B", "C", "D"], "statuses": ["Approved", "Pending", "Approved", "Pending"] },
     "objects": ["shield"],
     "features": [{ "icon": "check", "label": "Four short" }, { "icon": "file", "label": "feature labels" }, { "icon": "lock", "label": "of 26 chars" }, { "icon": "chart", "label": "or fewer" }],
     "cta": { "pre": "Smarter work with", "brand": "Artify Next Gen ERP" } }
   ```
   - `device.type`: `table` (headers + statuses), `chart` (tiles), `cards` (cards with label, icon, status), `bands` (four band labels).
   - `objects`: any of `shield`, `cheque`, `calendar`, `phone`, `docs`, `receipt`, `stamp`.
   - `features[].icon`: see `ICON_NAMES` in `showcase.mjs`.
2. Render: `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node design/blog-images/render.mjs --slug my-article`
   (set `CHROMIUM_PATH` if Chromium is not on the default path).
3. Upload `my-article.png` (or `.webp`) in Control Center -> Media Library as **Public**, add alt text, link it to the post.
4. Run `npx vitest run tests/blogImageSystem.test.ts`.

## Optional: an AI-generated background layer

The built-in background is a programmatic gradient. To use generated art instead (ComfyUI, ChatGPT, Figma), generate **only
the background**, save it as `design/blog-images/backgrounds/<slug>.png` (1600 x 900) and render with
`--bg design/blog-images/backgrounds`. The illustration, text and logo are still added by this system on top.

Prompt template for the background (keep it free of anything the rules forbid):

> Abstract dark premium background for a B2B software blog, 16:9, 1600x900. Deep navy to indigo gradient with soft violet and
> blue glows, subtle depth and faint light streaks, plenty of calm space on the left. **No text, no letters, no
> numbers, no logo, no people, no faces, no buildings or landmarks, no flags, no currency symbols, no device mockups, no
> charts.** Keep the left 50 % calm and almost empty.

Check any generated background: no text or logo, dark enough that the light logo and white title stay readable (it is laid at
55% opacity under the layout), and nothing in it points to a country.

## Files

- `tokens.json`: canvas, logo crop and hash, colours, fonts, forbidden terms.
- `system.mjs`: lint rules and layout dispatch (also the simple-light layout).
- `showcase.mjs`: the dark showcase layout, icons and objects.
- `art.mjs`: illustration components for the simple-light layout.
- `articles.json`: one entry per article image.
- `render.mjs`: CLI that lints, renders PNG and WebP.
