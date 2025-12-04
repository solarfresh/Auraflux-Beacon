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
