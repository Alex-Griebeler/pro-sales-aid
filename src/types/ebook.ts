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
  alternatives?: string[];
  followUp?: string;
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

export interface QuestionOption {
  text: string;
}

export interface ChecklistItem {
  text: string;
  category?: string;
}

export interface TocItem {
  id: string;
  title: string;
  pageNumber: number;
}

export interface ParqQuestion {
  question: string;
  guidance: string;
}

export interface EbookSection {
  id: string;
  type?: 'hero' | 'triangle_concept' | 'ai_tool' | 'intro_concept' | 'toc' | 'checklist';
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
  fundamentsTable?: { fundament: string; era: string; effect: string }[];
  highlight?: string;
  question?: string;
  questionOptions?: QuestionOption[];
  principle?: string;
  objectives?: string[];
  notList?: string[];
  yesList?: string[];
  tocItems?: TocItem[];
  checklistItems?: ChecklistItem[];
  parqQuestions?: ParqQuestion[];
  aiExamples?: string[];
}
