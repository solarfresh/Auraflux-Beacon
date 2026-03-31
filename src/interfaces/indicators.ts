import { EntityStatus } from "./core";

export type BadgeColor = 'indigo' | 'amber' | 'emerald' | 'red' | 'gray' | 'purple' | 'blue' | 'slate';
export type FilterState = 'ALL' | EntityStatus
export type SorterState = 'EDITED' | 'CREATED'
export type SelectorState = {
  filter: FilterState;
  sorter: SorterState;
  modelFamily?: string;
};