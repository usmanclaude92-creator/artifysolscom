import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalApi, formatMoney, NoWorkspaceError, PortalDashboard, PortalPayment } from '../../lib/portalApi';
import { ApiClientError } from '../../lib/apiClient';
import {
  Activity,
  FileText,
  CreditCard,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Receipt,
} from 'lucide-react';

interface ClientDashboardProps {
  onNavigateTab: (tab: string) => void;
  theme?: 'dark' | 'light';
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigateTab, theme = 'dark' }) => {
  const { user } = useAuth();
  const isLight = theme === 'light';

  const [dashboard, setDashboard] = useState<PortalDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noWorkspace, setNoWorkspace] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = React.useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    setNoWorkspace(false);
    portalApi
      .getDashboard()
      .then(setDashboard)
      .catch((err: unknown) => {
        if (err instanceof NoWorkspaceError) {
          setNoWorkspace(true);
        } else {
          setLoadError(err instanceof ApiClientError ? err.message : 'Unable to load your dashboard right now.');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="client-dashboard-container">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 shadow-xl transition-all ${
        isLight
          ? 'bg-gradient-to-br from-white via-violet-50/60 to-indigo-50/50 border border-violet-200 text-slate-900 shadow-slate-200/50'
          : 'bg-gradient-to-br from-[#121220] via-[#0d0d16] to-[#151226] border border-violet-500/30 text-white shadow-black/60'
      }`}>
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 ${
          isLight ? 'bg-violet-400/10' : 'bg-violet-600/10'
        }`} />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Client Command Center{user.company ? `: ${user.company}` : ''}
            </h1>
            <p className={`text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              Logged in as <strong className={isLight ? 'text-slate-900' : 'text-white'}>{user.name}</strong> ({user.roleName}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('seo')}
              id="dashboard-seo-health-btn"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] border ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900 shadow-sm'
                  : 'bg-emerald-950/40 hover:bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>SEO Health</span>
            </button>
            <button
              onClick={() => onNavigateTab('subscriptions')}
              id="dashboard-billing-overview-btn"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all hover:scale-[1.02]"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Subscriptions & Billing</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className={`p-10 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0c0c14] border-white/[0.08] text-zinc-400'}`}>
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 opacity-60" />
          Loading your account overview…
        </div>
      )}

      {!isLoading && noWorkspace && (
        <div className={`p-8 text-center rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
          <ShieldCheck className={`w-8 h-8 mx-auto mb-3 ${isLight ? 'text-violet-500' : 'text-violet-400'} opacity-70`} />
          <h3 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>No client workspace linked yet</h3>
          <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            Your account isn't yet connected to a provisioned Artify client workspace, so there is no contract, subscription, or
            billing data to show. If you're an existing client, contact your account manager to have your workspace linked.
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

      {!isLoading && !noWorkspace && !loadError && dashboard && (
        <>
          {/* SECTION 1: ACCOUNT STATUS ROW */}
          <section className="space-y-4" aria-labelledby="billing-status-heading">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className={`w-4 h-4 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
                <h2 id="billing-status-heading" className={`text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Account Status
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('invoices')}
                className={`text-xs font-semibold flex items-center gap-1 transition-colors ${isLight ? 'text-violet-700 hover:text-violet-900' : 'text-violet-400 hover:text-violet-300'}`}
              >
                <span>View Invoices</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Contracts', value: dashboard.activeContractCount, icon: FileText, tab: 'overview' },
                { label: 'Active Subscriptions', value: dashboard.activeSubscriptionCount, icon: Activity, tab: 'subscriptions' },
                { label: 'Outstanding Invoices', value: dashboard.outstandingInvoiceCount, icon: Receipt, tab: 'invoices' },
              ].map((card) => (
                <button
                  key={card.label}
                  onClick={() => onNavigateTab(card.tab)}
                  className={`p-5 rounded-2xl text-left transition-all ${
                    isLight
                      ? 'bg-white border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md'
                      : 'bg-[#0c0c14] border border-white/[0.08] hover:border-violet-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{card.label}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isLight ? 'bg-violet-100 border border-violet-200 text-violet-700' : 'bg-violet-950/60 border border-violet-500/30 text-violet-400'
                    }`}>
                      <card.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <span className={`text-2xl sm:text-3xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{card.value}</span>
                </button>
              ))}

              <div className={`p-5 rounded-2xl ${isLight ? 'bg-white border border-slate-200 shadow-sm' : 'bg-[#0c0c14] border border-white/[0.08]'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Amount Due</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isLight ? 'bg-amber-100 border border-amber-200 text-amber-700' : 'bg-amber-950/60 border border-amber-500/30 text-amber-400'
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <span className={`text-xl sm:text-2xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {formatMoney(dashboard.amountDue, dashboard.currency)}
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 2: RECENT PAYMENTS */}
          <section className="space-y-4" aria-labelledby="recent-payments-heading">
            <div className="flex items-center gap-2">
              <Receipt className={`w-4 h-4 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
              <h2 id="recent-payments-heading" className={`text-sm font-bold font-display uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Recent Payments
              </h2>
            </div>

            {dashboard.recentPayments.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0c0c14] border-white/[0.08] text-zinc-400'}`}>
                No payments recorded yet.
              </div>
            ) : (
              <div className={`rounded-2xl border overflow-hidden ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
                <ul className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-white/[0.06]'}`}>
                  {dashboard.recentPayments.map((payment: PortalPayment) => (
                    <li key={payment.id} className="px-5 py-3.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {formatMoney(payment.amount, payment.currency)}
                        </div>
                        <div className={isLight ? 'text-slate-500' : 'text-zinc-400'}>
                          {new Date(payment.paymentDate).toLocaleDateString()} · {payment.method.replace('_', ' ')}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code uppercase font-semibold border ${
                        payment.status === 'COMPLETED'
                          ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                          : isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/[0.06] border-white/[0.08] text-zinc-400'
                      }`}>
                        {payment.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
