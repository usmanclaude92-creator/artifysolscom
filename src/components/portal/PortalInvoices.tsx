import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalApi, formatMoney, NoWorkspaceError, PortalInvoice } from '../../lib/portalApi';
import { ApiClientError } from '../../lib/apiClient';
import { Receipt, Printer, X, FileText, AlertCircle, RefreshCw } from 'lucide-react';

const STATUS_TONE: Record<string, string> = {
  PAID: 'emerald',
  ISSUED: 'sky',
  PARTIALLY_PAID: 'amber',
  OVERDUE: 'rose',
  VOID: 'slate',
  CANCELLED: 'slate',
  DRAFT: 'slate',
};

export const PortalInvoices: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const { user } = useAuth();

  const [invoices, setInvoices] = useState<PortalInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noWorkspace, setNoWorkspace] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<PortalInvoice | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = React.useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    setNoWorkspace(false);
    portalApi
      .listInvoices(1, 100)
      .then((res) => setInvoices(res.items))
      .catch((err: unknown) => {
        if (err instanceof NoWorkspaceError) {
          setNoWorkspace(true);
        } else {
          setLoadError(err instanceof ApiClientError ? err.message : 'Unable to load your invoices right now.');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return null;

  const totalBilled = invoices.reduce((acc, inv) => acc + Number(inv.total), 0);
  const currency = invoices[0]?.currency;

  const openInvoice = async (invoiceId: string) => {
    setDetailLoading(true);
    try {
      const full = await portalApi.getInvoice(invoiceId);
      setSelectedInvoice(full);
    } catch (err) {
      setLoadError(err instanceof ApiClientError ? err.message : 'Could not load that invoice.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Invoices & Billing History
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            A real-time view of your invoices, straight from the billing system.
          </p>
        </div>

        {invoices.length > 0 && (
          <div className={`px-4 py-2 rounded-xl border text-right self-start sm:self-auto ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
            <div className={`text-[10px] uppercase font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Total Billed</div>
            <div className={`text-lg font-bold font-mono-code ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {formatMoney(String(totalBilled), currency)}
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className={`p-10 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0c0c14] border-white/[0.08] text-zinc-400'}`}>
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 opacity-60" />
          Loading invoices…
        </div>
      )}

      {!isLoading && noWorkspace && (
        <div className={`p-8 text-center rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
          <h3 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>No client workspace linked yet</h3>
          <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            There are no invoices to show until your account is linked to a provisioned client workspace.
          </p>
        </div>
      )}

      {!isLoading && loadError && (
        <div className={`p-8 text-center rounded-2xl border flex flex-col items-center gap-2 ${
          isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
        }`}>
          <AlertCircle className="w-6 h-6" />
          <p className="text-xs">{loadError}</p>
          <button onClick={load} className="text-xs font-semibold underline">Try again</button>
        </div>
      )}

      {!isLoading && !noWorkspace && !loadError && (
        invoices.length === 0 ? (
          <div className={`p-10 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0c0c14] border-white/[0.08] text-zinc-400'}`}>
            No invoices issued yet.
          </div>
        ) : (
          <div className={`rounded-2xl border overflow-hidden shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08] shadow-xl'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`uppercase font-mono-code text-[11px] border-b ${isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-[#12121e] text-zinc-400 border-white/[0.06]'}`}>
                  <tr>
                    <th className="py-3.5 px-5">Invoice</th>
                    <th className="py-3.5 px-4">Issued / Due</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Amount Due</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-slate-100 text-slate-700' : 'divide-white/[0.04] text-zinc-300'}`}>
                  {invoices.map((inv) => {
                    const tone = STATUS_TONE[inv.effectiveStatus] ?? 'slate';
                    const toneClasses: Record<string, string> = {
                      emerald: isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400',
                      sky: isLight ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-sky-950/60 border-sky-500/30 text-sky-400',
                      amber: isLight ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-amber-950/60 border-amber-500/30 text-amber-400',
                      rose: isLight ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-rose-950/60 border-rose-500/30 text-rose-400',
                      slate: isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/[0.06] border-white/[0.08] text-zinc-400',
                    };
                    return (
                      <tr key={inv.id} className={isLight ? 'hover:bg-slate-50/80 transition-colors' : 'hover:bg-white/[0.02] transition-colors'}>
                        <td className="py-4 px-5">
                          <div className={`font-bold font-mono-code ${isLight ? 'text-slate-900' : 'text-white'}`}>{inv.invoiceNumber}</div>
                        </td>
                        <td className={`py-4 px-4 font-mono-code ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                          {new Date(inv.issueDate).toLocaleDateString()} – {new Date(inv.dueDate).toLocaleDateString()}
                        </td>
                        <td className={`py-4 px-4 font-bold font-mono-code ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {formatMoney(inv.total, inv.currency)}
                        </td>
                        <td className={`py-4 px-4 font-mono-code ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                          {formatMoney(inv.amountDue, inv.currency)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-mono-code font-semibold px-2.5 py-0.5 rounded-full border ${toneClasses[tone]}`}>
                            {inv.effectiveStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => void openInvoice(inv.id)}
                            disabled={detailLoading}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                              isLight
                                ? 'bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-700'
                                : 'bg-violet-950/40 hover:bg-violet-900/60 border-violet-500/30 text-violet-300 hover:text-white'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInvoice(null);
          }}
        >
          <div className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0d0d16] border-violet-500/30 text-zinc-200'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-slate-100' : 'border-white/[0.08]'}`}>
              <div className="flex items-center gap-2">
                <Receipt className={`w-5 h-5 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
                <span className={`text-base font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>Invoice {selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors border ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-transparent'
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className={`p-2 rounded-xl transition-colors ${isLight ? 'text-slate-500 hover:text-slate-800 bg-slate-100' : 'text-zinc-400 hover:text-white bg-white/[0.04]'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`p-6 rounded-xl border space-y-6 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/50 border-white/[0.06] text-zinc-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className={`uppercase font-mono-code text-[10px] mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Billed To</div>
                  <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{user.company || user.name}</div>
                  <div className={isLight ? 'text-slate-700' : 'text-zinc-300'}>{user.name}</div>
                </div>
                <div className="text-right font-mono-code">
                  <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Issued {new Date(selectedInvoice.issueDate).toLocaleDateString()}
                  </div>
                  <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Due {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                  </div>
                  <div className={`text-xs font-semibold uppercase mt-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                    {selectedInvoice.effectiveStatus.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
                <table className="w-full text-left text-xs">
                  <thead className={`border-b font-mono-code text-[10px] uppercase ${isLight ? 'text-slate-600 border-slate-200' : 'text-zinc-400 border-white/[0.08]'}`}>
                    <tr>
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/[0.04]'}`}>
                    {(selectedInvoice.items ?? []).map((item) => (
                      <tr key={item.id}>
                        <td className={`py-3 font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.description}</td>
                        <td className={`py-3 text-center font-mono-code ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{item.quantity}</td>
                        <td className={`py-3 text-right font-mono-code font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {formatMoney(item.lineTotal, selectedInvoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={`pt-4 border-t flex justify-end ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                <div className="w-64 space-y-1.5 text-xs text-right font-mono-code">
                  <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    <span>Subtotal:</span>
                    <span>{formatMoney(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                  </div>
                  <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    <span>Tax:</span>
                    <span>{formatMoney(selectedInvoice.tax, selectedInvoice.currency)}</span>
                  </div>
                  {Number(selectedInvoice.discount) > 0 && (
                    <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      <span>Discount:</span>
                      <span>-{formatMoney(selectedInvoice.discount, selectedInvoice.currency)}</span>
                    </div>
                  )}
                  <div className={`flex justify-between text-base font-bold pt-2 border-t ${isLight ? 'text-slate-900 border-slate-200' : 'text-white border-white/[0.08]'}`}>
                    <span>Total:</span>
                    <span className={isLight ? 'text-violet-700 font-bold' : 'text-violet-400'}>{formatMoney(selectedInvoice.total, selectedInvoice.currency)}</span>
                  </div>
                  <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    <span>Amount Paid:</span>
                    <span>{formatMoney(selectedInvoice.amountPaid, selectedInvoice.currency)}</span>
                  </div>
                  <div className={`flex justify-between font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <span>Amount Due:</span>
                    <span>{formatMoney(selectedInvoice.amountDue, selectedInvoice.currency)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
                <div className={`pt-4 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                  <div className={`uppercase font-mono-code text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Payments Received</div>
                  {selectedInvoice.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className={isLight ? 'text-slate-700' : 'text-zinc-300'}>
                        {new Date(p.paymentDate).toLocaleDateString()} · {p.method.replace('_', ' ')}
                      </span>
                      <span className={`font-mono-code font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatMoney(p.amount, p.currency)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
