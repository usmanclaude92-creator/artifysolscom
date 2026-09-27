import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalApi, formatMoney, NoWorkspaceError, PortalContract, PortalSubscription } from '../../lib/portalApi';
import { ApiClientError } from '../../lib/apiClient';
import { CreditCard, FileText, AlertCircle, RefreshCw, Calendar } from 'lucide-react';

interface PortalSubscriptionsProps {
  theme?: 'dark' | 'light';
}

const STATUS_TONE: Record<string, string> = {
  ACTIVE: 'emerald',
  TRIALING: 'sky',
  PAST_DUE: 'amber',
  PAUSED: 'amber',
  CANCELLED: 'rose',
  EXPIRED: 'rose',
  TERMINATED: 'rose',
  SUSPENDED: 'amber',
  DRAFT: 'slate',
};

function StatusBadge({ status, isLight }: { status: string; isLight: boolean }) {
  const tone = STATUS_TONE[status] ?? 'slate';
  const toneClasses: Record<string, string> = {
    emerald: isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400',
    sky: isLight ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-sky-950/50 border-sky-500/30 text-sky-400',
    amber: isLight ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-amber-950/50 border-amber-500/30 text-amber-400',
    rose: isLight ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-rose-950/50 border-rose-500/30 text-rose-400',
    slate: isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/[0.06] border-white/[0.08] text-zinc-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code uppercase font-semibold border ${toneClasses[tone]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export const PortalSubscriptions: React.FC<PortalSubscriptionsProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const { user } = useAuth();

  const [contracts, setContracts] = useState<PortalContract[] | null>(null);
  const [subscriptions, setSubscriptions] = useState<PortalSubscription[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noWorkspace, setNoWorkspace] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = React.useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    setNoWorkspace(false);
    Promise.all([portalApi.listContracts(1, 50), portalApi.listSubscriptions(1, 50)])
      .then(([contractRes, subRes]) => {
        setContracts(contractRes.items);
        setSubscriptions(subRes.items);
      })
      .catch((err: unknown) => {
        if (err instanceof NoWorkspaceError) {
          setNoWorkspace(true);
        } else {
          setLoadError(err instanceof ApiClientError ? err.message : 'Unable to load your subscriptions right now.');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Contracts & Subscriptions
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
          A real-time, read-only view of your contracts and active subscriptions. To change your plan or billing terms, contact
          your account manager.
        </p>
      </div>

      {isLoading && (
        <div className={`p-10 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0c0c14] border-white/[0.08] text-zinc-400'}`}>
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 opacity-60" />
          Loading contracts and subscriptions…
        </div>
      )}

      {!isLoading && noWorkspace && (
        <div className={`p-8 text-center rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
          <h3 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>No client workspace linked yet</h3>
          <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            There is no contract or subscription data to show until your account is linked to a provisioned client workspace.
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
        <>
          <section className="space-y-4">
            <h2 className={`text-sm font-bold font-display uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <FileText className={`w-4 h-4 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
              Contracts
            </h2>
            {!contracts || contracts.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0c0c14] border-white/[0.08] text-zinc-400'}`}>
                No contracts on file yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map((c) => (
                  <div key={c.id} className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{c.contractNumber}</span>
                      <StatusBadge status={c.status} isLight={isLight} />
                    </div>
                    <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{c.title}</h3>
                    {c.description && <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{c.description}</p>}
                    <div className={`pt-3 border-t flex items-center justify-between text-xs ${isLight ? 'border-slate-100' : 'border-white/[0.06]'}`}>
                      <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Contract Value</span>
                      <span className={`font-bold font-mono-code ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatMoney(c.currentValue, c.currency)}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(c.startDate).toLocaleDateString()}{c.endDate ? ` – ${new Date(c.endDate).toLocaleDateString()}` : ' (ongoing)'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className={`text-sm font-bold font-display uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <CreditCard className={`w-4 h-4 ${isLight ? 'text-violet-600' : 'text-violet-400'}`} />
              Subscriptions
            </h2>
            {!subscriptions || subscriptions.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border text-xs ${isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0c0c14] border-white/[0.08] text-zinc-400'}`}>
                No active subscriptions yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((s) => (
                  <div key={s.id} className={`p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0c0c14] border-white/[0.08]'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-mono-code ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{s.subscriptionNumber}</span>
                      <StatusBadge status={s.status} isLight={isLight} />
                    </div>
                    {s.items && s.items.length > 0 && (
                      <ul className="space-y-1">
                        {s.items.map((item) => (
                          <li key={item.id} className={`text-xs flex items-center justify-between gap-2 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                            <span>{item.description} × {item.quantity}</span>
                            <span className="font-mono-code">{formatMoney(item.unitPrice, item.currency)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className={`pt-3 border-t flex items-center justify-between text-xs ${isLight ? 'border-slate-100' : 'border-white/[0.06]'}`}>
                      <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>{s.billingCycle.replace('_', ' ').toLowerCase()} price</span>
                      <span className={`font-bold font-mono-code ${isLight ? 'text-slate-900' : 'text-white'}`}>{formatMoney(s.price, s.currency)}</span>
                    </div>
                    {s.renewalDate && (
                      <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>Renews {new Date(s.renewalDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
