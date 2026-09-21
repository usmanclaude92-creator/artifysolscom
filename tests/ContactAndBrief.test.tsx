import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactAndBrief } from '../src/components/ContactAndBrief';
import { publicApi } from '../src/lib/publicApi';
import { ApiClientError } from '../src/lib/apiClient';

vi.mock('../src/lib/publicApi', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/publicApi')>('../src/lib/publicApi');
  return { ...actual, publicApi: { ...actual.publicApi, submitLead: vi.fn() } };
});

function fillRequiredFields() {
  fireEvent.change(screen.getByPlaceholderText('Sarah Jenkins'), { target: { value: 'Sarah Jenkins' } });
  fireEvent.change(screen.getByPlaceholderText('Acme Enterprise Holdings'), { target: { value: 'Acme Inc' } });
  fireEvent.change(screen.getByPlaceholderText('s.jenkins@acme.com'), { target: { value: 'sarah@acme.com' } });
  fireEvent.change(screen.getByPlaceholderText(/Describe your current manual processes/), {
    target: { value: 'We need automation.' },
  });
  fireEvent.click(screen.getByLabelText(/I agree to be contacted/));
}

describe('ContactAndBrief', () => {
  beforeEach(() => {
    vi.mocked(publicApi.submitLead).mockReset();
  });

  it('requires consent before submitting', async () => {
    render(<ContactAndBrief />);
    fireEvent.change(screen.getByPlaceholderText('Sarah Jenkins'), { target: { value: 'Sarah Jenkins' } });
    fireEvent.change(screen.getByPlaceholderText('Acme Enterprise Holdings'), { target: { value: 'Acme Inc' } });
    fireEvent.change(screen.getByPlaceholderText('s.jenkins@acme.com'), { target: { value: 'sarah@acme.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your current manual processes/), {
      target: { value: 'We need automation.' },
    });

    fireEvent.click(screen.getByText('Request an AI Architecture Session'));

    expect(publicApi.submitLead).not.toHaveBeenCalled();
    expect(await screen.findByText(/confirm you agree to be contacted/)).toBeInTheDocument();
  });

  it('submits to the real public leads API and shows the real confirmation message on success', async () => {
    vi.mocked(publicApi.submitLead).mockResolvedValue({ message: 'Thanks — we received your brief.' });
    render(<ContactAndBrief />);
    fillRequiredFields();

    fireEvent.click(screen.getByText('Request an AI Architecture Session'));

    await waitFor(() => expect(publicApi.submitLead).toHaveBeenCalledTimes(1));
    const payload = vi.mocked(publicApi.submitLead).mock.calls[0][0];
    expect(payload.source).toBe('project_brief');
    expect(payload.consent).toBe(true);

    expect(await screen.findByText('Thanks — we received your brief.')).toBeInTheDocument();
  });

  it('shows an honest failure state instead of a fabricated success when the API call fails', async () => {
    vi.mocked(publicApi.submitLead).mockRejectedValue(
      new ApiClientError('Network error contacting the Artify Platform API.', { code: 'NETWORK_ERROR', status: 0 })
    );
    render(<ContactAndBrief />);
    fillRequiredFields();

    fireEvent.click(screen.getByText('Request an AI Architecture Session'));

    expect(await screen.findByText('Network error contacting the Artify Platform API.')).toBeInTheDocument();
    expect(screen.queryByText('Project Brief Received')).not.toBeInTheDocument();
  });
});
