import React from 'react';
import { Lock, FileText, Trash2, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { updatePageSeo } from '../../utils/seo';
import { apiClient } from '../../lib/apiClient.js';
import { LEGAL_DOCS, OWNER_MARKER, type LegalType } from './legalContent';

interface LegalPageProps {
  type: LegalType | 'data-deletion-status';
  theme?: 'dark' | 'light';
}

/** Renders text, turning each `{{OWNER: …}}` marker into a visible, highlighted placeholder so unfinished wording can never be mistaken for final text. */
export function withOwnerMarkers(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(OWNER_MARKER)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push(
      <mark key={m.index} data-owner-confirm="true" className="rounded px-1 bg-amber-400/20 text-amber-300 border border-amber-400/40">
        [Owner to confirm: {m[1]!.trim()}]
      </mark>
    );
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type StatusResponse = { code: string; status: 'IN_REVIEW' | 'COMPLETED' | 'DECLINED' | 'NOTHING_HELD'; receivedAt: string; updatedAt: string; message: string };

const DeletionStatus: React.FC = () => {
  const [code, setCode] = React.useState(() => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('code') ?? '' : ''));
  const [state, setState] = React.useState<{ kind: 'idle' } | { kind: 'loading' } | { kind: 'notfound' } | { kind: 'error' } | { kind: 'ok'; data: StatusResponse }>({ kind: 'idle' });

  const lookup = React.useCallback(async (value: string) => {
    const c = value.trim();
    if (!c) return;
    setState({ kind: 'loading' });
    try {
      const data = await apiClient.get<StatusResponse>(`/meta/deletion-status?code=${encodeURIComponent(c)}`);
      setState({ kind: 'ok', data });
    } catch (err) {
      const status = (err as { status?: number }).status;
      setState(status === 404 ? { kind: 'notfound' } : { kind: 'error' });
    }
  }, []);

  React.useEffect(() => { if (code) void lookup(code); /* look up the code from the link Facebook showed */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
      <p>Enter the confirmation code you received (it starts with "MDR-") to see where your data deletion request stands. This page shows no personal data.</p>
      <form onSubmit={(e) => { e.preventDefault(); void lookup(code); }} className="flex gap-2 flex-wrap">
        <label htmlFor="deletion-code" className="sr-only">Confirmation code</label>
        <input id="deletion-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="MDR-…" maxLength={40} className="flex-1 min-w-[14rem] px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white font-mono-code" />
        <button type="submit" className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold inline-flex items-center gap-2"><Search className="w-4 h-4" /> Check status</button>
      </form>
      <div role="status" aria-live="polite">
        {state.kind === 'loading' && <p>Checking…</p>}
        {state.kind === 'notfound' && <p className="flex items-center gap-2 text-amber-300"><AlertTriangle className="w-4 h-4" /> We could not find a request with that code. Check the code and try again.</p>}
        {state.kind === 'error' && <p className="flex items-center gap-2 text-amber-300"><AlertTriangle className="w-4 h-4" /> The status could not be loaded right now. Please try again later.</p>}
        {state.kind === 'ok' && (
          <div className="rounded-xl border border-white/10 p-4 space-y-1">
            <p className="font-semibold text-white flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Status: {({ IN_REVIEW: 'In review', COMPLETED: 'Completed', DECLINED: 'Needs follow-up', NOTHING_HELD: 'Nothing held' } as const)[state.data.status]}</p>
            <p>{state.data.message}</p>
            <p className="text-xs text-zinc-500">Received {new Date(state.data.receivedAt).toLocaleString()} · last update {new Date(state.data.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const LegalPage: React.FC<LegalPageProps> = ({ type, theme = 'dark' }) => {
  const isLight = theme === 'light';
  const isStatus = type === 'data-deletion-status';
  const doc = isStatus ? null : LEGAL_DOCS[type];
  const title = isStatus ? 'Data Deletion Request Status' : doc!.title;

  React.useEffect(() => {
    updatePageSeo({
      title: `${title} | Artify Solutions`,
      description: isStatus ? 'Check the status of a data deletion request using your confirmation code.' : doc!.seoDescription,
      canonicalUrl: `https://artifysols.com${isStatus ? '/data-deletion-status' : doc!.path}`,
      ...(isStatus ? { robots: 'noindex, nofollow' } : {}),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type]);

  const Icon = type === 'privacy' ? Lock : type === 'terms' ? FileText : Trash2;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#050505] text-[#F5F5F5]'} transition-colors duration-300 pt-28 sm:pt-36 pb-24`}>
      <div className="w-[92%] sm:w-[88%] max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0c0c14] border border-white/[0.08]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center justify-center"><Icon className="w-6 h-6" /></div>
            <div>
              <span className="text-xs font-bold text-violet-400 font-mono-code uppercase">Legal</span>
              <h1 className="text-2xl sm:text-4xl font-bold text-white font-display">{title}</h1>
            </div>
          </div>

          {isStatus ? (
            <DeletionStatus />
          ) : (
            <>
              <p className="text-xs font-mono-code text-zinc-500 mb-8 pb-4 border-b border-white/[0.08]">Effective: {withOwnerMarkers(doc!.effective)}</p>
              <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
                {doc!.intro.map((p, i) => <p key={i}>{withOwnerMarkers(p)}</p>)}
                {doc!.sections.map((s) => (
                  <section key={s.heading} className="space-y-2">
                    <h2 className="text-lg font-bold text-white font-display">{s.heading}</h2>
                    {s.paragraphs?.map((p, i) => <p key={i}>{withOwnerMarkers(p)}</p>)}
                    {s.bullets && <ul className="list-disc pl-5 space-y-1">{s.bullets.map((b, i) => <li key={i}>{withOwnerMarkers(b)}</li>)}</ul>}
                    {s.table && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-white/10">
                          <thead><tr>{s.table.head.map((h) => <th key={h} className="p-2 border-b border-white/10 text-white">{h}</th>)}</tr></thead>
                          <tbody>{s.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="p-2 border-b border-white/5 align-top">{withOwnerMarkers(c)}</td>)}</tr>)}</tbody>
                        </table>
                      </div>
                    )}
                  </section>
                ))}
              </div>
              {type === 'data-deletion' && <p className="mt-8 text-sm"><a className="text-violet-300 underline" href="/data-deletion-status">Check the status of a request</a></p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
