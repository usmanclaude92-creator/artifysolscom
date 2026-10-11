import React from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  /** Render nothing on failure (for optional overlays such as modals). Default: show the reload message in place. */
  silent?: boolean;
}

/**
 * Contains a failed section/route load so one broken download does not replace the whole site with the full-screen error.
 * Shows a short, friendly message with a reload button in the space the section would have used.
 */
export class LoadFailureBoundary extends React.Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error('A page section failed to load:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.silent) return null;
    return (
      <div role="alert" className="min-h-[50vh] flex items-center justify-center px-6 py-24 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-lg font-bold text-foreground">This part of the page didn't load</h2>
          <p className="text-sm text-subtle-text leading-relaxed">
            It's usually a brief connection hiccup. Reloading the page normally fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/30 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
