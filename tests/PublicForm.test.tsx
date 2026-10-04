/**
 * Phase 9 (Forms + Landing Pages + Conversion) — the public site's generic
 * Form renderer: real field definitions, real submission, validation,
 * honeypot, conditional visibility, UTM/landing-page capture, honest
 * success/error states.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PublicForm } from '../src/components/forms/PublicForm';
import { publicApi } from '../src/lib/publicApi';
import { ApiClientError } from '../src/lib/apiClient';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, getForm: vi.fn(), getFormById: vi.fn(), submitForm: vi.fn() } };
});

const CONTACT_FORM = {
  id: 'form-1',
  name: 'Contact Us',
  slug: 'contact-us',
  fields: [
    { key: 'name', label: 'Full name', type: 'text' as const, required: true },
    { key: 'email', label: 'Email', type: 'email' as const, required: true },
    { key: 'message', label: 'Message', type: 'textarea' as const, required: false },
  ],
  successMessage: 'Thanks — we received your message.',
};

describe('PublicForm', () => {
  beforeEach(() => {
    vi.mocked(publicApi.getForm).mockReset();
    vi.mocked(publicApi.getFormById).mockReset();
    vi.mocked(publicApi.submitForm).mockReset();
    window.history.pushState({}, '', '/');
  });

  it('fetches real field definitions by slug and renders real inputs for each field', async () => {
    vi.mocked(publicApi.getForm).mockResolvedValue(CONTACT_FORM);
    render(<PublicForm slug="contact-us" />);

    expect(await screen.findByLabelText('Full name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(publicApi.getForm).toHaveBeenCalledWith('contact-us');
  });

  it('fetches by id when given formId instead of slug', async () => {
    vi.mocked(publicApi.getFormById).mockResolvedValue(CONTACT_FORM);
    render(<PublicForm formId="form-1" />);
    expect(await screen.findByLabelText('Full name *')).toBeInTheDocument();
    expect(publicApi.getFormById).toHaveBeenCalledWith('form-1');
  });

  it('shows a real not-found/error state — never a blank page — when the form fails to load', async () => {
    vi.mocked(publicApi.getForm).mockRejectedValue(new ApiClientError('Form not found.', { code: 'NOT_FOUND', status: 404 }));
    render(<PublicForm slug="never-existed" />);
    expect(await screen.findByText('Form not found.')).toBeInTheDocument();
  });

  it('validates required fields client-side before ever calling submitForm', async () => {
    vi.mocked(publicApi.getForm).mockResolvedValue(CONTACT_FORM);
    render(<PublicForm slug="contact-us" />);
    await screen.findByLabelText('Full name *');

    fireEvent.click(screen.getByText('Submit'));

    expect(await screen.findByText(/"Full name" is required/)).toBeInTheDocument();
    expect(publicApi.submitForm).not.toHaveBeenCalled();
  });

  it('submits real field values plus UTM params and landing page path, and shows the real success message', async () => {
    vi.mocked(publicApi.getForm).mockResolvedValue(CONTACT_FORM);
    vi.mocked(publicApi.submitForm).mockResolvedValue({ message: CONTACT_FORM.successMessage });
    window.history.pushState({}, '', '/landing/spring-sale?utm_source=google&utm_medium=cpc');

    render(<PublicForm slug="contact-us" />);
    await screen.findByLabelText('Full name *');
    fireEvent.change(screen.getByLabelText('Full name *'), { target: { value: 'Jane Visitor' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(publicApi.submitForm).toHaveBeenCalledTimes(1));
    const [slug, payload] = vi.mocked(publicApi.submitForm).mock.calls[0];
    expect(slug).toBe('contact-us');
    expect(payload.data).toEqual({ name: 'Jane Visitor', email: 'jane@example.com' });
    expect(payload.utmSource).toBe('google');
    expect(payload.utmMedium).toBe('cpc');
    expect(payload.landingPagePath).toBe('/landing/spring-sale');
    expect(payload.website).toBe(''); // honeypot, untouched by a real visitor

    expect(await screen.findByText(CONTACT_FORM.successMessage)).toBeInTheDocument();
  });

  it('shows an honest failure state instead of a fabricated success when the API call fails', async () => {
    vi.mocked(publicApi.getForm).mockResolvedValue(CONTACT_FORM);
    vi.mocked(publicApi.submitForm).mockRejectedValue(new ApiClientError('Too many requests.', { code: 'RATE_LIMITED', status: 429 }));
    render(<PublicForm slug="contact-us" />);
    await screen.findByLabelText('Full name *');
    fireEvent.change(screen.getByLabelText('Full name *'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByText('Submit'));

    expect(await screen.findByText('Too many requests.')).toBeInTheDocument();
    expect(screen.queryByText(CONTACT_FORM.successMessage)).not.toBeInTheDocument();
  });

  it('only requires/shows a conditionally-visible field once its visibleWhen condition is met', async () => {
    const formWithConditional = {
      ...CONTACT_FORM,
      fields: [
        { key: 'name', label: 'Full name', type: 'text' as const, required: true },
        {
          key: 'plan',
          label: 'Plan',
          type: 'select' as const,
          required: true,
          options: [
            { value: 'basic', label: 'Basic' },
            { value: 'pro', label: 'Pro' },
          ],
        },
        {
          key: 'company_size',
          label: 'Company size',
          type: 'text' as const,
          required: true,
          visibleWhen: { fieldKey: 'plan', equals: 'pro' },
        },
      ],
    };
    vi.mocked(publicApi.getForm).mockResolvedValue(formWithConditional);
    vi.mocked(publicApi.submitForm).mockResolvedValue({ message: 'ok' });
    render(<PublicForm slug="contact-us" />);
    await screen.findByLabelText('Full name *');

    // "Company size" is not visible yet (plan is unset).
    expect(screen.queryByLabelText(/Company size/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Full name *'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Plan *'), { target: { value: 'basic' } });
    fireEvent.click(screen.getByText('Submit'));
    // Still not required while hidden — submitting with "basic" (no company_size) succeeds.
    await waitFor(() => expect(publicApi.submitForm).toHaveBeenCalledTimes(1));
    expect(vi.mocked(publicApi.submitForm).mock.calls[0][1].data).not.toHaveProperty('company_size');
  });

  it('requires a conditionally-visible field once its visibleWhen condition is met', async () => {
    const formWithConditional = {
      ...CONTACT_FORM,
      fields: [
        { key: 'name', label: 'Full name', type: 'text' as const, required: true },
        {
          key: 'plan',
          label: 'Plan',
          type: 'select' as const,
          required: true,
          options: [
            { value: 'basic', label: 'Basic' },
            { value: 'pro', label: 'Pro' },
          ],
        },
        {
          key: 'company_size',
          label: 'Company size',
          type: 'text' as const,
          required: true,
          visibleWhen: { fieldKey: 'plan', equals: 'pro' },
        },
      ],
    };
    vi.mocked(publicApi.getForm).mockResolvedValue(formWithConditional);
    render(<PublicForm slug="contact-us" />);
    await screen.findByLabelText('Full name *');
    fireEvent.change(screen.getByLabelText('Full name *'), { target: { value: 'Jane' } });

    // Selecting "pro" reveals the field, which then becomes genuinely required.
    fireEvent.change(screen.getByLabelText('Plan *'), { target: { value: 'pro' } });
    expect(await screen.findByLabelText('Company size *')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Submit'));
    expect(await screen.findByText(/"Company size" is required/)).toBeInTheDocument();
    expect(publicApi.submitForm).not.toHaveBeenCalled();
  });

  it('silently discards a honeypot-triggered submission the same way as a real one from the caller UI perspective', async () => {
    vi.mocked(publicApi.getForm).mockResolvedValue(CONTACT_FORM);
    vi.mocked(publicApi.submitForm).mockResolvedValue({ message: CONTACT_FORM.successMessage });
    render(<PublicForm slug="contact-us" />);
    await screen.findByLabelText('Full name *');
    fireEvent.change(screen.getByLabelText('Full name *'), { target: { value: 'Bot' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'bot@example.com' } });
    // A real visitor never sees/fills the honeypot — this simulates a bot that fills every field it finds.
    fireEvent.change(document.getElementById('public-form-website')!, { target: { value: 'http://spam.example' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(publicApi.submitForm).toHaveBeenCalledTimes(1));
    expect(vi.mocked(publicApi.submitForm).mock.calls[0][1].website).toBe('http://spam.example');
  });
});
