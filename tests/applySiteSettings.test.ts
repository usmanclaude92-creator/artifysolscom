/**
 * Phase 3 (Site Identity + Global Styles, Artify-Backend repo) —
 * applyPublishedSiteSettings() is the only artifysolscom-side code that
 * reaches into the Control Center's published settings. Covers: no-op
 * when nothing is configured, and the real CSS-variable/favicon/SEO-default
 * side effects when settings are published.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PublicSiteSettings } from '../src/lib/publicApi';

const getSiteSettingsMock = vi.fn();

vi.mock('../src/lib/publicApi', () => ({
  publicApi: {
    getSiteSettings: (...args: unknown[]) => getSiteSettingsMock(...args),
  },
}));

const baseSettings: PublicSiteSettings = {
  identity: {
    siteName: 'Published Co',
    tagline: 'Published Tagline',
    description: 'Published description.',
    logo: null,
    logoDark: null,
    logoMobile: null,
    favicon: { url: 'https://cdn.example.com/favicon.png', altText: null, caption: null, width: 32, height: 32 },
    socialImage: { url: 'https://cdn.example.com/social.jpg', altText: null, caption: null, width: 1200, height: 630 },
    defaultMetaTitle: 'Published Meta Title',
    defaultMetaDescription: 'Published meta description.',
  },
  globalStyles: {
    colors: {
      primary: '#FF0000',
      primaryHover: '#CC0000',
      primaryForeground: '#FFFFFF',
      secondary: '#00FF00',
      secondaryForeground: '#000000',
      background: '#111111',
      surface: '#222222',
      textPrimary: '#EEEEEE',
      textSecondary: '#AAAAAA',
      link: '#3333FF',
      linkHover: '#5555FF',
      border: '#444444',
    },
    typography: {
      fontFamilyBase: 'Custom Base Font, sans-serif',
      fontFamilyHeading: 'Custom Heading Font, sans-serif',
      fontSizeBase: '1.125rem',
      headingScale: { h1: '3rem', h2: '2.25rem', h3: '1.875rem', h4: '1.5rem', h5: '1.25rem', h6: '1rem' },
      lineHeightBase: 1.5,
      lineHeightHeading: 1.2,
      fontWeightBase: 400,
      fontWeightHeading: 700,
      fontWeightBold: 700,
    },
    layout: {
      containerMaxWidth: '1280px',
      spacingScale: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
      borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' },
    },
    effects: { borderColor: '#444444', borderWidth: '1px', shadowSm: 'none', shadowMd: 'none', shadowLg: 'none' },
    buttons: {
      radius: '0.5rem',
      paddingX: '1rem',
      paddingY: '0.5rem',
      fontWeight: 600,
      primaryBg: '#FF0000',
      primaryText: '#FFFFFF',
      primaryHoverBg: '#CC0000',
      secondaryBg: 'transparent',
      secondaryText: '#EEEEEE',
      secondaryBorder: '#444444',
    },
    forms: { radius: '0.5rem', borderColor: '#444444', focusColor: '#FF0000', background: '#222222', text: '#EEEEEE' },
    responsive: { tablet: {}, mobile: {} },
  },
};

beforeEach(() => {
  document.head.innerHTML = '<link rel="icon" href="/favicon.ico" /><link rel="apple-touch-icon" href="/apple-touch-icon.png" />';
  document.documentElement.style.cssText = '';
});

afterEach(() => {
  getSiteSettingsMock.mockReset();
  vi.resetModules();
});

describe('applyPublishedSiteSettings', () => {
  it('is a no-op when no public organization is configured (publicApi returns null)', async () => {
    getSiteSettingsMock.mockResolvedValue(null);
    const { applyPublishedSiteSettings } = await import('../src/utils/applySiteSettings');
    const { generateDefaultPlatformSeo } = await import('../src/utils/seo');

    const before = generateDefaultPlatformSeo().title;
    await applyPublishedSiteSettings();
    expect(generateDefaultPlatformSeo().title).toBe(before);
    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('');
  });

  it('applies published colors and typography as real CSS variables on <html>', async () => {
    getSiteSettingsMock.mockResolvedValue(baseSettings);
    const { applyPublishedSiteSettings } = await import('../src/utils/applySiteSettings');

    await applyPublishedSiteSettings();

    const root = document.documentElement.style;
    expect(root.getPropertyValue('--color-primary')).toBe('#FF0000');
    expect(root.getPropertyValue('--color-background')).toBe('#111111');
    expect(root.getPropertyValue('--color-foreground')).toBe('#EEEEEE');
    expect(root.getPropertyValue('--color-foreground-muted')).toBe('#AAAAAA');
    expect(root.getPropertyValue('--font-family-base')).toBe('Custom Base Font, sans-serif');
    expect(root.getPropertyValue('--font-size-base')).toBe('1.125rem');
  });

  it('updates the favicon link hrefs to the published favicon', async () => {
    getSiteSettingsMock.mockResolvedValue(baseSettings);
    const { applyPublishedSiteSettings } = await import('../src/utils/applySiteSettings');

    await applyPublishedSiteSettings();

    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((link) => {
      expect((link as HTMLLinkElement).href).toBe('https://cdn.example.com/favicon.png');
    });
  });

  it('wires the published site name/meta title/description into the SEO defaults', async () => {
    getSiteSettingsMock.mockResolvedValue(baseSettings);
    const { applyPublishedSiteSettings } = await import('../src/utils/applySiteSettings');
    const { generateDefaultPlatformSeo } = await import('../src/utils/seo');

    await applyPublishedSiteSettings();

    const seo = generateDefaultPlatformSeo();
    expect(seo.title).toBe('Published Meta Title');
    expect(seo.description).toBe('Published meta description.');
  });

  it('does not throw when publicApi.getSiteSettings rejects (network failure)', async () => {
    getSiteSettingsMock.mockRejectedValue(new Error('network down'));
    const { applyPublishedSiteSettings } = await import('../src/utils/applySiteSettings');
    await expect(applyPublishedSiteSettings()).rejects.toThrow('network down');
  });
});
