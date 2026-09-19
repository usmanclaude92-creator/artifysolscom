/**
 * Canonical Platform API client (Phase 1 §25, §14).
 *
 * This is the ONLY place in this frontend that should construct a request
 * to the Artify Platform API (hosted by the Artify-Backend repo — see that
 * repo's docs/ADR/ADR-001-platform-boundary.md and
 * docs/INTEGRATION_ARCHITECTURE.md). It centralizes the base URL,
 * credentials, headers, timeout, and response-envelope parsing so
 * components never call `fetch` directly against the platform.
 *
 * Scope note: this is the abstraction only. No existing screen has been
 * rewired to use it yet — AuthContext.tsx, the portal's subscription/
 * invoice/API-key screens, and the legacy /api/ai-consultant +
 * /api/brief-submit calls documented in docs/CURRENT_STATE.md §2.6 (in the
 * Artify-Backend repo) are Phase 4/11 work, not Phase 1. The two calls
 * that already hit the real backend today (PortalSeoHealth.tsx's
 * /api/v1/cms/seo-telemetry and /optimize-meta) are also left as-is for
 * now — migrating them to this client is a small, safe follow-up but not
 * required to prove the abstraction exists.
 */

const DEFAULT_BASE_URL = "/api/v1";
const DEFAULT_TIMEOUT_MS = 15000;

function resolveBaseUrl(): string {
  const configured = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
    ?.VITE_PLATFORM_API_BASE_URL;
  return configured && configured.length > 0 ? configured : DEFAULT_BASE_URL;
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  meta: { requestId: string; timestamp: string; pagination?: unknown };
}

export interface ApiErrorEnvelope {
  success: false;
  error: { code: string; message: string; details?: unknown; requestId: string };
  meta: { requestId: string; timestamp: string };
}

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly requestId: string | undefined;
  public readonly details: unknown;

  constructor(message: string, opts: { code: string; status: number; requestId?: string; details?: unknown }) {
    super(message);
    this.name = "ApiClientError";
    this.code = opts.code;
    this.status = opts.status;
    this.requestId = opts.requestId;
    this.details = opts.details;
  }
}

/** Injected by the app's auth layer once Phase 4 wires real sessions — absent today by design. */
let authTokenGetter: (() => string | null) | null = null;
export function setAuthTokenGetter(getter: (() => string | null) | null): void {
  authTokenGetter = getter;
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  timeoutMs?: number;
  signal?: AbortSignal;
}

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const baseUrl = resolveBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = authTokenGetter?.();
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  // Let an externally-provided signal abort too, without fighting our own timeout controller.
  options.signal?.addEventListener("abort", () => controller.abort());

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      credentials: "include",
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiClientError("Request timed out.", { code: "TIMEOUT", status: 0 });
    }
    throw new ApiClientError("Network error contacting the Artify Platform API.", { code: "NETWORK_ERROR", status: 0 });
  }
  clearTimeout(timeout);

  const requestId = response.headers.get("X-Request-Id") ?? undefined;

  let payload: ApiSuccessEnvelope<T> | ApiErrorEnvelope | undefined;
  try {
    payload = (await response.json()) as ApiSuccessEnvelope<T> | ApiErrorEnvelope;
  } catch {
    payload = undefined;
  }

  if (!response.ok || !payload || payload.success === false) {
    const errorPayload = payload && payload.success === false ? payload.error : undefined;
    throw new ApiClientError(errorPayload?.message ?? `Request failed with status ${response.status}`, {
      code: errorPayload?.code ?? "UNKNOWN_ERROR",
      status: response.status,
      requestId: errorPayload?.requestId ?? requestId,
      details: errorPayload?.details,
    });
  }

  return payload.data;
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
