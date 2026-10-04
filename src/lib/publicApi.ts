/**
 * Public website API client (Phase 11 — docs/PUBLIC_API_ARCHITECTURE.md in
 * the Artify-Backend repo). Thin, typed wrapper over apiClient.ts scoped to
 * the anonymous-reachable `/api/v1/public/*` surface: published Pages/Posts
 * (Phase 8 CMS), ACTIVE Products/ProductModules (Phase 7 catalog), and CRM
 * Lead intake. Every shape here mirrors the backend's public-safe
 * projection exactly (see publicSiteService.ts/publicProductService.ts) —
 * nothing here fabricates a field the backend didn't send.
 */
import { apiClient } from './apiClient';
import type { BlogPost, BlogCategory, ArticleSeoMetadata } from '../types';

export interface PublicMedia {
  url: string;
  altText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
}

export interface PublicCategory {
  slug: string;
  name: string;
  description: string | null;
}

export interface PublicTag {
  slug: string;
  name: string;
}

export interface PublicAuthor {
  name: string;
  bio: string | null;
  avatarUrl: string | null;
}

export interface PublicPost {
  slug: string;
  title: string;
  body: string;
  excerpt: string | null;
  seo: Record<string, unknown>;
  category: { slug: string; name: string } | null;
  tags: { slug: string; name: string }[];
  author: PublicAuthor | null;
  featuredMedia: PublicMedia | null;
  publishedAt: string | null;
  updatedAt: string;
}

// Phase 9 (Forms + Landing Pages + Conversion, Artify-Backend repo) —
// mirrors server/schemas/editorSchemas.ts's block shape exactly. Kept
// loose (`props: Record<string, unknown>`) rather than a full
// discriminated union here: this client only needs to walk/render the
// tree, not author or validate it (that happens server-side and in the
// Control Center). An `image`/`testimonial` block's media reference
// arrives already resolved to a real public URL (`resolvedUrl`/
// `resolvedAvatarUrl`) — publicSiteService.ts resolves every mediaId
// server-side since this site has no authenticated media-read path of
// its own.
export interface PublicEditorBlock {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: PublicEditorBlock[];
}
export interface PublicEditorDocument {
  version: 1;
  blocks: PublicEditorBlock[];
}

export interface PublicPage {
  slug: string;
  title: string;
  body: string;
  excerpt: string | null;
  seo: Record<string, unknown>;
  featuredMedia: PublicMedia | null;
  /** Non-null only once a page has a genuinely saved Site Editor composition (Phase 2) — `body` above is always the safe fallback otherwise. */
  editorBlocks: PublicEditorDocument | null;
  publishedAt: string | null;
  updatedAt: string;
}

// Phase 5 (Navigation + Pages + Homepage, Artify-Backend repo) — mirrors
// publicSiteService.ts's getNavigationMenu() projection: every item's link
// target already resolved to a real URL, with unresolvable items silently
// dropped server-side — never a broken link to render here.
export interface PublicMenuItem {
  label: string;
  url: string;
  openInNewTab: boolean;
  children: PublicMenuItem[];
}

export interface PublicNavigationMenu {
  type: 'PRIMARY' | 'HEADER' | 'FOOTER' | 'MOBILE' | 'CUSTOM';
  slug: string;
  name: string;
  items: PublicMenuItem[];
}

// Phase 10 (Products + Services + Solutions, Artify-Backend repo) — a
// Service/Solution is the exact same catalog row as a Product
// (`type: 'SOLUTION'` added), never a second system. The richer fields
// below (category/featuredMedia/benefits/features/businessProblem/seo/
// ctaForm/relatedProducts/industries) are only ever present on the
// single-product detail response (`getProductBySlug`) — the list
// response (`listProducts`) stays the same flat shape it always was, so
// every existing caller of `listProducts` is unaffected.
export interface PublicProductCategory {
  slug: string;
  name: string;
  description: string | null;
}

export interface PublicIndustry {
  slug: string;
  name: string;
  description: string | null;
}

export interface PublicRelatedProduct {
  slug: string;
  name: string;
  type: 'PRODUCT' | 'SERVICE' | 'SOLUTION';
}

export interface PublicProductCtaForm {
  id: string;
  name: string;
  slug: string;
  fields: PublicFormField[];
  successMessage: string | null;
}

export interface PublicProduct {
  slug: string;
  code: string;
  name: string;
  type: 'PRODUCT' | 'SERVICE' | 'SOLUTION';
  shortDescription: string;
  description: string;
  isFeatured: boolean;
  displayOrder: number;
  category?: PublicProductCategory | null;
  featuredMedia?: PublicMedia | null;
  benefits?: string[];
  features?: string[];
  businessProblem?: string | null;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string; [key: string]: unknown };
  ctaForm?: PublicProductCtaForm | null;
  relatedProducts?: PublicRelatedProduct[];
  industries?: PublicIndustry[];
}

export interface PublicProductModule {
  slug: string;
  code: string;
  name: string;
  description: string;
  isCore: boolean;
  displayOrder: number;
}

// Phase 3 (Site Identity + Global Styles, Artify-Backend repo) — mirrors
// publicSiteService.ts's `getSiteSettings()` projection exactly. `null`
// when the Control Center hasn't configured a public organization at all
// (same "not set up" signal `getSiteStatus().configured` already uses) —
// every field inside a non-null result is always present, since the
// backend's zod schema defaults (matching this site's own current
// hardcoded branding) fill in anything never published.
export interface PublicSiteIdentity {
  siteName: string;
  tagline: string;
  description: string;
  logo: PublicMedia | null;
  logoDark: PublicMedia | null;
  logoMobile: PublicMedia | null;
  favicon: PublicMedia | null;
  socialImage: PublicMedia | null;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  organizationLegalName?: string;
}

export type PublicFontWeight = number | 'normal' | 'bold';

export interface PublicGlobalStyles {
  colors: {
    primary: string;
    primaryHover: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    link: string;
    linkHover: string;
    border: string;
  };
  typography: {
    fontFamilyBase: string;
    fontFamilyHeading: string;
    fontSizeBase: string;
    headingScale: { h1: string; h2: string; h3: string; h4: string; h5: string; h6: string };
    lineHeightBase: number;
    lineHeightHeading: number;
    fontWeightBase: PublicFontWeight;
    fontWeightHeading: PublicFontWeight;
    fontWeightBold: PublicFontWeight;
  };
  layout: {
    containerMaxWidth: string;
    spacingScale: { xs: string; sm: string; md: string; lg: string; xl: string };
    borderRadius: { sm: string; md: string; lg: string; full: string };
  };
  effects: { borderColor: string; borderWidth: string; shadowSm: string; shadowMd: string; shadowLg: string };
  buttons: {
    radius: string;
    paddingX: string;
    paddingY: string;
    fontWeight: PublicFontWeight;
    primaryBg: string;
    primaryText: string;
    primaryHoverBg: string;
    secondaryBg: string;
    secondaryText: string;
    secondaryBorder: string;
  };
  forms: { radius: string; borderColor: string; focusColor: string; background: string; text: string };
  responsive: {
    tablet: { containerMaxWidth?: string; fontSizeBase?: string };
    mobile: { containerMaxWidth?: string; fontSizeBase?: string };
  };
}

export interface PublicSiteSettings {
  identity: PublicSiteIdentity;
  globalStyles: PublicGlobalStyles;
}

// Phase 11 (Case Studies + Content Relationships, Artify-Backend repo) —
// mirrors publicSiteService.ts's projectCaseStudy() exactly. Only an
// ACTIVE/PUBLISHED related Product/Page/Post is ever included — the
// backend silently omits anything unpublished/archived, never a broken
// reference.
export interface PublicCaseStudyTestimonial {
  quote: string;
  authorName: string | null;
  authorTitle: string | null;
}

export interface PublicCaseStudyRelatedProduct {
  slug: string;
  name: string;
  type: 'PRODUCT' | 'SERVICE' | 'SOLUTION';
  shortDescription: string | null;
}

export interface PublicCaseStudyRelatedContent {
  slug: string;
  title: string;
}

export interface PublicCaseStudy {
  slug: string;
  title: string;
  clientName: string | null;
  industry: PublicIndustry | null;
  body: string;
  excerpt: string | null;
  editorBlocks: PublicEditorDocument | null;
  challenge: string | null;
  solutionApproach: string | null;
  implementation: string | null;
  results: string | null;
  testimonial: PublicCaseStudyTestimonial | null;
  technologies: string[];
  gallery: PublicMedia[];
  seo: Record<string, unknown>;
  featuredMedia: PublicMedia | null;
  ctaForm: PublicProductCtaForm | null;
  relatedProducts: PublicCaseStudyRelatedProduct[];
  relatedPages: PublicCaseStudyRelatedContent[];
  relatedPosts: PublicCaseStudyRelatedContent[];
  publishedAt: string | null;
  updatedAt: string;
}

export interface PublicLeadSubmission {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  productInterest?: string;
  source?: 'contact_form' | 'product_inquiry' | 'project_brief' | 'other';
  consent: true;
  /** Honeypot — must stay empty; never render this field visibly to a real visitor. */
  website?: string;
}

// Phase 9 (Forms + Landing Pages + Conversion, Artify-Backend repo) —
// mirrors server/schemas/formSchemas.ts exactly. "file" is not in this
// union — the backend has no safe anonymous-upload path, so this
// renderer never needs to draw a file input.
export type PublicFormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'textarea'
  | 'hidden';

export interface PublicFormFieldOption {
  value: string;
  label: string;
}

export interface PublicFormField {
  key: string;
  label: string;
  type: PublicFormFieldType;
  required: boolean;
  placeholder?: string;
  options?: PublicFormFieldOption[];
  min?: number;
  max?: number;
  visibleWhen?: { fieldKey: string; equals: string };
}

export interface PublicForm {
  id: string;
  name: string;
  slug: string;
  fields: PublicFormField[];
  successMessage: string;
}

export interface PublicFormSubmitInput {
  data: Record<string, string | string[]>;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPagePath?: string;
  /** Honeypot — must stay empty; never render this field visibly to a real visitor. */
  website?: string;
}

export const publicApi = {
  async getSiteStatus(): Promise<{ configured: boolean }> {
    return apiClient.get<{ configured: boolean }>('/public/site');
  },

  async getSiteSettings(): Promise<PublicSiteSettings | null> {
    const { settings } = await apiClient.get<{ settings: PublicSiteSettings | null }>('/public/site-settings');
    return settings;
  },

  async getPageBySlug(slug: string): Promise<PublicPage> {
    const { page } = await apiClient.get<{ page: PublicPage }>(`/public/pages/${encodeURIComponent(slug)}`);
    return page;
  },

  // Phase 5 (Navigation + Pages + Homepage, Artify-Backend repo) — `null` whenever
  // the Control Center hasn't designated a homepage/menu yet (every existing
  // production org today), mirroring getSiteSettings()'s safe-fallback contract.
  async getHomepage(): Promise<PublicPage | null> {
    const { page } = await apiClient.get<{ page: PublicPage | null }>('/public/homepage');
    return page;
  },

  async getNavigationMenu(type: PublicNavigationMenu['type']): Promise<PublicNavigationMenu | null> {
    const { menu } = await apiClient.get<{ menu: PublicNavigationMenu | null }>(
      `/public/navigation-menus/${encodeURIComponent(type)}`
    );
    return menu;
  },

  async listPosts(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
  } = {}): Promise<{ posts: PublicPost[]; total: number }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.tag) query.set('tag', params.tag);
    const qs = query.toString();
    const { posts } = await apiClient.get<{ posts: PublicPost[] }>(`/public/posts${qs ? `?${qs}` : ''}`);
    return { posts, total: posts.length };
  },

  async getPostBySlug(slug: string): Promise<PublicPost> {
    const { post } = await apiClient.get<{ post: PublicPost }>(`/public/posts/${encodeURIComponent(slug)}`);
    return post;
  },

  /** Phase 5 (SEO Control Center) — checked when a path 404s, before showing a hard not-found page. */
  async getRedirectForPath(path: string): Promise<{ toPath: string; statusCode: number } | null> {
    const { redirect } = await apiClient.get<{ redirect: { toPath: string; statusCode: number } | null }>(
      `/public/redirects?path=${encodeURIComponent(path)}`
    );
    return redirect;
  },

  async listCategories(): Promise<PublicCategory[]> {
    const { categories } = await apiClient.get<{ categories: PublicCategory[] }>('/public/categories');
    return categories;
  },

  async listTags(): Promise<PublicTag[]> {
    const { tags } = await apiClient.get<{ tags: PublicTag[] }>('/public/tags');
    return tags;
  },

  async listProducts(
    params: { page?: number; limit?: number; search?: string; type?: 'PRODUCT' | 'SERVICE' | 'SOLUTION'; categorySlug?: string; industrySlug?: string } = {}
  ): Promise<{
    products: PublicProduct[];
    total: number;
  }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.type) query.set('type', params.type);
    if (params.categorySlug) query.set('categorySlug', params.categorySlug);
    if (params.industrySlug) query.set('industrySlug', params.industrySlug);
    const qs = query.toString();
    const { products } = await apiClient.get<{ products: PublicProduct[] }>(`/public/products${qs ? `?${qs}` : ''}`);
    return { products, total: products.length };
  },

  async getProductBySlug(slug: string): Promise<PublicProduct> {
    const { product } = await apiClient.get<{ product: PublicProduct }>(`/public/products/${encodeURIComponent(slug)}`);
    return product;
  },

  async listProductCategories(): Promise<PublicProductCategory[]> {
    const { categories } = await apiClient.get<{ categories: PublicProductCategory[] }>('/public/product-categories');
    return categories;
  },

  async listIndustries(): Promise<PublicIndustry[]> {
    const { industries } = await apiClient.get<{ industries: PublicIndustry[] }>('/public/industries');
    return industries;
  },

  async getProductModules(slug: string): Promise<PublicProductModule[]> {
    const { modules } = await apiClient.get<{ modules: PublicProductModule[] }>(
      `/public/products/${encodeURIComponent(slug)}/modules`
    );
    return modules;
  },

  async listCaseStudies(
    params: { page?: number; limit?: number; search?: string; industrySlug?: string; productSlug?: string } = {}
  ): Promise<{ caseStudies: PublicCaseStudy[]; total: number }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.industrySlug) query.set('industrySlug', params.industrySlug);
    if (params.productSlug) query.set('productSlug', params.productSlug);
    const qs = query.toString();
    const { caseStudies } = await apiClient.get<{ caseStudies: PublicCaseStudy[] }>(`/public/case-studies${qs ? `?${qs}` : ''}`);
    return { caseStudies, total: caseStudies.length };
  },

  async getCaseStudyBySlug(slug: string): Promise<PublicCaseStudy> {
    const { caseStudy } = await apiClient.get<{ caseStudy: PublicCaseStudy }>(`/public/case-studies/${encodeURIComponent(slug)}`);
    return caseStudy;
  },

  async submitLead(input: PublicLeadSubmission): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/public/leads', input);
  },

  /** Real field definitions for the public site's own form renderer (PublicForm.tsx) — 404s for an unknown slug or an ARCHIVED form, same contract as /submit. */
  async getForm(slug: string): Promise<PublicForm> {
    const { form } = await apiClient.get<{ form: PublicForm }>(`/public/forms/${encodeURIComponent(slug)}`);
    return form;
  },

  async getFormById(id: string): Promise<PublicForm> {
    const { form } = await apiClient.get<{ form: PublicForm }>(`/public/forms/by-id/${encodeURIComponent(id)}`);
    return form;
  },

  async submitForm(slug: string, input: PublicFormSubmitInput): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/public/forms/${encodeURIComponent(slug)}/submit`, input);
  },
};

const FALLBACK_BLOG_CATEGORY: BlogCategory = 'AI Research & Insights';

/**
 * Maps a real, published CMS Post (public projection) into the
 * BlogPost shape the existing blog UI renders. Every field here is either
 * copied verbatim from the real post or honestly derived (word count from
 * real body length) — never invented. Fields the CMS doesn't track
 * (views/likes/comments/ratings) are left at an honest empty/zero default
 * rather than a fabricated placeholder.
 */
export function mapPostToBlogPost(post: PublicPost): BlogPost {
  const plainText = post.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;
  // Phase 7 (Artify-Backend) added a real, author-written excerpt field —
  // prefer it over the auto-truncated body when the author actually set one.
  const derivedExcerpt = plainText.length > 220 ? `${plainText.slice(0, 217)}...` : plainText;
  const excerpt = post.excerpt?.trim() || derivedExcerpt;
  // The backend validates this against a strict, named-field schema
  // (server/schemas/contentSchemas.ts's seoMetadataSchema) that mirrors
  // ArticleSeoMetadata field-for-field, so it's safe to pass through
  // whole — previously only 3 of its ~12 fields survived this mapper,
  // silently dropping canonicalUrl/robotsDirective/ogTitle/schemaType/etc.
  // before they ever reached generateBlogPostSeo().
  const seo: ArticleSeoMetadata | undefined = post.seo && Object.keys(post.seo).length > 0 ? { ...(post.seo as ArticleSeoMetadata) } : undefined;

  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    excerpt,
    content: post.body,
    category: (post.category?.name as BlogCategory) || FALLBACK_BLOG_CATEGORY,
    type: 'Article',
    author: {
      name: post.author?.name || 'Artify Solutions Team',
      role: '',
      avatar: (post.author?.name || 'AS')
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      bio: post.author?.bio || undefined,
    },
    publishDate: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '',
    readTime,
    tags: post.tags.map((t) => t.name),
    coverImage: post.featuredMedia?.url,
    views: 0,
    likes: 0,
    status: 'published',
    lastModified: post.updatedAt,
    seo,
  };
}
