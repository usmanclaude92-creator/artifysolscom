# Artify blog feature-image design system

Repeatable, on-brand 16:9 feature images (1600 x 900) for artifysols.com articles. Every image is built in layers so the
logo and the text are exact, never "drawn" by an image model.

## The rules (enforced by `render.mjs` and `tests/blogImageSystem.test.ts`)

1. **The original logo only.** `assets/Header logo.png` is composited as-is. Its SHA-256 is recorded in `tokens.json`
   and rendering refuses to run if the file changes. The logo is only cropped (transparent padding) and scaled uniformly.
   No recolour, filter, blend mode, opacity, mask, redraw or AI regeneration. The template has no CSS that could do so.
2. **Small and discreet.** 220 px wide, top-left.
3. **Matching background.** The logo is transparent and sits directly on the image background. Its wordmark is dark navy,
   so the system uses a light background (white, lavender, soft cyan glow). Do not put it on a dark background: it would be
   unreadable, and recolouring it is not allowed.
4. **No geography, no currency, no invented figures.** Titles, subtitles and labels are linted: Oman, GCC, Muscat, OMR, AED,
   dollar signs, percentages and three-digit numbers are rejected unless the article lists the term in `allowTerms`
   (only when the article is specifically about that place).
5. **Text is real text.** Titles and labels are typeset in Plus Jakarta Sans (the site font) by the browser, so spelling is exact.
   Never ask an image model to render words.
6. **Social-safe.** Keep important content inside y 31-869 so a 1.91:1 social crop (WhatsApp, LinkedIn, X) never cuts it.
7. **Output:** optimized PNG and WebP per article, in `design/blog-images/output/` (git-ignored).

## Add a new article image

1. Add an entry to `articles.json`:
   ```json
   { "slug": "my-article", "kicker": "Short topic", "titleLines": ["Line one", "Line two"], "highlightLine": 1,
     "subtitle": "One short sentence, 80 characters or fewer.",
     "art": { "type": "flow3", "labels": { "cards": ["First", "Second", "Third"] } } }
   ```
   `art.type` is one of: `flow3`, `bars`, `cheque-calendar`, `doc-boq`, `phone-flow`, `approval-pair`, `ipc-progress`, `bands`,
   `doc-versions`, `receipt-phone` (see `art.mjs`; add a new builder there and list it in `ART_TYPES`).
2. Render: `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node design/blog-images/render.mjs --slug my-article`
   (set `CHROMIUM_PATH` if Chromium is not on the default path).
3. Upload `my-article.png` (or `.webp`) in Control Center -> Media Library as **Public**, add alt text, link it to the post.
4. Run `npx vitest run tests/blogImageSystem.test.ts`.

## Optional: an AI-generated background layer

The built-in background is a programmatic gradient. To use generated art instead (ComfyUI, ChatGPT, Figma), generate **only
the background**, save it as `design/blog-images/backgrounds/<slug>.png` (1600 x 900) and render with
`--bg design/blog-images/backgrounds`. The illustration, text and logo are still added by this system on top.

Prompt template for the background (keep it free of anything the rules forbid):

> Abstract light premium background for a B2B software blog, 16:9, 1600x900. Very soft white and lavender gradient with gentle
> violet, blue and cyan glows, subtle depth and faint dotted grid texture, plenty of empty space. **No text, no letters, no
> numbers, no logo, no people, no faces, no buildings or landmarks, no flags, no currency symbols, no device mockups, no
> charts.** Keep the left 50 % calm and almost empty.

Check any generated background: no text or logo, light enough that the dark logo and title stay readable, and nothing
in it points to a country.

## Files

- `tokens.json`: canvas, logo crop and hash, colours, fonts, forbidden terms.
- `system.mjs`: lint rules and the page layout (logo, kicker, title, subtitle, art).
- `art.mjs`: the illustration components.
- `articles.json`: one entry per article image.
- `render.mjs`: CLI that lints, renders PNG and WebP.
