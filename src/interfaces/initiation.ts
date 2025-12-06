import { FeasibilityStatus, TopicKeyword, TopicScopeElement } from "./workflow";

export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  content: string;
  name: string;
  timestamp: string;
  sequence_number: number;
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

export interface RefinedTopic {
  stability_score: number,
  feasibility_status: FeasibilityStatus,
  final_research_question: string,
  keywords: TopicKeyword[],
  scope: TopicScopeElement[],
  latest_reflection: string,
  resource_suggestion: string,
}