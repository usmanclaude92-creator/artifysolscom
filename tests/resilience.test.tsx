import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { apiClient, ApiClientError } from '../src/lib/apiClient';
import { importWithRetry } from '../src/lib/lazyWithRetry';
import { LoadFailureBoundary } from '../src/components/LoadFailureBoundary';

const ok = (data: unknown) => new Response(JSON.stringify({ success: true, data, meta: { requestId: 'r', timestamp: 't' } }), { status: 200 });
const html502 = () => new Response('<html>Bad Gateway</html>', { status: 502 });

describe('apiClient retries transient failures (GET only)', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => { fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('retries a 502 and returns the later success', async () => {
    fetchMock.mockResolvedValueOnce(html502()).mockResolvedValueOnce(html502()).mockResolvedValueOnce(ok({ a: 1 }));
    await expect(apiClient.get('/public/x', { retryDelayMs: 1 })).resolves.toEqual({ a: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('retries a network error once it recovers', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fail')).mockResolvedValueOnce(ok([]));
    await expect(apiClient.get('/public/x', { retryDelayMs: 1 })).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('gives up after 2 retries and throws the last error', async () => {
    fetchMock.mockImplementation(async () => html502());
    await expect(apiClient.get('/public/x', { retryDelayMs: 1 })).rejects.toMatchObject({ status: 502 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('does not retry a real 404 or a validation error', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'no', requestId: 'r' }, meta: { requestId: 'r', timestamp: 't' } }), { status: 404 }));
    await expect(apiClient.get('/public/x', { retryDelayMs: 1 })).rejects.toBeInstanceOf(ApiClientError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('never repeats a write (POST) after a 502', async () => {
    fetchMock.mockImplementation(async () => html502());
    await expect(apiClient.post('/public/leads', { a: 1 }, { retryDelayMs: 1 })).rejects.toMatchObject({ status: 502 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('importWithRetry', () => {
  beforeEach(() => { sessionStorage.clear(); });

  it('retries a failed chunk download and resolves', async () => {
    const factory = vi.fn().mockRejectedValueOnce(new Error('x')).mockResolvedValueOnce({ default: 1 });
    await expect(importWithRetry(factory, 2, 1)).resolves.toEqual({ default: 1 });
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('throws after the retries when a reload already happened in the last minute (no reload loop)', async () => {
    sessionStorage.setItem('artify.chunkReloadAt', String(Date.now()));
    const factory = vi.fn().mockRejectedValue(new Error('still down'));
    await expect(importWithRetry(factory, 1, 1)).rejects.toThrow('still down');
    expect(factory).toHaveBeenCalledTimes(2);
  });
});

describe('LoadFailureBoundary', () => {
  const Boom: React.FC = () => { throw new Error('chunk failed'); };
  beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('shows a friendly reload message in place of the failed section', () => {
    render(<LoadFailureBoundary><Boom /></LoadFailureBoundary>);
    expect(screen.getByRole('alert')).toHaveTextContent("didn't load");
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
  });

  it('renders nothing for optional overlays when silent', () => {
    const { container } = render(<LoadFailureBoundary silent><Boom /></LoadFailureBoundary>);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders children normally', () => {
    render(<LoadFailureBoundary><p>fine</p></LoadFailureBoundary>);
    expect(screen.getByText('fine')).toBeInTheDocument();
  });
});
