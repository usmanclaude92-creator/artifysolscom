/**
 * Phase 11 (Case Studies + Content Relationships, Artify-Backend repo) —
 * the real case study detail page at /case-studies/:slug renders the real
 * published fields (challenge/solution/implementation/results,
 * testimonial, technologies, gallery, related products/pages/posts, CTA
 * form) when the backend provides them, and shows an honest not-found
 * state for an unknown slug — never fabricated content either way.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStudyDetailPage } from '../src/components/pages/CaseStudyDetailPage';
import { publicApi } from '../src/lib/publicApi';
import { ApiClientError } from '../src/lib/apiClient';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, getCaseStudyBySlug: vi.fn(), getRedirectForPath: vi.fn() } };
});

vi.mock('../src/components/forms/PublicForm', () => ({
  PublicForm: ({ formId }: { formId?: string }) => <div data-testid="public-form-stub">form:{formId}</div>,
}));

const noop = () => {};
const BASE_PROPS = { slug: 'acme-zero-touch-close', theme: 'dark' as const, onNavigateHome: noop, onNavigateToCaseStudies: noop };

const FULL_CASE_STUDY = {
  slug: 'acme-zero-touch-close',
  title: 'Acme Zero-Touch Close',
  clientName: 'Acme Corp',
  industry: { slug: 'finance', name: 'Finance & Accounting', description: null },
  body: '<p>Full body.</p>',
  excerpt: 'Acme automated month-end close.',
  editorBlocks: null,
  challenge: 'Manual month-end close took 10 days.',
  solutionApproach: 'Deployed Zero-Touch Close.',
  implementation: 'Rolled out over 6 weeks.',
  results: 'Close time dropped to 1 day.',
  testimonial: { quote: 'Game changer.', authorName: 'Jane Doe', authorTitle: 'VP Finance, Acme Corp' },
  technologies: ['React', 'PostgreSQL'],
  gallery: [{ url: 'https://cdn.example.com/gallery-1.jpg', altText: 'Dashboard', caption: null, width: 800, height: 600 }],
  seo: {},
  featuredMedia: { url: 'https://cdn.example.com/hero.jpg', altText: 'Hero', caption: null, width: 1200, height: 600 },
  ctaForm: { id: 'form-1', name: 'Request a Demo', slug: 'request-a-demo', fields: [], successMessage: 'Thanks!' },
  relatedProducts: [{ slug: 'zero-touch-close', name: 'Zero-Touch Close', type: 'SOLUTION' as const, shortDescription: 'Automates close.' }],
  relatedPages: [{ slug: 'about', title: 'About Us' }],
  relatedPosts: [{ slug: 'hello-world', title: 'Hello World' }],
  publishedAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

describe('CaseStudyDetailPage', () => {
  it('renders every real field: structured content, testimonial, technologies, gallery, related content, and the real CTA form', async () => {
    vi.mocked(publicApi.getCaseStudyBySlug).mockResolvedValue(FULL_CASE_STUDY);

    render(<CaseStudyDetailPage {...BASE_PROPS} />);

    expect(await screen.findByRole('heading', { name: 'Acme Zero-Touch Close', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Finance & Accounting')).toBeInTheDocument();
    expect(screen.getByText('Manual month-end close took 10 days.')).toBeInTheDocument();
    expect(screen.getByText('Deployed Zero-Touch Close.')).toBeInTheDocument();
    expect(screen.getByText('Rolled out over 6 weeks.')).toBeInTheDocument();
    expect(screen.getByText('Close time dropped to 1 day.')).toBeInTheDocument();
    expect(screen.getByText(/Game changer\./)).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByAltText('Hero')).toHaveAttribute('src', 'https://cdn.example.com/hero.jpg');
    expect(screen.getByAltText('Dashboard')).toHaveAttribute('src', 'https://cdn.example.com/gallery-1.jpg');
    expect(screen.getByText('Zero-Touch Close')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    // A real CTA form renders the real interactive form.
    expect(screen.getByTestId('public-form-stub')).toHaveTextContent('form:form-1');
  });

  it('degrades gracefully when optional fields are absent — never fabricates missing content', async () => {
    vi.mocked(publicApi.getCaseStudyBySlug).mockResolvedValue({
      ...FULL_CASE_STUDY,
      clientName: null,
      industry: null,
      challenge: null,
      solutionApproach: null,
      implementation: null,
      results: null,
      testimonial: null,
      technologies: [],
      gallery: [],
      ctaForm: null,
      relatedProducts: [],
      relatedPages: [],
      relatedPosts: [],
    });

    render(<CaseStudyDetailPage {...BASE_PROPS} />);

    expect(await screen.findByRole('heading', { name: 'Acme Zero-Touch Close', level: 1 })).toBeInTheDocument();
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
    expect(screen.queryByText(/The Challenge/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('public-form-stub')).not.toBeInTheDocument();
  });

  it('shows an honest not-found state for an unknown slug, never a blank page', async () => {
    vi.mocked(publicApi.getCaseStudyBySlug).mockRejectedValue(new ApiClientError('Not found', 404));
    vi.mocked(publicApi.getRedirectForPath).mockResolvedValue(null);

    render(<CaseStudyDetailPage {...BASE_PROPS} slug="never-existed" />);

    expect(await screen.findByText('Case study not found')).toBeInTheDocument();
  });
});
