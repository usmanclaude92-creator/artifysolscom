/**
 * Resilient code-splitting. A section's JavaScript chunk can fail to download (a gateway error, a dropped connection, or a new deployment
 * replacing the old file names). `lazyWithRetry` tries the import again, and if it still fails it reloads the page ONCE per minute so the
 * visitor gets a fresh, consistent copy. If it fails again inside that minute the error reaches LoadFailureBoundary, which shows a plain
 * "reload" message instead of a blank screen.
 */
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

const RELOAD_KEY = 'artify.chunkReloadAt';
const RELOAD_WINDOW_MS = 60_000;

/** Reloads the page unless it already did within the last minute. Returns true when a reload was started. */
export function reloadOnceForLoadFailure(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? '0');
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false; // storage blocked: never risk a reload loop
  }
  window.location.reload();
  return true;
}

export async function importWithRetry<T>(factory: () => Promise<T>, retries = 2, baseDelayMs = 400): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await factory();
    } catch (err) {
      if (attempt >= retries) {
        if (reloadOnceForLoadFailure()) return new Promise<T>(() => {}); // page is reloading
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 3 ** attempt));
    }
  }
}

export function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): LazyExoticComponent<T> {
  return lazy(() => importWithRetry(factory));
}
