import React, { Suspense, useEffect, useRef, useState } from 'react';

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };

// Sections that fall back to idle activation go through one shared queue, one per idle slot, instead of all
// mounting (and evaluating their chunks) in the same task, which showed up as one very long main-thread task.
const idleQueue: Array<() => void> = [];
let idleDraining = false;

function whenIdle(cb: () => void, timeout: number) {
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout });
  else window.setTimeout(cb, 200);
}

function drainIdleQueue() {
  const next = idleQueue.shift();
  if (!next) {
    idleDraining = false;
    return;
  }
  next();
  whenIdle(drainIdleQueue, 1500);
}

function enqueueIdleActivation(activate: () => void): () => void {
  idleQueue.push(activate);
  if (!idleDraining) {
    idleDraining = true;
    whenIdle(drainIdleQueue, 6000);
  }
  return () => {
    const i = idleQueue.indexOf(activate);
    if (i >= 0) idleQueue.splice(i, 1);
  };
}

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

    // Fallback: hydrate everything shortly after the page is idle, one section at a time.
    const dequeue = enqueueIdleActivation(activate);

    return () => {
      io.disconnect();
      dequeue();
    };
  }, [active, rootMargin]);

  if (!active) return <div ref={ref} style={{ minHeight }} aria-hidden="true" />;
  return (
    <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>{children}</Suspense>
  );
};
