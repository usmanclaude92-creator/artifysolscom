import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { optimizedImage, IMAGE_WIDTHS } from '../src/lib/imageUrl';
import { MediaImg } from '../src/components/MediaImg';

const BUCKET = 'https://cfkymotcnccgvkpmcevp.supabase.co/storage/v1/object/public/artify-media/organizations/o/media/m/shot.png';

function atHost(hostname: string) {
  vi.stubGlobal('location', { ...window.location, hostname });
  Object.defineProperty(window, 'location', { value: { ...window.location, hostname }, writable: true, configurable: true });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('optimizedImage', () => {
  it('serves bucket images through /_vercel/image at every configured width', () => {
    atHost('artifysols.com');
    const o = optimizedImage(BUCKET);
    expect(o.src).toBe(`/_vercel/image?url=${encodeURIComponent(BUCKET)}&w=1080&q=75`);
    for (const w of IMAGE_WIDTHS) expect(o.srcSet).toContain(`&w=${w}&q=75 ${w}w`);
  });
  it('leaves other hosts and local dev untouched', () => {
    atHost('artifysols.com');
    expect(optimizedImage('https://example.com/a.png')).toEqual({ src: 'https://example.com/a.png' });
    atHost('localhost');
    expect(optimizedImage(BUCKET)).toEqual({ src: BUCKET });
  });
});

describe('MediaImg', () => {
  it('falls back to the original file when the optimized copy fails', () => {
    atHost('artifysols.com');
    const { container } = render(<MediaImg url={BUCKET} alt="x" sizes="100vw" />);
    const img = container.querySelector('img')!;
    expect(img.getAttribute('src')).toContain('/_vercel/image');
    fireEvent.error(img);
    expect(container.querySelector('img')!.getAttribute('src')).toBe(BUCKET);
    expect(container.querySelector('img')!.getAttribute('srcset')).toBeNull();
  });
  it('marks priority images eager/high and card images lazy', () => {
    atHost('artifysols.com');
    const { container } = render(<><MediaImg url={BUCKET} alt="a" sizes="100vw" priority /><MediaImg url={BUCKET} alt="b" sizes="100vw" lazy /></>);
    const [a, b] = Array.from(container.querySelectorAll('img'));
    expect(a!.getAttribute('loading')).toBe('eager');
    expect(a!.getAttribute('fetchpriority')).toBe('high');
    expect(b!.getAttribute('loading')).toBe('lazy');
  });
});

describe('socialImageUrl', () => {
  const base = 'https://artifysols.com';
  const bucket = 'https://cfkymotcnccgvkpmcevp.supabase.co/storage/v1/object/public/artify-media/a/b.png';
  it('routes bucket media through the optimizer at an allowed width', async () => {
    const { socialImageUrl } = await import('../src/lib/imageUrl');
    expect(socialImageUrl(bucket, base)).toBe(`${base}/_vercel/image?url=${encodeURIComponent(bucket)}&w=1280&q=75`);
  });
  it('makes relative URLs absolute and leaves other absolute URLs', async () => {
    const { socialImageUrl } = await import('../src/lib/imageUrl');
    expect(socialImageUrl('/og-home.jpg', base)).toBe(`${base}/og-home.jpg`);
    expect(socialImageUrl('https://x.com/a.png', base)).toBe('https://x.com/a.png');
    expect(socialImageUrl(undefined, base)).toBeUndefined();
  });
});
