import { DateTimeString, EntityStatus, ID, ParticipantRole } from './core';

export type ISPStage =
  | 'CONSULTATION' // Merges INITIATION and SELECTION phases. Focus: Moving from vague concepts to a locked research question (Score < 8 to Score >= 8).
  | 'EXPLORATION'           // Focus: Dealing with information overload (Confusion/Frustration) by sifting and evaluating sources.
  | 'SYNTHESIS'           // Focus: Structuring arguments and concepts (Clarity/Focus) into a coherent framework.

export interface Project {
  id: ID;
  name: string;
  description?: string;
  status: EntityStatus;
  currentStage: ISPStage;
  tags: string[];
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
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