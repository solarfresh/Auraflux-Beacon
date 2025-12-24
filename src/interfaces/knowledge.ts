import { ID, DateTimeString, ColorString, FeasibilityStatus } from './core';

/**
 * Base abstraction for all knowledge-related entities.
 */
export interface BaseKnowledgeElement {
  id: ID;
  label: string;
  description?: string;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

/**
 * Topic Knowledge: Keywords
 * Represents a semantic unit of the research topic.
 */
export interface TopicKeyword extends BaseKnowledgeElement {
  importanceWeight?: number; // 0.0 to 1.0
  isCore?: boolean;          // Whether it's a central concept
  semanticCategory?: string; // e.g., 'Methodology', 'Theory', 'Technology'
}

/**
 * Topic Knowledge: Scope
 * Defines the boundaries of the research inquiry.
 */
export interface TopicScopeElement extends BaseKnowledgeElement {
  boundaryType: 'INCLUSION' | 'EXCLUSION';
  rationale?: string;       // The logic behind including or excluding this
}

/**
 * Resource Knowledge: Research Materials
 * Represents the raw data and literature collected.
 */
export type ResourceFormat =
  | 'URL'          // Live website or web application
  | 'PDF'          // Static document file
  | 'DOCUMENT'     // Word, Text, or local file
  | 'IMAGE'        // Visual data, diagrams
  | 'SNIPPET';     // Raw text copied manually

export type ResourceSource =
  | 'ACADEMIC'     // Journals, papers, university sources
  | 'NEWS'         // Journalism, media outlets
  | 'SOCIAL'       // Public discourse, expert threads (X, LinkedIn)
  | 'GOVERNMENT'   // Policy, official statistics
  | 'MANUAL'       // Personal notes, direct interviews, observations
  | 'AI_GENERATED'; // Synthesized data from LLMs

export interface ResourceItem extends BaseKnowledgeElement {
  url?: string;
  format: ResourceFormat;
  sourceType: ResourceSource;
  summary: string;          // AI-generated distillation
  rawContent?: string;      // The original text for indexing
  keywords: string[];       // Derived keywords
  userNotes: string;        // Explicit user reflections on the resource
  relevanceScore: number;   // 1 to 5 scale
}

/**
 * Research Focus
 * The combined definition of what is being studied.
 * This is the primary output of Initiation and the primary input for Exploration.
 */
export interface ResearchFocus {
  finalQuestion: string;
  feasibilityStatus: FeasibilityStatus;
  keywords: TopicKeyword[];
  scope: TopicScopeElement[];
  stabilityScore: number;   // Calculated metric of focus clarity
}