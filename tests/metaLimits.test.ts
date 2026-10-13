import { describe, it, expect } from 'vitest';
import { STATIC_ROUTE_META, composeTitle, formatPageTitle, TITLE_MAX } from '../src/utils/routeMeta';
import { LEGAL_DOCS } from '../src/components/pages/legalContent';

describe('title and description limits', () => {
  for (const [path, m] of Object.entries(STATIC_ROUTE_META)) {
    it(`${path}: title <= ${TITLE_MAX} characters, description 120-155`, () => {
      expect(formatPageTitle(m.title).length).toBeLessThanOrEqual(TITLE_MAX);
      expect(m.description.length).toBeGreaterThanOrEqual(120);
      expect(m.description.length).toBeLessThanOrEqual(155);
    });
  }
  for (const [type, doc] of Object.entries(LEGAL_DOCS)) {
    it(`legal ${type}: description 120-155`, () => {
      expect(doc.seoDescription.length).toBeGreaterThanOrEqual(120);
      expect(doc.seoDescription.length).toBeLessThanOrEqual(155);
    });
  }
});

describe('composeTitle', () => {
  it('adds the short suffix when it fits', () => {
    expect(composeTitle('Real Estate AI')).toBe('Real Estate AI | Artify Solutions');
  });
  it('drops the suffix instead of exceeding 60 characters', () => {
    const t = 'Artify CAS - Construction Accounting System';
    expect(composeTitle(t)).toBe(t);
    expect(composeTitle(t).length).toBeLessThanOrEqual(TITLE_MAX);
  });
  it('tries the longer suffix first when asked and falls back', () => {
    expect(composeTitle('Short', ['Artify Solutions Case Studies', 'Artify Solutions'])).toBe('Short | Artify Solutions Case Studies');
    expect(composeTitle('A fairly long case study title here', ['Artify Solutions Case Studies', 'Artify Solutions'])).toBe('A fairly long case study title here | Artify Solutions');
  });
  it('leaves a title that already names the site untouched', () => {
    expect(composeTitle('About Artify Solutions - We Believe Software Should Think')).toBe('About Artify Solutions - We Believe Software Should Think');
  });
});
