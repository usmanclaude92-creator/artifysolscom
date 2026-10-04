/**
 * Phase 11 (Case Studies + Content Relationships, Artify-Backend repo) —
 * the existing illustrative /case-studies page (CaseStudiesPage.tsx) keeps
 * rendering its honest "Illustrative Architecture Scenarios" content
 * unchanged, and additively shows a real "Customer Case Studies" section
 * only when the backend actually has published case studies — never a
 * fabricated list, and never breaking the existing fallback when none
 * exist yet (every org today).
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CaseStudiesPage } from '../src/components/pages/CaseStudiesPage';
import { publicApi } from '../src/lib/publicApi';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, listCaseStudies: vi.fn() } };
});

const noop = () => {};
const BASE_PROPS = { onOpenSolutionBuilder: noop, onNavigateToContact: noop };

describe('CaseStudiesPage (artifysolscom illustrative page)', () => {
  it('keeps rendering the existing illustrative content when no real case studies are published yet', async () => {
    vi.mocked(publicApi.listCaseStudies).mockResolvedValue({ caseStudies: [], total: 0 });

    render(<CaseStudiesPage {...BASE_PROPS} />);

    expect(await screen.findByText('Illustrative Architecture Scenarios')).toBeInTheDocument();
    expect(screen.queryByText('Customer Case Studies')).not.toBeInTheDocument();
  });

  it('additively shows real published case studies above the illustrative content, and navigates to the real detail route on click', async () => {
    vi.mocked(publicApi.listCaseStudies).mockResolvedValue({
      caseStudies: [
        {
          slug: 'acme-zero-touch-close',
          title: 'Acme Zero-Touch Close',
          clientName: 'Acme Corp',
          industry: { slug: 'finance', name: 'Finance & Accounting', description: null },
          body: '<p>Full.</p>',
          excerpt: 'Acme automated month-end close.',
          editorBlocks: null,
          challenge: null,
          solutionApproach: null,
          implementation: null,
          results: null,
          testimonial: null,
          technologies: [],
          gallery: [],
          seo: {},
          featuredMedia: null,
          ctaForm: null,
          relatedProducts: [],
          relatedPages: [],
          relatedPosts: [],
          publishedAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      total: 1,
    });
    const onSelectCaseStudy = vi.fn();

    render(<CaseStudiesPage {...BASE_PROPS} onSelectCaseStudy={onSelectCaseStudy} />);

    expect(await screen.findByText('Customer Case Studies')).toBeInTheDocument();
    expect(screen.getByText('Acme Zero-Touch Close')).toBeInTheDocument();
    // The existing illustrative content is still present, unaffected.
    expect(screen.getByText('Illustrative Architecture Scenarios')).toBeInTheDocument();

    screen.getByRole('button', { name: /Acme Zero-Touch Close/ }).click();
    await waitFor(() => expect(onSelectCaseStudy).toHaveBeenCalledWith('acme-zero-touch-close'));
  });
});
