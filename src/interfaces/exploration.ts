
import { ReflectionLogEntry } from '@/interfaces/workflow';

// The collected resource (e.g., article, website, PDF)
export interface ResourceItem {
  id: string;
  title: string;
  url: string;
  summary: string; // AI-generated summary (AI Agent Integration)
  source_type: 'WEB' | 'PDF' | 'ACADEMIC';
  collected_at: string;
  keywords: string[]; // Keywords derived from content
  user_notes: string; // User's quick notes on the resource
  raw_content: string;
  relevance_score: number; // e.g., 1 to 5, user/AI assessed
}

// Data for the Conceptual Map (Nodes and Edges)
export interface ConceptualNode {
  id: string;
  label: string;
  type: 'CONCEPT' | 'RESOURCE' | 'KEYWORD';
  resource_id?: string; // Link to ResourceItem if type is RESOURCE
  user_notes: string;
  x: number;
  y: number;
}

export interface ConceptualEdge {
  id: string;
  source: string; // ConceptualNode id
  target: string; // ConceptualNode id
  label: string; // Relationship description
}

export interface ExplorationData {
  resources: ResourceItem[];
  conceptual_nodes: ConceptualNode[];
  conceptual_edges: ConceptualEdge[];
  exploration_status_log: ReflectionLogEntry[]; // Record of progress/challenges
}

/**
 * Interface for data received from the ResourceAddItemModal when a user manually adds a resource.
 * This data is used to create a new ResourceItem in the Exploration Store.
 */
export interface ManualResourceData {
  /**
   * Optional URL provided by the user. If present, the backend should attempt to fetch its content.
   */
  url?: string;

  /**
   * Optional raw text content provided by the user (e.g., a note, a quote, or a short summary).
   * This field is mandatory if 'url' is not provided.
   */
  content?: string;

  /**
   * Optional title provided by the user. If a URL is provided, the backend might overwrite this.
   */
  title?: string;

  /**
   * Optional manual tags or keywords the user associates with this resource.
   */
  manualTags?: string[];
}

/**
 * Represents a distinct conceptual map view (a 'mini-map') focusing on a specific topic or sub-problem.
 * This supports the Multi-Canvas Management strategy (U.S. 2).
 */
export interface CanvasView {
  /** Unique identifier for the canvas view. */
  id: string;

  /** User-friendly name of the canvas view (e.g., "Ethical Risks of AI"). */
  name: string;

  /** Timestamp when the view was created. */
  createdAt: Date;

  /** Optional link to a parent view or the main view, supporting hierarchy (U.S. 3). */
  parentId?: string;

  // Note: Nodes and Edges for this view are stored globally in the store but filtered by activeCanvasViewId.
}


/**
 * Summarizes the count of key structural and content nodes in the active canvas view.
 * Used by the CanvasStructureSidebar for the Node Index/Filter (U.S. 12).
 */
export interface NodeSummary {
  /** Count of Insight Nodes (derived from Reflection Log). */
  Insight: number;

  /** Count of Query Nodes (representing unresolved questions). */
  Query: number;

  /** Count of Resource Nodes (links to raw data items). */
  Resource: number;

  /** Count of Group Nodes (containers for categorization). */
  Group: number;
}


/**
 * Represents a single message within the AI Guide & Search chat interface (Right Panel).
 * Supports both user input and AI responses, including structured content.
 */
export interface AIChatMessage {
  /** Unique message identifier. */
  id: string;

  role: 'user' | 'system';

  /** The text content of the message. */
  content: string;

  name: string;

  /** True if the message was sent by the user, false if from the AI agent. */
  isUser: boolean;

  /** ISO string timestamp of when the message was sent/received. */
  timestamp: string;

  sequence_number: number;

  /** Optional: Used by the AI to suggest specific ResourceItems or concepts within the chat bubble (U.S. 11). */
  suggestedItems?: { type: 'resource' | 'concept'; id: string; label: string }[];

  /** Optional: Metadata indicating the message's function (e.g., a structural suggestion). */
  metaType?: 'suggestion' | 'summary' | 'question';
}

export interface CurrentFocusData {
  finalQuestion: string;

  topicKeywords: string[];

  topicScope: string;

  latestReflection: string;

  feasibilityStatus: string;

  stabilityScore: number;

  resourceSuggestion?: string;
}


export type ManagementType =
    | 'final-question'
    | 'keyword'
    | 'scope'
    | 'reflection-log';

