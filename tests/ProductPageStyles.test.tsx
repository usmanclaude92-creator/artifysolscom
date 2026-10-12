/**
 * Every public page style (chosen per product in the Control Center) renders the product's real
 * content, never fabricated content, keeps the conversion form / consultation CTA, and works with
 * sparse data (no image, no problem, no benefits). Unknown styles fall back to the classic layout.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AiProductDetailPage } from '../src/components/solutions/AiProductDetailPage';
import { PRODUCT_PAGE_STYLES } from '../src/components/solutions/productStyles';
import { publicApi, type PublicProduct } from '../src/lib/publicApi';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, getProductBySlug: vi.fn(), getProductModules: vi.fn() } };
});
vi.mock('../src/components/forms/PublicForm', () => ({
  PublicForm: ({ formId }: { formId?: string }) => <div data-testid="public-form-stub">form:{formId}</div>,
}));

const noop = () => {};
const PROPS = { productSlug: 'cas', onBackToSolutions: noop, onSelectProduct: noop, onOpenConsultant: noop, onOpenSolutionBuilder: noop, onNavigateToContact: noop };

const FULL: PublicProduct = {
  slug: 'cas', code: 'CAS-1', name: 'Real Accounting System', type: 'SOLUTION',
  shortDescription: 'Short real description.', description: 'First real paragraph.\n\nSecond real paragraph.',
  isFeatured: false, displayOrder: 0,
  category: { slug: 'finance', name: 'Real Category', description: null },
  featuredMedia: { url: 'https://cdn.example/banner.png', altText: null, caption: null, width: 1200, height: 630 },
  benefits: ['Benefit one', 'Benefit two'],
  features: ['Feature one', 'Feature two', 'Feature three'],
  businessProblem: 'A real problem statement.',
  industries: [{ slug: 'construction', name: 'Real Industry', description: null }],
  relatedProducts: [{ slug: 'other', name: 'Related Thing', type: 'PRODUCT' }],
};

const STYLES = Object.keys(PRODUCT_PAGE_STYLES);

beforeEach(() => {
  vi.mocked(publicApi.getProductModules).mockReset().mockResolvedValue([]);
  vi.mocked(publicApi.getProductBySlug).mockReset();
});

describe('product page styles', () => {
  it('has all nine styles registered', () => {
    expect(STYLES.sort()).toEqual(['bento', 'cinematic', 'datasheet', 'editorial', 'executive', 'showcase', 'story', 'tabbed', 'workflow']);
  });

  for (const style of STYLES) {
    it(`${style}: renders the real content and the CTA`, async () => {
      vi.mocked(publicApi.getProductBySlug).mockResolvedValue({ ...FULL, pageStyle: style });
      const { container } = render(<AiProductDetailPage {...PROPS} />);

      expect(await screen.findByRole('heading', { level: 1, name: 'Real Accounting System' })).toBeInTheDocument();
      expect(screen.getAllByText('Short real description.').length).toBeGreaterThan(0);
      expect(screen.getAllByText('A real problem statement.').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Second real paragraph.').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Related Thing').length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /request a consultation/i }).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /back to catalog/i })).toBeInTheDocument();
      expect(container.querySelector('img[src="https://cdn.example/banner.png"]')).not.toBeNull();
      // tabbed shows benefits/features behind tabs; every other style shows them directly
      if (style !== 'tabbed') {
        expect(screen.getAllByText('Benefit one').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Feature three').length).toBeGreaterThan(0);
      }
      // nothing fabricated: the CTA copy only ever names the product itself
      expect(screen.queryByText(/SOC2|HIPAA|99\.\d+%/)).not.toBeInTheDocument();
    });

    it(`${style}: works with sparse data (no image, problem, benefits or features)`, async () => {
      vi.mocked(publicApi.getProductBySlug).mockResolvedValue({
        slug: 'cas', code: 'X', name: 'Bare Product', type: 'PRODUCT', shortDescription: 'Bare short.', description: 'Bare long.', isFeatured: false, displayOrder: 0, pageStyle: style,
      });
      const { container } = render(<AiProductDetailPage {...PROPS} />);
      expect(await screen.findByRole('heading', { level: 1, name: 'Bare Product' })).toBeInTheDocument();
      expect(container.querySelector('img')).toBeNull();
      expect(screen.queryByText('The problem')).not.toBeInTheDocument();
      cleanup();
    });

    it(`${style}: shows the product's real conversion form instead of the plain button`, async () => {
      vi.mocked(publicApi.getProductBySlug).mockResolvedValue({
        ...FULL,
        pageStyle: style,
        ctaForm: { id: 'form-1', name: 'Real Lead Form', slug: 'lead', fields: [], successMessage: null },
      });
      render(<AiProductDetailPage {...PROPS} />);
      expect(await screen.findByTestId('public-form-stub')).toHaveTextContent('form:form-1');
      expect(screen.getByText('Real Lead Form')).toBeInTheDocument();
    });
  }

  it('falls back to the classic layout for classic or an unknown style', async () => {
    for (const pageStyle of ['classic', 'not-a-style', undefined]) {
      vi.mocked(publicApi.getProductBySlug).mockResolvedValue({ ...FULL, pageStyle });
      const { container, unmount } = render(<AiProductDetailPage {...PROPS} />);
      expect(await screen.findByRole('heading', { level: 1, name: 'Real Accounting System' })).toBeInTheDocument();
      // the classic page's featured image is the 21:9 crop
      expect(container.querySelector('.aspect-\\[21\\/9\\]')).not.toBeNull();
      unmount();
    }
  });

  it('switches tabs in the tabbed style to show benefits, features and modules', async () => {
    vi.mocked(publicApi.getProductModules).mockResolvedValue([{ slug: 'm1', code: 'M1', name: 'Real Module', description: 'Module desc.', isCore: true, displayOrder: 0 }]);
    vi.mocked(publicApi.getProductBySlug).mockResolvedValue({ ...FULL, pageStyle: 'tabbed' });
    render(<AiProductDetailPage {...PROPS} />);
    await screen.findByRole('heading', { level: 1, name: 'Real Accounting System' });
    expect(screen.queryByText('Benefit one')).not.toBeInTheDocument();
    screen.getByRole('tab', { name: 'Benefits' }).click();
    expect(await screen.findByText('Benefit one')).toBeInTheDocument();
    screen.getByRole('tab', { name: 'Modules' }).click();
    expect(await screen.findByText('Real Module')).toBeInTheDocument();
  });
});
