export interface SearchAssistant {
  related_topics: string[];
  next_actions: string[];
}

export interface SearchResult {
  title: string;
  description: string;
  link: string;
  source: string;
}
