import React from 'react';

/**
 * Placeholder that reserves roughly the final card-grid height while public
 * content loads, so list pages don't shift (CLS) when the API responds.
 */
export const ListSkeleton: React.FC<{ count?: number; isLight?: boolean; minHeight?: number; label?: string }> = ({
  count = 6,
  isLight = false,
  minHeight = 640,
  label = 'Loading',
}) => (
  <div role="status" aria-live="polite" aria-label={label} style={{ minHeight }}>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`h-[280px] rounded-2xl border animate-pulse ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.03] border-white/[0.08]'}`}
        />
      ))}
    </div>
    <span className="sr-only">{label}…</span>
  </div>
);
