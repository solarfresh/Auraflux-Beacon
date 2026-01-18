import { ResearchFocus, TopicKeyword, TopicScopeElement } from './knowledge';
import type { EntityStatus } from './core';

export type ManagementType = 'final-question' | 'keyword' | 'scope' | 'reflection-log' | null;

export interface TopicKeywordStyle {
    classes: string;
    icon: string;
    iconColor: string;
    secondaryText: string;
    actionIcon?: string; // Icon for the action button on the right
}

/**
 * Processed Knowledge Elements.
 * Combines the pure Knowledge structure with Workflow state for the UI.
 */
export interface ProcessedKeyword extends TopicKeyword {
  entityStatus: EntityStatus;
}

export interface ProcessedScope extends TopicScopeElement {
  entityStatus: EntityStatus;
}

/**
 * Interface for the refinement process.
 * Tracks the stability and readiness of the research topic.
 */
export interface RefinedTopic extends ResearchFocus {
  resourceSuggestion?: string;
  keywords: ProcessedKeyword[];
  scope: ProcessedScope[];
}
