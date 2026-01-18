import { DateTimeString, EntityStatus, ID, ParticipantRole, Percentage } from './core';
import { ResearchFocus, TopicKeyword, TopicScopeElement } from './knowledge';

export type ISPStep =
  | 'TOPIC_DEFINITION_LOCKIN' // Merges INITIATION and SELECTION phases. Focus: Moving from vague concepts to a locked research question (Score < 8 to Score >= 8).
  | 'EXPLORATION'           // Focus: Dealing with information overload (Confusion/Frustration) by sifting and evaluating sources.
  | 'FORMULATION'           // Focus: Structuring arguments and concepts (Clarity/Focus) into a coherent framework.
  | 'COLLECTION'            // Focus: Purposefully gathering specific evidence to support the finalized argument structure (Confidence).
  | 'PRESENTATION';         // Focus: Finalizing, reviewing, and exporting the research output (Satisfaction/Relief).
export type ReflectionEntryType =
  | 'EMOTIONAL_STATUS'       // User logs their feeling (e.g., frustrated, confused, hopeful)
  | 'COGNITIVE_INSIGHT'      // User records a specific new connection, conflict, or idea
  | 'EXPLORATION_CHALLENGE'  // User notes a practical difficulty (e.g., lack of good sources)
  | 'AI_GUIDANCE_FEEDBACK'   // AI-generated encouragement or structured guidance based on user activity
  | 'UNCATEGORIZED_DRAFT';
export type ReflectionLogStatus = 'draft' | 'committed';

export const ISP_STEP_TEXT_MAP: Record<ISPStep, { name: string; description: string; percentage: number; }> = {
    TOPIC_DEFINITION_LOCKIN: {
        name: 'Topic Definition & Lock-in',
        description: 'Defining the research question and locking scope',
        percentage: 10,
    },
    EXPLORATION: {
        name: 'Knowledge Retrieval',
        description: 'Sifting large amounts of information and managing conflicts',
        percentage: 30,
    },
    FORMULATION: {
        name: 'Argument Structuring',
        description: 'Building the core thesis and evidence framework',
        percentage: 50,
    },
    COLLECTION: {
        name: 'Precision Evidence Collection',
        description: 'Targeted gathering of specific supporting data',
        percentage: 70,
    },
    PRESENTATION: {
        name: 'Final Output & Delivery',
        description: 'Reviewing, formatting, and exporting the final report',
        percentage: 90,
    },
};

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

export interface ReflectionLogEntry {
  id: ID;
  title: string;
  content: string;  // Often promoted/synced from ResourceItem.userNotes
  entryType: ReflectionEntryType;
  step: ISPStep;  // Tracks which phase the user was in
  /** * Semantic Associations
   * Cross-layer links to Knowledge entities.
   */
  associatedResourceIds: ID[];  // Links to knowledge.ResourceItem
  associatedConceptIds: ID[]; // Links to knowledge.TopicKeyword
  status: ReflectionLogStatus;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

/**
 * Phase Progress Configuration
 * Used for UI indicators (e.g., Progress Bar).
 */
export interface PhaseConfig {
  step: ISPStep;
  label: string;
  description: string;
  expectedCompletion: Percentage;
}

/**
 * Workflow State Decorator
 * A wrapper to add "Process Status" to any Knowledge or Canvas entity
 * without polluting the original Knowledge Interface.
 */
export interface WorkflowMetadata {
  state: EntityStatus;
  lastModifiedBy: ParticipantRole;
  version: number;
}