import { ID, DateTimeString, ChatMessage } from './core';
import { ConceptualNode, ConceptualEdge } from './conceptual-map';
import { ResourceItem, ResearchFocus } from './knowledge';
import { ReflectionLogEntry } from './workflow';

export type ManagementType = 'final-question' | 'keyword' | 'manual-resource' | 'reflection-log' | 'scope' | null;

interface AdversaryData {
  critique: string;
  conflicts: string[];
}

export interface CanvasView {
  id: string;
  name: string;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface ExplorationState {
  // --- Resource Management ---
  resources: ResourceItem[];

  // --- Conceptual Map Management (Supports Multi-Canvas) ---
  canvasViews: CanvasView[]; // List of all defined canvas views
  activeCanvasViewId: ID; // The currently visible canvas view
  selectedNodeId: ID | null;
  conceptualNodes: Map<string, ConceptualNode>; // Nodes for the active view
  conceptualEdges: ConceptualEdge[]; // Edges for the active view

  // --- AI Interaction & State ---
  isAdversaryVisible: boolean;
  stabilityScore: number;
  adversaryData: AdversaryData;
  chatMessages: AIChatMessage[];
  isTyping: boolean;
  aiSearchSuggestions: string[];
  hasUnreadAIChat: boolean; // For Notification Badge (U.S. 10)

  // --- Reflection & Progress ---
  reflectionLogs: any[]; // Placeholder for reflection entries
  isExplorationSufficient: boolean; // Ready to transition (U.S. footer)
}

export interface SidebarRegistryInfo {
  stabilityScore: number;
  finalQuestion: string;
  nodes: ConceptualNode[];
};

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

/**
 * Manual Resource Input Data
 * Interface for the 'Add Resource' modal when a user manually inputs data.
 */
export interface ManualResourceData {
  /** URL to be scraped/fetched by the backend. */
  url?: string;

  /** Mandatory if 'url' is absent. Allows direct notes or quotes. */
  content?: string;

  /** User-defined title. Might be overwritten by metadata if it's a URL. */
  title?: string;

  /** Keywords or tags manually associated by the user. */
  manualTags?: string[];
}

export interface NodeSummary {
  insight: number;
  query: number;
  resource: number;
  group: number;
}
