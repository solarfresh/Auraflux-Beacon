import { FeasibilityStatus, BaseChatMessage, DateTimeString } from './core';
import { TopicKeyword, TopicScopeElement, ResearchFocus } from './knowledge';
import { EntityStatus } from './workflow';

export type ManagementType = 'final-question' | 'keyword' | 'scope' | 'reflection-log' | null;

export interface TopicKeywordStyle {
    classes: string;
    icon: string;
    iconColor: string;
    secondaryText: string;
    actionIcon?: string; // Icon for the action button on the right
}

/**
 * Interface for the refinement process.
 * Tracks the stability and readiness of the research topic.
 */
export interface RefinedTopic extends ResearchFocus {
  resourceSuggestion?: string;
}

/**
 * Current Focus State.
 * Used by the Initiation Store to manage the active drafting area.
 */
export interface CurrentFocusData {
  finalQuestion: string;
  topicKeywords: ProcessedKeyword[];
  topicScope: ProcessedScope[];
  latestReflection: string;
  feasibilityStatus: FeasibilityStatus;
  stabilityScore: number;
}

/**
 * Processed Knowledge Elements.
 * Combines the pure Knowledge structure with Workflow state for the UI.
 */
export interface ProcessedKeyword extends TopicKeyword {
  EntityStatus: EntityStatus;
}

export interface APITopicKeyword {
  id: string;
  text: string;
  status: EntityStatus;
  created_at: DateTimeString;
  updated_at: DateTimeString;
}

export interface ProcessedScope extends TopicScopeElement {
  EntityStatus: EntityStatus;
}

export interface APITopicScopeElement {
  id: string;
  label: string;
  value: string;
  status: EntityStatus;
  created_at: DateTimeString;
  updated_at: DateTimeString;
}

export interface APIRefinedTopic {
  stability_score: number,
  feasibility_status: FeasibilityStatus,
  final_research_question: string,
  keywords: APITopicKeyword[],
  scope: APITopicScopeElement[],
  resource_suggestion: string,
}