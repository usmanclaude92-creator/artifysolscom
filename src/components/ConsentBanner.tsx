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
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-white/15 bg-[#0b1220] p-4 text-sm text-slate-200 shadow-2xl sm:bottom-5"
    >
      <p className="leading-relaxed">
        We would like to use Google Analytics to understand how the site is used. It is off unless you accept, and you can change your mind at any time from
        &ldquo;Cookie settings&rdquo; in the footer. See our{' '}
        <a href="/privacy" className="underline underline-offset-2 hover:text-white">Privacy Policy</a>.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose('rejected')} className="flex-1 rounded-lg border border-white/25 px-4 py-2 font-semibold text-white hover:bg-white/10">
          Reject
        </button>
        <button type="button" onClick={() => choose('accepted')} className="flex-1 rounded-lg border border-white/25 px-4 py-2 font-semibold text-white hover:bg-white/10">
          Accept
        </button>
      </div>
    </div>
  );
};
