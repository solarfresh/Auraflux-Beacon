export type FeasibilityStatus = 'HIGH' | 'MEDIUM' | 'LOW';
export type ISPStep = 'INITIATION' | 'SELECTION' | 'EXPLORATION' | 'FORMULATION' | 'COLLECTION' | 'PRESENTATION';
export type TopicKeywordStatus = 'LOCKED' | 'DRAFT' | 'DISCARDED';
export type TopicScopeElementStatus = 'LOCKED' | 'DRAFT' | 'DISCARDED';

export interface TopicKeyword {
  text: string;
  status: TopicKeywordStatus;
}

export interface TopicScopeElement {
  label: string;
  value: string;
  status: TopicScopeElementStatus;
}