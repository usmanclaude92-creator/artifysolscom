import React from 'react';
import { optimizedImage } from '../lib/imageUrl';

interface MediaImgProps {
  url: string;
  alt: string;
  className?: string;
  /** Rendered width hint for the browser, e.g. "(max-width: 640px) 100vw, 400px". */
  sizes: string;
  /** Above-the-fold image: fetched with high priority and never lazy. */
  priority?: boolean;
  /** Below-the-fold image (cards): not fetched until near the viewport. */
  lazy?: boolean;
}

/** A Control Center image served resized and as WebP; falls back to the original file if the optimized copy fails. */
export const MediaImg: React.FC<MediaImgProps> = ({ url, alt, className, sizes, priority = false, lazy = false }) => {
  const [failed, setFailed] = React.useState(false);
  const opt = failed ? { src: url, srcSet: undefined } : optimizedImage(url);
  return (
    <img
      src={opt.src}
      srcSet={opt.srcSet}
      sizes={opt.srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      decoding="async"
      loading={priority ? 'eager' : lazy ? 'lazy' : undefined}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
    />
  );
};
