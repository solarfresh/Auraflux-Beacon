export type FeasibilityStatus = 'HIGH' | 'MEDIUM' | 'LOW';
export type ManagementType = 'final-question' | 'keyword' | 'scope-management' | 'reflection-log' | 'keyword-add' | 'scope-add' | 'scope' | null;
export type TopicKeywordStatus = 'USER_DRAFT' | 'AI_EXTRACTED' | 'LOCKED' | 'ON_HOLD';
export type TopicScopeElementStatus = 'USER_DRAFT' | 'AI_EXTRACTED' | 'LOCKED' | 'ON_HOLD';

export interface TopicKeyword {
  text: string;
  status: TopicKeywordStatus;
}

export interface TopicKeywordStyle {
    classes: string;
    icon: string;
    iconColor: string;
    secondaryText: string;
    actionIcon?: string; // Icon for the action button on the right
}

export interface TopicScopeElement {
  label: string;
  value: string;
  status: TopicScopeElementStatus;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  content: string;
  name: string;
  timestamp: string;
  sequence_number: number;
}

export interface ReflectionLog {
  thought: string;
  category: string;
  timestamp: number;
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