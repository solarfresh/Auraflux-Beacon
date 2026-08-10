import { DateTimeString, EntityStatus, ID } from '@auraflux/shared-core/interfaces/core';
import type { BaseSelectorState } from '@auraflux/design-system/interfaces/indicators';

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

export type ProjectFilterType = 'ALL' | 'ACTIVE' | 'LOCKED' | 'ARCHIVED';
export type ProjectSortType = 'EDITED' | 'CREATED' | 'NAME';
export type ProjectSelectorState = BaseSelectorState<ProjectFilterType, ProjectSortType>;
