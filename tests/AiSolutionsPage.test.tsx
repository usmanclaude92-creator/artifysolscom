import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AiSolutionsPage } from '../src/components/solutions/AiSolutionsPage';
import { publicApi } from '../src/lib/publicApi';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, listProducts: vi.fn() } };
});

const noop = () => {};

describe('AiSolutionsPage', () => {
  beforeEach(() => {
    vi.mocked(publicApi.listProducts).mockReset();
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
});
