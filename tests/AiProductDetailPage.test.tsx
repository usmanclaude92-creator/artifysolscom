/**
 * Phase 10 (Products + Services + Solutions, Artify-Backend repo) — the
 * public product/service/solution detail page renders the real rich
 * fields (business problem, benefits, features, category, industries,
 * featured media, related items, CTA form) when the backend provides
 * them, and degrades to the original plain layout when it doesn't —
 * never fabricated content either way.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AiProductDetailPage } from '../src/components/solutions/AiProductDetailPage';
import { publicApi } from '../src/lib/publicApi';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, getProductBySlug: vi.fn(), getProductModules: vi.fn() } };
});

vi.mock('../src/components/forms/PublicForm', () => ({
  PublicForm: ({ formId }: { formId?: string }) => <div data-testid="public-form-stub">form:{formId}</div>,
}));

const noop = () => {};
const BASE_PROPS = {
  productSlug: 'real-solution',
  onBackToSolutions: noop,
  onSelectProduct: noop,
  onOpenConsultant: noop,
  onOpenSolutionBuilder: noop,
  onNavigateToContact: noop,
};

describe('AiProductDetailPage', () => {
  it('renders a plain PRODUCT with none of the Phase 10 fields set, unaffected by their absence', async () => {
    vi.mocked(publicApi.getProductBySlug).mockResolvedValue({
      slug: 'plain-product',
      code: 'PP-1',
      name: 'Plain Product',
      type: 'PRODUCT',
      shortDescription: 'A plain description.',
      description: 'Full plain description.',
      isFeatured: false,
      displayOrder: 0,
    });
    vi.mocked(publicApi.getProductModules).mockResolvedValue([]);

    render(<AiProductDetailPage {...BASE_PROPS} productSlug="plain-product" />);

    expect(await screen.findByText('Plain Product')).toBeInTheDocument();
    expect(screen.getByText('Request a Consultation')).toBeInTheDocument();
    expect(screen.queryByTestId('public-form-stub')).not.toBeInTheDocument();
    expect(screen.queryByText('The problem')).not.toBeInTheDocument();
  });

  it('renders a real SOLUTION with business problem, benefits, features, category, industries, featured media, related items, and its real CTA form', async () => {
    vi.mocked(publicApi.getProductBySlug).mockResolvedValue({
      slug: 'real-solution',
      code: 'SOL-1',
      name: 'Zero-Touch Close',
      type: 'SOLUTION',
      shortDescription: 'Automates month-end close.',
      description: 'Full description.',
      isFeatured: true,
      displayOrder: 0,
      category: { slug: 'finance-ops', name: 'Finance Ops', description: null },
      industries: [{ slug: 'finance', name: 'Finance & Accounting', description: null }],
      featuredMedia: { url: 'https://cdn.example.com/hero.jpg', altText: 'Hero', caption: null, width: 1200, height: 600 },
      businessProblem: 'Manual month-end close takes too long.',
      benefits: ['Faster close', 'Fewer errors'],
      features: ['Auto-reconciliation'],
      relatedProducts: [{ slug: 'related-service', name: 'Consulting', type: 'SERVICE' }],
      ctaForm: { id: 'form-1', name: 'Request a Demo', slug: 'request-a-demo', fields: [], successMessage: 'Thanks!' },
    });
    vi.mocked(publicApi.getProductModules).mockResolvedValue([]);

    render(<AiProductDetailPage {...BASE_PROPS} />);

    expect(await screen.findByText('Zero-Touch Close')).toBeInTheDocument();
    expect(screen.getByText('Manual month-end close takes too long.')).toBeInTheDocument();
    expect(screen.getByText('Faster close')).toBeInTheDocument();
    expect(screen.getByText('Auto-reconciliation')).toBeInTheDocument();
    expect(screen.getByText('Finance Ops')).toBeInTheDocument();
    expect(screen.getByText('Finance & Accounting')).toBeInTheDocument();
    expect(screen.getByAltText('Hero')).toHaveAttribute('src', 'https://cdn.example.com/hero.jpg');
    expect(screen.getByText('Consulting')).toBeInTheDocument();
    // A real CTA form renders the real interactive form, never the generic fallback button.
    expect(screen.getByTestId('public-form-stub')).toHaveTextContent('form:form-1');
    expect(screen.queryByText('Request a Consultation')).not.toBeInTheDocument();
  });

  it('shows an honest not-found state for an unknown slug, never a blank page', async () => {
    vi.mocked(publicApi.getProductBySlug).mockRejectedValue(new Error('Not found'));
    vi.mocked(publicApi.getProductModules).mockRejectedValue(new Error('Not found'));

    render(<AiProductDetailPage {...BASE_PROPS} productSlug="never-existed" />);

    expect(await screen.findByText('Product not found')).toBeInTheDocument();
  });
});
