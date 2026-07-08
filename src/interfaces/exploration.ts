import { ID, ChatMessage } from './core';
import { ConceptualGraph } from './conceptual-map';

export type ManagementType = 'final-question' | 'keyword' | 'manual-resource' | 'reflection-log' | 'scope' | null;

export interface ExplorationState {
  // --- Resource Management ---

  canvasView: ConceptualGraph;
  selectedNodeId: ID | null;

  // --- AI Interaction & State ---
  chatMessages: AIChatMessage[];
  isTyping: boolean;
  aiSearchSuggestions: string[];
  hasUnreadAIChat: boolean; // For Notification Badge (U.S. 10)
}

/**
 * AI Guide & Search Chat Message
 * Extends the base message to include research-specific UI elements
 * like suggested resources or structural changes (U.S. 11).
 */
export interface AIChatMessage extends ChatMessage {
  /** True if the message was sent by the user, false if from the AI. */
  isUser: boolean;

  /** Suggestions the AI provides that can be dragged onto the canvas or clicked. */
  suggestedItems?: {
    type: 'resource' | 'concept' | 'query';
    id: ID;
    label: string;
  }[];

  /** Meta-type to help the UI render different message styles. */
  metaType?: 'suggestion' | 'summary' | 'question';
}
