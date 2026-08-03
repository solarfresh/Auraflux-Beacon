import { ConnectStatus, EntityStatus } from "./core";
import { ProviderType } from "@/interfaces/agents";

export type BadgeColor = 'indigo' | 'amber' | 'emerald' | 'red' | 'gray' | 'purple' | 'blue' | 'slate';
export type FilterState = 'ALL' | ConnectStatus | EntityStatus | ProviderType
export type SorterState = 'EDITED' | 'CREATED' | 'HEALTH' | 'LATENCY' | 'NAME' | 'VERSION'

export interface BaseSelectorState {
  filter: FilterState;
  sorter: SorterState;
};

export interface ModelSelectorState extends BaseSelectorState {
  modelFamily: FilterState;
};

export interface ModelProviderSelectorState extends BaseSelectorState {
  providerType: FilterState;
}