/**
 * Single source of truth for the head of the static public pages. Both the
 * client pages (via `updatePageSeo`) and the server function (`ssrMeta.ts`,
 * which injects the head into the raw HTML) read from here, so a crawler
 * that does not run JavaScript sees the same head the browser ends up with.
 */
export const SITE_NAME = 'Artify Solutions';
export const SITE_ORIGIN = 'https://artifysols.com';

export const TITLE_MAX = 60;

/** `base | Artify Solutions` (or the first suffix that fits in 60 characters); the bare title when nothing fits or it already names the site. */
export function composeTitle(base: string, suffixes: string[] = [SITE_NAME]): string {
  if (base.includes(SITE_NAME)) return base;
  for (const s of suffixes) {
    const t = `${base} | ${s}`;
    if (t.length <= TITLE_MAX) return t;
  }
  return base;
}

export function formatPageTitle(title: string): string {
  return composeTitle(title);
}

export interface StaticRouteMeta {
  title: string;
  description: string;
  /** Path the canonical points at when it differs from the route itself. */
  canonicalPath?: string;
  robots?: string;
}

const AI_SOLUTIONS_META: StaticRouteMeta = {
  title: 'AI Solutions & Product Catalog | Artify Solutions',
  description: 'Browse the Artify Solutions catalog of AI products, services and solutions for enterprise automation, custom software and intelligent workflows.',
};

export const STATIC_ROUTE_META: Record<string, StaticRouteMeta> = {
  '/about': {
    title: 'About Artify Solutions - We Believe Software Should Think',
    description: 'Learn about Artify Solutions: our AI engineering philosophy, enterprise security standards, multi-agent frameworks and partner access policies.',
  },
  '/contact': {
    title: 'Contact Artify Solutions | Architecture Assessment',
    description: 'Submit your AI operational brief or schedule an enterprise architecture review with the Artify Solutions engineering team.',
  },
  '/services': {
    title: 'Enterprise AI Services & Engineering | Artify Solutions',
    description: 'Custom AI strategy, autonomous agent development, enterprise RAG vector systems, and mission-critical legacy system integration services.',
  },
  '/industries': {
    title: 'AI Solutions by Industry | Artify Solutions',
    description: 'Explore Artify Solutions domain-specific AI workflows across Finance, Healthcare, Construction, Legal, Logistics, Real Estate, Manufacturing, and Retail.',
  },
  '/case-studies': {
    title: 'Enterprise AI Case Studies | Artify Solutions',
    description: 'Discover how global enterprises deploy Artify autonomous agent swarms and neural RAG systems to eliminate manual bottlenecks.',
  },
  '/ai-solutions': AI_SOLUTIONS_META,
  '/solutions': { ...AI_SOLUTIONS_META, canonicalPath: '/ai-solutions' },
  '/data-deletion-status': {
    title: 'Data Deletion Request Status | Artify Solutions',
    description: 'Check the status of a data deletion request with your confirmation code. This page shows no personal data about you or your account.',
    robots: 'noindex, nofollow',
  },
};

export function hasStaticRouteMeta(path: string): boolean {
  return Object.prototype.hasOwnProperty.call(STATIC_ROUTE_META, path);
}

/** Head config for a static route; `origin` defaults to the production origin. */
export function staticPageSeo(path: string, origin: string = SITE_ORIGIN) {
  const m = STATIC_ROUTE_META[path];
  if (!m) throw new Error(`No static route meta for ${path}`);
  return {
    title: m.title,
    description: m.description,
    canonicalUrl: `${origin}${m.canonicalPath ?? path}`,
    ...(m.robots ? { robots: m.robots } : {}),
  };
}
