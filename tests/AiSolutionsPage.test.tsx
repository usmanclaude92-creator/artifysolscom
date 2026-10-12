import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AiSolutionsPage } from '../src/components/solutions/AiSolutionsPage';
import { publicApi } from '../src/lib/publicApi';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, listProducts: vi.fn(), listProductCategories: vi.fn(), listIndustries: vi.fn() } };
});

const noop = () => {};

describe('AiSolutionsPage', () => {
  beforeEach(() => {
    vi.mocked(publicApi.listProducts).mockReset();
    vi.mocked(publicApi.listProductCategories).mockReset().mockResolvedValue([]);
    vi.mocked(publicApi.listIndustries).mockReset().mockResolvedValue([]);
  });

  it('renders real ACTIVE products from the catalog API, never a fabricated list', async () => {
    vi.mocked(publicApi.listProducts).mockResolvedValue({
      products: [
        {
          slug: 'real-product',
          code: 'RP-1',
          name: 'Real Product Name',
          type: 'PRODUCT',
          shortDescription: 'A real, honest description.',
          description: 'Full description.',
          isFeatured: true,
          displayOrder: 0,
        },
      ],
      total: 1,
    });

    render(
      <AiSolutionsPage
        onSelectProduct={noop}
        onOpenConsultant={noop}
        onOpenSolutionBuilder={noop}
        onNavigateToContact={noop}
      />
    );

    expect(await screen.findByText('Real Product Name')).toBeInTheDocument();
  });

  it('shows an honest empty state when the catalog has nothing published', async () => {
    vi.mocked(publicApi.listProducts).mockResolvedValue({ products: [], total: 0 });

    render(
      <AiSolutionsPage
        onSelectProduct={noop}
        onOpenConsultant={noop}
        onOpenSolutionBuilder={noop}
        onNavigateToContact={noop}
      />
    );

    await waitFor(() => expect(screen.getByText('No products published yet')).toBeInTheDocument());
  });

  // Phase 10 (Products + Services + Solutions, Artify-Backend repo) — a real
  // SOLUTION-type catalog row renders with its own filter and badge, not
  // folded into "Product"/"Service".
  it('filters to real SOLUTION-type catalog rows and labels them "Solution"', async () => {
    vi.mocked(publicApi.listProducts).mockResolvedValue({
      products: [
        { slug: 'real-solution', code: 'SOL-1', name: 'Zero-Touch Close', type: 'SOLUTION', shortDescription: 'Real solution copy.', description: 'Full.', isFeatured: false, displayOrder: 0 },
        { slug: 'real-product', code: 'RP-1', name: 'Real Product Name', type: 'PRODUCT', shortDescription: 'A real description.', description: 'Full.', isFeatured: false, displayOrder: 1 },
      ],
      total: 2,
    });

    render(
      <AiSolutionsPage onSelectProduct={noop} onOpenConsultant={noop} onOpenSolutionBuilder={noop} onNavigateToContact={noop} />
    );

    expect(await screen.findByText('Zero-Touch Close')).toBeInTheDocument();
    expect(screen.getByText('Solution')).toBeInTheDocument();

    screen.getByRole('button', { name: 'Solutions' }).click();
    await waitFor(() => {
      expect(screen.getByText('Zero-Touch Close')).toBeInTheDocument();
      expect(screen.queryByText('Real Product Name')).not.toBeInTheDocument();
    });
  });

  it('offers the categories and industries from the Control Center and filters the catalog by them', async () => {
    vi.mocked(publicApi.listProducts).mockResolvedValue({ products: [], total: 0 });
    vi.mocked(publicApi.listProductCategories).mockResolvedValue([{ slug: 'security', name: 'Security & Sovereignty', description: null }]);
    vi.mocked(publicApi.listIndustries).mockResolvedValue([{ slug: 'aviation', name: 'Aviation', description: null }]);

    render(<AiSolutionsPage onSelectProduct={noop} onOpenConsultant={noop} onOpenSolutionBuilder={noop} onNavigateToContact={noop} />);

    fireEvent.change(await screen.findByLabelText('Filter by category'), { target: { value: 'security' } });
    await waitFor(() => expect(publicApi.listProducts).toHaveBeenLastCalledWith(expect.objectContaining({ categorySlug: 'security' })));
    fireEvent.change(screen.getByLabelText('Filter by industry'), { target: { value: 'aviation' } });
    await waitFor(() => expect(publicApi.listProducts).toHaveBeenLastCalledWith(expect.objectContaining({ categorySlug: 'security', industrySlug: 'aviation' })));
  });
});
