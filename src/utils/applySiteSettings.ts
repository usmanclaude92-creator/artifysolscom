/**
 * Phase 3 (Site Identity + Global Styles, Artify-Backend repo) — applies
 * published Control Center settings to the live site, opt-in and additive.
 * Only overrides CSS variables that real components already consume
 * (src/index.css's `--color-*` tokens and the new `--font-family-*`/
 * `--font-size-base` tokens) and the dynamic SEO defaults in utils/seo.ts.
 * When the Control Center has nothing published yet, publicApi.getSiteSettings()
 * resolves to backend schema defaults that match this site's current
 * hardcoded values, so applying them is a no-op; when no public
 * organization is configured at all, it resolves to null and nothing here
 * runs.
 */
import { publicApi, type PublicGlobalStyles } from '../lib/publicApi';
import { configureSiteDefaults } from './seo';

// Maps GlobalStyles color fields to the real CSS variables already consumed
// by Tailwind utility classes throughout the site (src/index.css). An
// inline style on <html> has higher specificity than the .theme-light/
// .theme-dark class rules that redefine these same variable names, so a
// published color override intentionally applies identically in both
// light and dark mode — a documented, acceptable simplification.
function applyGlobalStylesColors(colors: PublicGlobalStyles['colors']): void {
  const root = document.documentElement.style;
  root.setProperty('--color-primary', colors.primary);
  root.setProperty('--color-primary-hover', colors.primaryHover);
  root.setProperty('--color-primary-foreground', colors.primaryForeground);
  root.setProperty('--color-secondary', colors.secondary);
  root.setProperty('--color-secondary-foreground', colors.secondaryForeground);
  root.setProperty('--color-background', colors.background);
  root.setProperty('--color-surface', colors.surface);
  root.setProperty('--color-foreground', colors.textPrimary);
  root.setProperty('--color-foreground-muted', colors.textSecondary);
  root.setProperty('--color-border', colors.border);
}

function applyGlobalStylesTypography(typography: PublicGlobalStyles['typography']): void {
  const root = document.documentElement.style;
  root.setProperty('--font-family-base', typography.fontFamilyBase);
  root.setProperty('--font-family-heading', typography.fontFamilyHeading);
  root.setProperty('--font-size-base', typography.fontSizeBase);
}

function applyFavicon(url: string | null | undefined): void {
  if (!url) return;
  const existing = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]');
  existing.forEach((link) => {
    link.href = url;
  });
}

/** Fetched and applied once on initial mount — see src/App.tsx. */
export async function applyPublishedSiteSettings(): Promise<void> {
  const settings = await publicApi.getSiteSettings();
  if (!settings) return;

  const { identity, globalStyles } = settings;

  configureSiteDefaults({
    siteName: identity.siteName,
    ogImage: identity.socialImage?.url,
    metaTitle: identity.defaultMetaTitle,
    metaDescription: identity.defaultMetaDescription,
  });

  applyFavicon(identity.favicon?.url);
  applyGlobalStylesColors(globalStyles.colors);
  applyGlobalStylesTypography(globalStyles.typography);
}
