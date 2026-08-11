import { DateTimeString, EntityStatus, ID } from '@auraflux/design-system/interfaces/core';

export interface Project {
  id: ID;
  name: string;
  description?: string;
  status: EntityStatus;
  tags: string[];
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}
