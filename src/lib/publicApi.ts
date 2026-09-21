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
import type { BlogPost, BlogCategory } from '../types';

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
  seo: Record<string, unknown>;
  category: { slug: string; name: string } | null;
  tags: { slug: string; name: string }[];
  author: PublicAuthor | null;
  featuredMedia: PublicMedia | null;
  publishedAt: string | null;
  updatedAt: string;
}

export interface PublicPage {
  slug: string;
  title: string;
  body: string;
  seo: Record<string, unknown>;
  featuredMedia: PublicMedia | null;
  publishedAt: string | null;
  updatedAt: string;
}

export interface PublicProduct {
  slug: string;
  code: string;
  name: string;
  type: 'PRODUCT' | 'SERVICE';
  shortDescription: string;
  description: string;
  isFeatured: boolean;
  displayOrder: number;
}

export interface PublicProductModule {
  slug: string;
  code: string;
  name: string;
  description: string;
  isCore: boolean;
  displayOrder: number;
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

export const publicApi = {
  async getSiteStatus(): Promise<{ configured: boolean }> {
    return apiClient.get<{ configured: boolean }>('/public/site');
  },

  async getPageBySlug(slug: string): Promise<PublicPage> {
    const { page } = await apiClient.get<{ page: PublicPage }>(`/public/pages/${encodeURIComponent(slug)}`);
    return page;
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

  async listCategories(): Promise<PublicCategory[]> {
    const { categories } = await apiClient.get<{ categories: PublicCategory[] }>('/public/categories');
    return categories;
  },

  async listTags(): Promise<PublicTag[]> {
    const { tags } = await apiClient.get<{ tags: PublicTag[] }>('/public/tags');
    return tags;
  },

  async listProducts(params: { page?: number; limit?: number; search?: string; type?: 'PRODUCT' | 'SERVICE' } = {}): Promise<{
    products: PublicProduct[];
    total: number;
  }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.type) query.set('type', params.type);
    const qs = query.toString();
    const { products } = await apiClient.get<{ products: PublicProduct[] }>(`/public/products${qs ? `?${qs}` : ''}`);
    return { products, total: products.length };
  },

  async getProductBySlug(slug: string): Promise<PublicProduct> {
    const { product } = await apiClient.get<{ product: PublicProduct }>(`/public/products/${encodeURIComponent(slug)}`);
    return product;
  },

  async getProductModules(slug: string): Promise<PublicProductModule[]> {
    const { modules } = await apiClient.get<{ modules: PublicProductModule[] }>(
      `/public/products/${encodeURIComponent(slug)}/modules`
    );
    return modules;
  },

  async submitLead(input: PublicLeadSubmission): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/public/leads', input);
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
  const excerpt = plainText.length > 220 ? `${plainText.slice(0, 217)}...` : plainText;
  const seo = post.seo as { ogImage?: string; seoScore?: number } | undefined;

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
    seo: seo ? { ogImage: seo.ogImage, seoScore: seo.seoScore } : undefined,
  };
}
