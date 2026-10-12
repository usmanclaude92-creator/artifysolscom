import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalSearchModal } from '../src/components/GlobalSearchModal';
import { publicApi } from '../src/lib/publicApi';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, listProducts: vi.fn(), listPosts: vi.fn(), listIndustries: vi.fn() } };
});

const noop = () => {};
Element.prototype.scrollIntoView = () => {};

describe('GlobalSearchModal', () => {
  beforeEach(() => {
    vi.mocked(publicApi.listPosts).mockResolvedValue({ posts: [], total: 0 } as never);
    vi.mocked(publicApi.listIndustries).mockResolvedValue([]);
  });

  it('lists solutions from the catalog API only, never a built-in fictional list', async () => {
    vi.mocked(publicApi.listProducts).mockResolvedValue({
      products: [{ slug: 'real-solution', code: 'S-1', name: 'Real Solution Alpha', type: 'SOLUTION', shortDescription: 'Built for real.', description: '', isFeatured: false, displayOrder: 0 }],
      total: 1,
    });
    render(<GlobalSearchModal isOpen onClose={noop} onNavigateToRoute={noop} onOpenConsultant={noop} onOpenSolutionBuilder={noop} onOpenClientPortal={noop} theme="dark" />);
    fireEvent.change(await screen.findByRole('textbox'), { target: { value: 'solution' } });
    expect(await screen.findByText('Real Solution Alpha')).toBeInTheDocument();
    expect(screen.getAllByText('Enterprise Solution').length).toBeGreaterThan(0);
    await waitFor(() => expect(screen.queryByText(/Artify Enterprise Platform/)).toBeNull());
  });
});
