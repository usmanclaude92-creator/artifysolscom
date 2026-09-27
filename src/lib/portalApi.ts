/**
 * Client Portal API client — thin, typed wrapper over apiClient.ts scoped
 * to the authenticated `/api/v1/portal/*` surface (Artify-Backend's Phase
 * 10 — docs/CLIENT_PORTAL_ARCHITECTURE.md). This surface is entirely
 * read-only server-side: there is no write endpoint for subscriptions,
 * invoices, payments, or contracts from the portal, so this client never
 * exposes a mutation. Every shape here mirrors clientPortalService's real
 * return value exactly — nothing here fabricates a field the backend
 * didn't send. Decimal money fields (contractValue, price, total, etc.)
 * arrive as strings (decimal.js's default JSON serialization) and are
 * never coerced to a JS number for calculation — only for display.
 */
import { apiClient, ApiClientError } from './apiClient';

export type ContractStatusValue = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'TERMINATED';
export type SubscriptionStatusValue = 'DRAFT' | 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
export type BillingCycleValue = 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
export type InvoiceStatusValue = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'VOID' | 'CANCELLED';
export type PaymentMethodValue = 'BANK_TRANSFER' | 'CARD' | 'CASH' | 'CHEQUE' | 'ONLINE' | 'OTHER';
export type PaymentStatusValue = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface PortalContractVariation {
  id: string;
  variationNumber: number;
  amount: string;
  effectiveDate: string;
  reason: string;
  createdAt: string;
}

export interface PortalContract {
  id: string;
  contractNumber: string;
  title: string;
  description: string | null;
  status: ContractStatusValue;
  startDate: string;
  endDate: string | null;
  contractValue: string;
  currentValue: string;
  currency: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  variations: PortalContractVariation[];
}

export interface PortalSubscriptionItem {
  id: string;
  productModuleId: string | null;
  description: string;
  quantity: number;
  unitPrice: string;
  currency: string;
}

export interface PortalSubscription {
  id: string;
  subscriptionNumber: string;
  productId: string;
  status: SubscriptionStatusValue;
  startDate: string;
  renewalDate: string | null;
  endDate: string | null;
  billingCycle: BillingCycleValue;
  quantity: number;
  price: string;
  currency: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  items?: PortalSubscriptionItem[];
}

export interface PortalInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  discount: string;
  lineTotal: string;
}

export interface PortalPayment {
  id: string;
  invoiceId: string;
  amount: string;
  currency: string;
  paymentDate: string;
  method: PaymentMethodValue;
  reference: string | null;
  status: PaymentStatusValue;
  notes: string | null;
  createdAt: string;
}

export interface PortalInvoice {
  id: string;
  invoiceNumber: string;
  contractId: string | null;
  subscriptionId: string | null;
  status: InvoiceStatusValue;
  effectiveStatus: InvoiceStatusValue;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  amountPaid: string;
  amountDue: string;
  notes: string | null;
  voidReason: string | null;
  createdAt: string;
  updatedAt: string;
  items?: PortalInvoiceItem[];
  payments?: PortalPayment[];
}

export interface PortalDashboard {
  activeContractCount: number;
  activeSubscriptionCount: number;
  outstandingInvoiceCount: number;
  amountDue: string;
  currency: string | undefined;
  recentPayments: PortalPayment[];
}

interface PagedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

/**
 * A caller whose session organization has no Client row provisioned as a
 * workspace (clientPortalService's `resolveClientForCaller`) gets a real
 * 403 from every one of these endpoints — surfaced here as a distinct,
 * recognizable error so the UI can show an honest "no workspace linked"
 * state instead of a generic failure message.
 */
export class NoWorkspaceError extends Error {
  constructor() {
    super('No client portal is associated with the current account.');
    this.name = 'NoWorkspaceError';
  }
}

async function unwrapPortalCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const isNoWorkspace = err instanceof ApiClientError && err.status === 403 && /no client portal/i.test(err.message);
    if (isNoWorkspace) throw new NoWorkspaceError();
    throw err;
  }
}

function pageParams(page?: number, limit?: number): string {
  const query = new URLSearchParams();
  if (page) query.set('page', String(page));
  if (limit) query.set('limit', String(limit));
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const portalApi = {
  async getDashboard(): Promise<PortalDashboard> {
    return unwrapPortalCall(async () => {
      const { dashboard } = await apiClient.get<{ dashboard: PortalDashboard }>('/portal/dashboard');
      return dashboard;
    });
  },

  async listContracts(page?: number, limit?: number): Promise<PagedResult<PortalContract>> {
    return unwrapPortalCall(async () => {
      const { contracts } = await apiClient.get<{ contracts: PortalContract[] }>(`/portal/contracts${pageParams(page, limit)}`);
      return { items: contracts, page: page ?? 1, limit: limit ?? 20, total: contracts.length };
    });
  },

  async getContract(id: string): Promise<PortalContract> {
    return unwrapPortalCall(async () => {
      const { contract } = await apiClient.get<{ contract: PortalContract }>(`/portal/contracts/${encodeURIComponent(id)}`);
      return contract;
    });
  },

  async listSubscriptions(page?: number, limit?: number): Promise<PagedResult<PortalSubscription>> {
    return unwrapPortalCall(async () => {
      const { subscriptions } = await apiClient.get<{ subscriptions: PortalSubscription[] }>(
        `/portal/subscriptions${pageParams(page, limit)}`
      );
      return { items: subscriptions, page: page ?? 1, limit: limit ?? 20, total: subscriptions.length };
    });
  },

  async getSubscription(id: string): Promise<PortalSubscription> {
    return unwrapPortalCall(async () => {
      const { subscription } = await apiClient.get<{ subscription: PortalSubscription }>(`/portal/subscriptions/${encodeURIComponent(id)}`);
      return subscription;
    });
  },

  async listInvoices(page?: number, limit?: number, status?: InvoiceStatusValue): Promise<PagedResult<PortalInvoice>> {
    return unwrapPortalCall(async () => {
      const qs = new URLSearchParams();
      if (page) qs.set('page', String(page));
      if (limit) qs.set('limit', String(limit));
      if (status) qs.set('status', status);
      const query = qs.toString();
      const { invoices } = await apiClient.get<{ invoices: PortalInvoice[] }>(`/portal/invoices${query ? `?${query}` : ''}`);
      return { items: invoices, page: page ?? 1, limit: limit ?? 20, total: invoices.length };
    });
  },

  async getInvoice(id: string): Promise<PortalInvoice> {
    return unwrapPortalCall(async () => {
      const { invoice } = await apiClient.get<{ invoice: PortalInvoice }>(`/portal/invoices/${encodeURIComponent(id)}`);
      return invoice;
    });
  },

  async listPayments(page?: number, limit?: number): Promise<PagedResult<PortalPayment>> {
    return unwrapPortalCall(async () => {
      const { payments } = await apiClient.get<{ payments: PortalPayment[] }>(`/portal/payments${pageParams(page, limit)}`);
      return { items: payments, page: page ?? 1, limit: limit ?? 20, total: payments.length };
    });
  },
};

/** Formats a Decimal-as-string money value for display — never used as a calculation input. */
export function formatMoney(value: string | undefined | null, currency: string | undefined | null): string {
  if (value === undefined || value === null) return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return `${currency ?? ''} ${value}`.trim();
  const formatted = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency ? `${currency} ${formatted}` : formatted;
}
