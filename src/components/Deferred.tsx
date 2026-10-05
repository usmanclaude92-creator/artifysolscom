import React, { Suspense, useEffect, useRef, useState } from 'react';

/**
 * Mounts (and therefore downloads the chunk for) a below-the-fold section only
 * once it nears the viewport, or after the browser is idle as a fallback so
 * in-page anchors/search still find it. Reserves `minHeight` meanwhile so the
 * page doesn't shift.
 */
export const Deferred: React.FC<{ children: React.ReactNode; minHeight?: number; rootMargin?: string }> = ({
  children,
  minHeight = 600,
  rootMargin = '800px 0px',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) return;
    const el = ref.current;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    const activate = () => setActive(true);

    if (!el || typeof IntersectionObserver === 'undefined') {
      activate();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) activate();
      },
      { rootMargin }
    );
    io.observe(el);

    // Fallback: hydrate everything shortly after the page is idle.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) idleHandle = w.requestIdleCallback(activate, { timeout: 6000 });
    else timeoutHandle = window.setTimeout(activate, 4000);

    return () => {
      io.disconnect();
      if (idleHandle !== undefined && (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback) {
        (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback!(idleHandle);
      }
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    };
  }, [active, rootMargin]);

  if (!active) return <div ref={ref} style={{ minHeight }} aria-hidden="true" />;
  return (
    <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>{children}</Suspense>
  );
};
