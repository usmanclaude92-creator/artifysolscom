import {StrictMode} from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { reloadOnceForLoadFailure } from './lib/lazyWithRetry.ts';
import './index.css';

// A code chunk that cannot be downloaded (gateway error, or a new deployment replaced the old file names): reload once for a fresh copy.
// If it happens again within a minute the section boundary shows a plain reload message instead.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForLoadFailure()) event.preventDefault();
});

const mount = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LazyMotion features={domAnimation}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </LazyMotion>
    </StrictMode>,
  );

// "/" ships a prerendered hero and loads the full stylesheet without blocking it. React replaces that hero and adds the
// navbar and sections, so wait for the stylesheet first (bounded) rather than rendering unstyled content.
const appCss = document.getElementById('app-css') as HTMLLinkElement | null;
if (appCss && appCss.media === 'print') {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    mount();
  };
  appCss.addEventListener('load', start, { once: true });
  window.setTimeout(start, 4000);
} else {
  mount();
}

