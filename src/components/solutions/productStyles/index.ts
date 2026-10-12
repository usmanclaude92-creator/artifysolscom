import type React from 'react';
import type { ProductStyleProps } from './shared';
import {
  BentoStyle,
  CinematicStyle,
  DatasheetStyle,
  EditorialStyle,
  ExecutiveStyle,
  ShowcaseStyle,
  StoryStyle,
  TabbedStyle,
  WorkflowStyle,
} from './styles';

/** Page styles chosen per product in the Control Center. "classic" (or anything unknown) keeps the original layout. */
export const PRODUCT_PAGE_STYLES: Record<string, React.FC<ProductStyleProps>> = {
  executive: ExecutiveStyle,
  showcase: ShowcaseStyle,
  editorial: EditorialStyle,
  story: StoryStyle,
  bento: BentoStyle,
  tabbed: TabbedStyle,
  workflow: WorkflowStyle,
  cinematic: CinematicStyle,
  datasheet: DatasheetStyle,
};

export function resolveProductPageStyle(name: string | null | undefined): React.FC<ProductStyleProps> | null {
  return (name && PRODUCT_PAGE_STYLES[name]) || null;
}

export type { ProductStyleProps } from './shared';
