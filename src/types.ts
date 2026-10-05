export interface Industry {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  coreAgents: string[];
  keyWorkflows: { title: string; desc: string; impact: string }[];
  connectedSystems: string[];
  metrics: { label: string; value: string }[];
}

export type AiProductCategoryType =
  | 'all'
  | 'ai-automation'
  | 'ai-agents'
  | 'generative-ai'
  | 'business-intelligence'
  | 'ai-customer-experience'
  | 'ai-productivity'
  | 'custom-ai-solutions';

export interface AiProductWorkflowStep {
  step: number;
  title: string;
  phase: string;
  description: string;
  output: string;
}

export interface AiProductFeature {
  title: string;
  description: string;
  icon?: string;
  metric?: string;
}

export interface AiProductUseCase {
  industry: string;
  scenario: string;
  outcome: string;
  timeToValue: string;
}

export interface AiProductBenefit {
  title: string;
  description: string;
  value?: string;
}

export interface AiProductTechLayer {
  layer: string;
  technologies: string[];
}

export interface AiProductItem {
  id: string;
  name: string;
  slug: string;
  category: AiProductCategoryType;
  categoryLabel: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  badge?: string;
  status: 'available' | 'enterprise-preview' | 'general-availability';
  rating?: number;
  uptime?: string;
  problem: {
    title: string;
    summary: string;
    points: string[];
  };
  solution: {
    title: string;
    summary: string;
    points: string[];
  };
  features: AiProductFeature[];
  benefits: AiProductBenefit[];
  useCases: AiProductUseCase[];
  workflow: AiProductWorkflowStep[];
  techStack: AiProductTechLayer[];
  connectedSystems: string[];
  metrics: { label: string; value: string }[];
  demoCapabilities?: string[];
  cta: {
    primary: string;
    secondary: string;
  };
}

export type AppRoute =
  | 'home'
  | 'ai-solutions'
  | 'solutions-catalog'
  | 'ai-product-detail'
  | 'product-detail'
  | 'services'
  | 'ecosystem'
  | 'industries'
  | 'case-studies'
  | 'case-study-detail'
  | 'about'
  | 'blog'
  | 'blog-post'
  | 'contact'
  | 'privacy'
  | 'privacy-policy'
  | 'terms'
  | 'cms-page';

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  icon: string;
  status: 'active' | 'analyzing' | 'orchestrating' | 'standby';
  tools: string[];
  permissions: string;
  sampleAction: string;
  throughput: string;
}

export interface BusinessFunction {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  capabilities: { title: string; description: string; tag: string }[];
  agentFleet: string[];
  sampleWorkflow: { step: string; actor: string; output: string }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category?: string;
  description?: string;
  architecture?: string[];
  agents?: string[];
  kpis?: { label: string; value: string }[];
  highlight?: string;
  industry?: string;
  timeframe?: string;
  tagline?: string;
  clientType?: string;
  challenge?: string;
  solution?: string;
  systemsConnected?: string[];
  results?: { metric: string; label: string }[];
}

export interface MethodologyStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export interface IntegrationCategory {
  category: string;
  description: string;
  items: { name: string; type: string; status: string }[];
}

export interface EnterpriseIntegration {
  id: string;
  name: string;
  category: 'erp' | 'crm' | 'collaboration' | 'cloud' | 'finance' | 'custom';
  protocol: string;
  logo: string;
  tagline: string;
}

export interface GeneratedBlueprint {
  goal: string;
  department: string;
  industry: string;
  currentStack: string;
  suggestedAgents: string[];
  architectureSummary: string;
  estimatedTimeToValue: string;
  recommendedPipelines: string[];
}

export interface ProjectBriefSubmission {
  name: string;
  company: string;
  email: string;
  phone?: string;
  industry: string;
  projectDescription: string;
  currentTools?: string;
  timeline: string;
}

export interface ConsultantMessage {
  id: string;
  role?: 'user' | 'agent' | 'system' | 'assistant';
  sender?: 'user' | 'agent';
  content?: string;
  text?: string;
  timestamp: string;
  suggestedActions?: string[];
  suggestedArchitecture?: string[];
  architectureBlueprint?: any;
  suggestions?: string[];
}

export interface ArtifyProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface ArtifyProductPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annual' | 'one_time';
  trialDays: number;
  features: string[];
  limits?: { [key: string]: string | number };
  recommended?: boolean;
}

export interface ArtifyProduct {
  id: string;
  name: string;
  slug: string;
  category: 'ai_software' | 'ai_agents' | 'accounting_software' | 'business_automation' | 'erp_solutions' | 'analytics' | 'productivity_tools' | 'custom_software';
  categoryLabel: string;
  type: 'saas_application' | 'autonomous_agent_fleet' | 'intelligence_engine' | 'api_platform';
  version: string;
  badge?: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: { title: string; desc: string }[];
  connectedSystems: string[];
  assignedAgents: string[];
  plans: ArtifyProductPlan[];
  pricingModel: 'subscription' | 'one_time' | 'hybrid';
  trialAvailable: boolean;
  trialDays: number;
  rating: number;
  reviewsCount: number;
  uptime: string;
  faqs: { question: string; answer: string }[];
  requirements: string[];
  status: 'active' | 'beta' | 'coming_soon';
}

export interface ArtifyService {
  id: string;
  name: string;
  slug: string;
  category: 'ai_consulting' | 'ai_implementation' | 'business_automation' | 'erp_consulting' | 'software_development' | 'custom_ai_solutions' | 'data_analytics' | 'ai_agent_development';
  categoryLabel: string;
  pricingModel: 'one_time' | 'recurring' | 'quote_based' | 'subscription_based';
  startingPrice: number;
  priceUnit: string;
  tagline: string;
  description: string;
  deliverables: string[];
  estimatedTimeline: string;
  availability: 'immediate' | 'next_sprint' | 'custom_booking' | 'limited_slots';
  recommendedFor: string;
  technologies: string[];
  status: 'active' | 'limited_slots';
}

/**
 * Client Portal identity + real data types. Replaces the old fabricated
 * commerce/billing block (OrderItem/CustomerOrder/CustomerPayment/
 * CustomerInvoice/SupportTicket/SecuritySession/SecurityEvent/
 * UserSubscription/PurchasedProduct/InvoiceRecord/ApiKeyRecord/
 * ActiveAIProject/UserProfile) that AuthContext.tsx used to generate
 * client-side with Math.random() IDs. AuthUser mirrors exactly what the
 * Platform API's /auth/login, /auth/register and /auth/me return (see
 * Artify-Backend's server/types/domain.ts SanitizedUser) — real
 * subscription/contract/invoice/payment data now comes from
 * src/lib/portalApi.ts's own types, fetched live, never attached here.
 */
export interface AuthUser {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  /** The organization's display name (from /auth/me's `organizations` list) — not necessarily set immediately after login/register. */
  company: string;
  /** Real role key from the backend, e.g. "ADMIN", "SUPER_ADMIN", "MANAGER", "USER", "VIEWER" — never a client-fabricated value. */
  role: string;
  roleName: string;
  permissions: string[];
  jobTitle: string | null;
  phone: string | null;
}

export type BlogCategory =
  | 'All'
  | 'AI Research & Insights'
  | 'Enterprise Case Studies'
  | 'Product Updates & News'
  | 'Autonomous Agents'
  | 'Security & Governance'
  | 'Engineering & Architecture';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  verified?: boolean;
}

export interface BlogComment {
  id: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  date: string;
  content: string;
  likes: number;
}

export interface ArticleSeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterImage?: string;
  ogType?: 'article' | 'website' | 'news';
  twitterCard?: 'summary_large_image' | 'summary';
  robotsDirective?: 'index, follow' | 'noindex, nofollow' | 'noindex, follow';
  schemaType?: 'TechArticle' | 'NewsArticle' | 'BlogPosting' | 'Report';
  structuredDataSnippet?: string;
  seoScore?: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  type: 'Article' | 'News' | 'Case Study' | 'Whitepaper';
  author: BlogAuthor;
  publishDate: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  coverGradient?: string;
  views: number;
  likes: number;
  claps?: number;
  bookmarksCount?: number;
  rating?: number;
  ratingCount?: number;
  userRating?: number;
  commentsCount?: number;
  comments?: BlogComment[];
  keyTakeaways?: string[];
  relatedTopics?: string[];
  status?: 'published' | 'draft' | 'archived';
  lastModified?: string;
  draftSavedAt?: string;
  seo?: ArticleSeoMetadata;
}

