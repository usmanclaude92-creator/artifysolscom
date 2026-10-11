import {StrictMode} from 'react';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

