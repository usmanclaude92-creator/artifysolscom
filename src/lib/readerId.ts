/**
 * A random, anonymous per-browser id used only so one browser counts once as a like / one rating. It carries no personal data and is
 * never sent anywhere except the post-engagement endpoints. Falls back to a per-page-load id when storage is unavailable.
 */
const KEY = 'artify_reader_id';
let memoryId: string | null = null;

function randomId(): string {
  const bytes = new Uint8Array(16);
  (globalThis.crypto ?? ({} as Crypto)).getRandomValues?.(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return hex.length === 32 && hex !== '0'.repeat(32) ? hex : `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`.padEnd(24, '0');
}

export function getReaderId(): string {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored && /^[A-Za-z0-9_-]{16,64}$/.test(stored)) return stored;
    const id = randomId();
    localStorage.setItem(KEY, id);
    return id;
  } catch {
    return (memoryId ??= randomId());
  }
}

const likedKey = (slug: string) => `artify_liked_${slug}`;
const ratedKey = (slug: string) => `artify_rated_${slug}`;

export function readLiked(slug: string): boolean {
  try { return localStorage.getItem(likedKey(slug)) === '1'; } catch { return false; }
}
export function writeLiked(slug: string, liked: boolean): void {
  try { liked ? localStorage.setItem(likedKey(slug), '1') : localStorage.removeItem(likedKey(slug)); } catch { /* storage unavailable */ }
}
export function readRated(slug: string): number {
  try { return Number(localStorage.getItem(ratedKey(slug))) || 0; } catch { return 0; }
}
export function writeRated(slug: string, score: number): void {
  try { localStorage.setItem(ratedKey(slug), String(score)); } catch { /* storage unavailable */ }
}
