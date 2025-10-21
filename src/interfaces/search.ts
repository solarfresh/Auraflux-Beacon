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
