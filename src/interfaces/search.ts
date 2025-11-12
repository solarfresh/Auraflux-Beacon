export type WorkflowStep = 'SEARCH' | 'SCOPE' | 'COLLECTION' | 'ANALYSIS' | 'OUTPUT';
export type CardStatus = 'ACTIVE' | 'COMPLETE' | 'DISABLED';


export interface Dichotomy {
  id: string;
  name: string;
  description: string;
  roles: string[]; // Agents associated with this conflict
}

export interface KnowledgeGapRequest {
  agentRole: string;
  query: string;
  reason: string;
  selected: boolean; // UI state for selection
}

export interface ScopeData {
  dichotomy: string;
  roles: string[];
  question: string;
}

export interface SearchAssistant {
  related_topics: string[];
  next_actions: string[];
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}
