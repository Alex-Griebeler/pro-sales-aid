import { ReactNode } from 'react';

export interface TriangleNode {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface Scenario {
  t: string;
  d: string;
  q?: string;
}

export interface Mapping {
  label: string;
  val: string;
}

export interface Offer {
  k: string;
  v: string;
}

export interface SplitSection {
  title: string;
  items: string[];
}

export interface TypeSection {
  t: string;
  d: string;
}

export interface EbookSection {
  id: string;
  type?: 'hero' | 'triangle_concept' | 'ai_tool';
  title: string;
  subtitle?: string;
  tag?: string;
  content?: string;
  nodes?: TriangleNode[];
  auxiliaryText?: string;
  scenarios?: Scenario[];
  mapping?: Mapping[];
  offers?: Offer[];
  split?: SplitSection[];
  types?: TypeSection[];
  conduct?: string;
  quote?: string;
  strategy?: string;
  list?: string[];
  highlight?: string;
}
