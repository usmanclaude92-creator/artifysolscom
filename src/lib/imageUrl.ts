/**
 * Serves Control Center media through Vercel Image Optimization (/_vercel/image): resized to the width actually
 * shown and re-encoded as WebP, instead of shipping the original upload (often a multi-hundred-KB PNG).
 * Only the public media bucket is allowed by vercel.json; every other URL, and local dev, keeps the original.
 */
export const IMAGE_WIDTHS = [400, 640, 828, 1080, 1280, 1600] as const;
const QUALITY = 75;
const MEDIA_PREFIX = 'https://cfkymotcnccgvkpmcevp.supabase.co/storage/v1/object/public/artify-media/';

function canOptimize(url: string): boolean {
  if (!url.startsWith(MEDIA_PREFIX)) return false;
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
}

function viaVercel(url: string, width: number): string {
  return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${QUALITY}`;
}

/** `src` (a mid-size WebP) and `srcSet` for an <img>; both are the original URL when optimization does not apply. */
export function optimizedImage(url: string): { src: string; srcSet?: string } {
  if (!canOptimize(url)) return { src: url };
  return {
    src: viaVercel(url, 1080),
    srcSet: IMAGE_WIDTHS.map((w) => `${viaVercel(url, w)} ${w}w`).join(', '),
  };
}

/**
 * Absolute 1280px-wide URL for og:image / twitter:image. Crawlers need absolute URLs and small files, so Control Center
 * media goes through the image optimizer; other URLs are only made absolute.
 */
export function socialImageUrl(url: string | undefined | null, baseUrl: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith(MEDIA_PREFIX)) return `${baseUrl}${viaVercel(url, 1280)}`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}
