import React from 'react';
import { CONSENT_EVENT, initConsent, readConsent, setConsent } from '../lib/consent';

/** Analytics consent bar. Appears only after the page is idle so it never competes with the hero for first paint. */
export const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    initConsent();
    const show = () => setVisible(readConsent() === null);
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const handle = idle ? idle(show, { timeout: 3000 }) : window.setTimeout(show, 1500);
    const onChange = () => setVisible(readConsent() === null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      if (!idle) window.clearTimeout(handle);
    };
  }, []);

  if (!visible) return null;
  const choose = (c: 'accepted' | 'rejected') => {
    setConsent(c);
    setVisible(false);
  };
  return (
    <div
      role="dialog"
      aria-label="Analytics cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-card-border bg-card/95 text-foreground shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <p className="text-xs leading-relaxed text-foreground-secondary sm:text-sm">
          We would like to use Google Analytics to understand how the site is used. It is off unless you accept, and you can change your mind at any time from
          &ldquo;Cookie settings&rdquo; in the footer. See our{' '}
          <a href="/privacy" className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover">Privacy Policy</a>.
        </p>
        <div className="flex shrink-0 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="flex-1 rounded-xl border border-card-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover sm:flex-none"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="flex-1 rounded-xl border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
