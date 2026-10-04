/**
 * Phase 9 (Forms + Landing Pages + Conversion) — the public renderer for a
 * Page's real Site Editor composition. Covers the block types a landing
 * page actually uses for conversion (form/testimonial/button) plus the
 * safe-degrade cases (no image URL resolved yet, no quote set).
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PublicBlockRenderer } from '../src/components/blocks/PublicBlockRenderer';
import type { PublicEditorBlock } from '../src/lib/publicApi';

vi.mock('../src/components/forms/PublicForm', () => ({
  PublicForm: ({ formId }: { formId?: string }) => <div data-testid="public-form-stub">form:{formId}</div>,
}));

describe('PublicBlockRenderer', () => {
  it('renders heading/text/button blocks with real content', () => {
    const blocks: PublicEditorBlock[] = [
      { id: 'h', type: 'heading', props: { text: 'Welcome', level: 1 } },
      { id: 't', type: 'text', props: { html: '<p>Real body copy.</p>' } },
      { id: 'b', type: 'button', props: { label: 'Get started', href: '/signup', variant: 'primary' } },
    ];
    render(<PublicBlockRenderer blocks={blocks} />);
    expect(screen.getByText('Welcome').tagName).toBe('H1');
    expect(screen.getByText('Real body copy.')).toBeInTheDocument();
    expect(screen.getByText('Get started').closest('a')).toHaveAttribute('href', '/signup');
  });

  it('renders a form block as the real interactive PublicForm, by formId', () => {
    const blocks: PublicEditorBlock[] = [{ id: 'f', type: 'form', props: { formId: 'form-123' } }];
    render(<PublicBlockRenderer blocks={blocks} />);
    expect(screen.getByTestId('public-form-stub')).toHaveTextContent('form:form-123');
  });

  it('renders nothing for a form block with no formId selected yet (never a broken embed)', () => {
    const blocks: PublicEditorBlock[] = [{ id: 'f', type: 'form', props: { formId: '' } }];
    const { container } = render(<PublicBlockRenderer blocks={blocks} />);
    expect(container.textContent).toBe('');
  });

  it('renders a testimonial with its quote and author, and the resolved avatar URL (never a raw mediaId)', () => {
    const blocks: PublicEditorBlock[] = [
      { id: 'q', type: 'testimonial', props: { quote: 'This changed how we work.', authorName: 'Jane Doe', authorTitle: 'COO, Acme', resolvedAvatarUrl: 'https://cdn.example.com/jane.jpg' } },
    ];
    render(<PublicBlockRenderer blocks={blocks} />);
    expect(screen.getByText('This changed how we work.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('COO, Acme')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.example.com/jane.jpg');
  });

  it('omits a testimonial block entirely when it has no quote', () => {
    const blocks: PublicEditorBlock[] = [{ id: 'q', type: 'testimonial', props: { quote: '' } }];
    const { container } = render(<PublicBlockRenderer blocks={blocks} />);
    expect(container.textContent).toBe('');
  });

  it('only renders an image once a real resolvedUrl is present (never a raw internal mediaId leaked to the DOM)', () => {
    const unresolved: PublicEditorBlock[] = [{ id: 'i', type: 'image', props: { mediaId: 'internal-id-1', alt: 'pic' } }];
    const { container } = render(<PublicBlockRenderer blocks={unresolved} />);
    expect(container.querySelector('img')).toBeNull();

    const resolved: PublicEditorBlock[] = [{ id: 'i', type: 'image', props: { resolvedUrl: 'https://cdn.example.com/pic.jpg', alt: 'pic' } }];
    render(<PublicBlockRenderer blocks={resolved} />);
    expect(screen.getByAltText('pic')).toHaveAttribute('src', 'https://cdn.example.com/pic.jpg');
  });

  it('renders nested columns/section children recursively', () => {
    const blocks: PublicEditorBlock[] = [
      {
        id: 's',
        type: 'section',
        props: {},
        children: [{ id: 'c', type: 'columns', props: { columnCount: 2 }, children: [{ id: 'h', type: 'heading', props: { text: 'Nested', level: 2 } }] }],
      },
    ];
    render(<PublicBlockRenderer blocks={blocks} />);
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });

  it('renders nothing for templatePart/navigationMenu blocks embedded in page content (not resolved here, never a confusing stray placeholder)', () => {
    const blocks: PublicEditorBlock[] = [
      { id: 'tp', type: 'templatePart', props: { templatePartId: 'x' } },
      { id: 'nm', type: 'navigationMenu', props: { navigationMenuId: 'y' } },
    ];
    const { container } = render(<PublicBlockRenderer blocks={blocks} />);
    expect(container.textContent).toBe('');
  });
});
