import { DateTimeString, EntityStatus, ID } from '@auraflux/shared-core/interfaces/core';
import type { BaseSelectorState } from '@auraflux/design-system/interfaces/indicators';

export type ToolCategory =
  | 'CONSULTATION'
  | 'MULL'
  | 'SYNTHESIS'

export interface Project {
  id: ID;
  name: string;
  description?: string;
  status: EntityStatus;
  currentTool: ToolCategory;
  tags: string[];
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export type ProjectFilterType = 'ALL' | 'ACTIVE' | 'LOCKED' | 'ARCHIVED';
export type ProjectSortType = 'EDITED' | 'CREATED' | 'NAME';
export type ProjectSelectorState = BaseSelectorState<ProjectFilterType, ProjectSortType>;
