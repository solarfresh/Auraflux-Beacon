import { DateTimeString, EntityStatus, ID, ParticipantRole, Percentage } from './core';

export type ISPStage =
  | 'INITIATION' // Merges INITIATION and SELECTION phases. Focus: Moving from vague concepts to a locked research question (Score < 8 to Score >= 8).
  | 'EXPLORATION'           // Focus: Dealing with information overload (Confusion/Frustration) by sifting and evaluating sources.
  | 'SYNTHESIS'           // Focus: Structuring arguments and concepts (Clarity/Focus) into a coherent framework.
export type ReflectionEntryType =
  | 'EMOTIONAL_STATUS'       // User logs their feeling (e.g., frustrated, confused, hopeful)
  | 'COGNITIVE_INSIGHT'      // User records a specific new connection, conflict, or idea
  | 'EXPLORATION_CHALLENGE'  // User notes a practical difficulty (e.g., lack of good sources)
  | 'AI_GUIDANCE_FEEDBACK'   // AI-generated encouragement or structured guidance based on user activity
  | 'UNCATEGORIZED_DRAFT';
export type ReflectionLogStatus = 'draft' | 'committed';
export type StabilityStatus = 'Finalizing' | 'Refining' | 'Defining';

export interface Project {
  id: ID;
  name: string;
  description?: string;
  status: EntityStatus;
  tags: string[];
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface ReflectionLogEntry {
  id: ID;
  title: string;
  content: string;  // Often promoted/synced from ResourceItem.userNotes
  entryType: ReflectionEntryType;
  step: ISPStage;  // Tracks which phase the user was in
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
  step: ISPStage;
  label: string;
  description: string;
  expectedCompletion: Percentage;
}

export interface GroundednessMetric {
  solidity: 'SOLID' | 'PULSING';
  jitterLevel: 'NONE' | 'LOW' | 'HIGH';
  description: string;
}

/**
 * Project State Decorator
 * A wrapper to add "Process Status" to any Knowledge or Canvas entity
 * without polluting the original Knowledge Interface.
 */
export interface ProjectMetadata {
  state: EntityStatus;
  lastModifiedBy: ParticipantRole;
  version: number;
}