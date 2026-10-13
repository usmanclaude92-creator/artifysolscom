/**
 * Single source of truth for the head of the static public pages. Both the
 * client pages (via `updatePageSeo`) and the server function (`ssrMeta.ts`,
 * which injects the head into the raw HTML) read from here, so a crawler
 * that does not run JavaScript sees the same head the browser ends up with.
 */
export const SITE_NAME = 'Artify Solutions';
export const SITE_ORIGIN = 'https://artifysols.com';

export function formatPageTitle(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME} - Enterprise AI Products & Autonomous Systems`;
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
  description: 'Explore the Artify Solutions product and service catalog.',
};

export const STATIC_ROUTE_META: Record<string, StaticRouteMeta> = {
  '/about': {
    title: 'About Artify Solutions - We Believe Software Should Think',
    description: 'Learn about Artify Solutions, our AI engineering philosophy, enterprise security standards, multi-agent frameworks, partner access policies, and leadership vision.',
  },
  '/contact': {
    title: 'Contact Artify Solutions - Architecture Assessment & Brief Dispatcher',
    description: 'Submit your AI operational brief or schedule an enterprise architecture review with the Artify Solutions engineering team.',
  },
  '/services': {
    title: 'Enterprise AI Services & Architecture Engineering',
    description: 'Custom AI strategy, autonomous agent development, enterprise RAG vector systems, and mission-critical legacy system integration services.',
  },
  '/industries': {
    title: 'Industry AI Solutions - Verticals & Domain Architectures',
    description: 'Explore Artify Solutions domain-specific AI workflows across Finance, Healthcare, Construction, Legal, Logistics, Real Estate, Manufacturing, and Retail.',
  },
  '/case-studies': {
    title: 'Enterprise AI Case Studies & Transformation Blueprints',
    description: 'Discover how global enterprises deploy Artify autonomous agent swarms and neural RAG systems to eliminate manual bottlenecks.',
  },
  '/ai-solutions': AI_SOLUTIONS_META,
  '/solutions': { ...AI_SOLUTIONS_META, canonicalPath: '/ai-solutions' },
  '/data-deletion-status': {
    title: 'Data Deletion Request Status | Artify Solutions',
    description: 'Check the status of a data deletion request using your confirmation code.',
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
