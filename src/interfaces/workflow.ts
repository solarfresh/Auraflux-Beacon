export type ISPStep = 'INITIATION' | 'SELECTION' | 'EXPLORATION' | 'FORMULATION' | 'COLLECTION' | 'PRESENTATION';

export interface ChatMessage {
  id: number;
  type: 'user' | 'agent';
  content: string;
}

export interface Keyword {
  text: string;
  status: 'Locked' | 'Draft';
  source: string;
}

export interface ReflectionLog {
  thought: string;
  category: string;
  timestamp: number;
}

export interface ScopeItem {
  label: string;
  value: string;
  status: 'Locked' | 'Draft';
}
