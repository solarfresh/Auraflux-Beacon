export type ISPStep = 'INITIATION' | 'SELECTION' | 'EXPLORATION' | 'FORMULATION' | 'COLLECTION' | 'PRESENTATION';
// ChatMessage: { id: number, type: 'user' | 'agent', content: string }
// ReflectionLog: { thought: string, category: string, timestamp: number }
export type WorkflowStep = 'SEARCH' | 'SCOPE' | 'COLLECTION' | 'ANALYSIS' | 'OUTPUT';
export type CardStatus = 'ACTIVE' | 'COMPLETE' | 'DISABLED';

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

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}
