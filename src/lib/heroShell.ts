/**
 * The production HTML shell for "/" ships a prerendered copy of the hero (see vite-plugins/heroShell.ts)
 * so it paints before any JavaScript runs. When React takes over it must not replay the hero's entry
 * fade (that would blank the already-visible hero), so the entry animations are skipped:
 *  - at build time (no `document`: the hero is being rendered to static HTML), and
 *  - on a page load that arrived with the prerendered hero in the document.
 * Evaluated once, at module load, before React's first render replaces the shell.
 */
export const HERO_INSTANT: boolean =
  typeof document === 'undefined' || document.querySelector('[data-hero-shell]') !== null;
