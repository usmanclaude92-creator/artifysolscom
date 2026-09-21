import React from 'react';
import { AiSolutionsPage } from './AiSolutionsPage';

/**
 * `/solutions` and `/ai-solutions` render the same real, API-backed product
 * catalog (Phase 11 — consolidated rather than duplicated: this route
 * previously rendered a fictional "24 modular systems" catalog with no
 * backend behind it, which is exactly the kind of fabricated business data
 * the public site must never present as real).
 */
interface SolutionsCatalogPageProps {
  onSelectProduct: (product: { slug: string }) => void;
  onOpenConsultant: () => void;
  onOpenSolutionBuilder: (industryId?: string) => void;
  onNavigateToContact: () => void;
  onNavigateToIndustries?: () => void;
  onNavigateToAiSolutions?: () => void;
  theme?: 'dark' | 'light';
}

export const SolutionsCatalogPage: React.FC<SolutionsCatalogPageProps> = ({
  onSelectProduct,
  onOpenConsultant,
  onOpenSolutionBuilder,
  onNavigateToContact,
  theme = 'dark',
}) => (
  <AiSolutionsPage
    onSelectProduct={onSelectProduct}
    onOpenConsultant={onOpenConsultant}
    onOpenSolutionBuilder={() => onOpenSolutionBuilder()}
    onNavigateToContact={onNavigateToContact}
    theme={theme}
  />
);
