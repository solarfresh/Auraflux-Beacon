import { ID } from './core';

/**
 * NodeType Definition
 * The 'type' field acts as the discriminator for the Union.
 */
export type NodeType =
  | 'FOCUS'
  | 'RESOURCE'
  | 'CONCEPT'
  | 'INSIGHT'
  | 'QUERY'
  | 'GROUP'
  | 'NAVIGATION';

/**
 * BaseNode Definition
 * Represents the fundamental physical entity in the War Room.
 * Decoupled from Point2D to support nodes existing in the Sidebar (Registry)
 * before being instantiated on a physical canvas coordinate.
 */
interface BaseNode {
  /** Physical Instance ID (Unique across the session) */
  id: ID;

  /** The displayed text label */
  label: string;

  /** * Anti-Hallucination: Health Score (0-10)
   * Drives the Jitter animation. Values < 4 trigger visual alarm.
   */
  groundedness: number;

  /** * Materiality: Grounding state
   * SOLID: Evidence-backed
   * PULSING: Hypothesis / Shadow
   * DIMMED: Inbox / Placeholder
   */
  solidity: 'SOLID' | 'PULSING' | 'DIMMED';

  /** * Persistence: Multi-Canvas Presence
   * Tracks which Canvas IDs this node is currently placed on.
   * If empty, the node resides only in the Sidebar Registry.
   */
  // canvases: ID[];
}

/**
 * 1. FOCUS NODE
 * The North Star of the research, derived from ResearchFocus.finalQuestion.
 * High mass, central gravity.
 */
export interface FocusNode extends BaseNode {
  type: 'FOCUS';
}

/**
 * 2. RESOURCE NODE
 * Linked to a specific evidence item in the knowledge layer.
 * Usually has the highest 'Solidity' once verified.
 */
export interface ResourceNode extends BaseNode {
  type: 'RESOURCE';
  // resourceId: ID;
  // Reference to the original Knowledge Item
  // data?: ResourceItem;
}

/**
 * 3. CONCEPT NODE
 * The core logical bridge. Refers to TopicKeyword but manages its own node life.
 * Directly supports Panel-Canvas synchronization via keywordId.
 */
export interface ConceptNode extends BaseNode {
  type: 'CONCEPT';
  // keywordId: ID;
  // The original semantic seed
  // data: TopicKeyword;
}

/**
 * 4. INSIGHT NODE
 * Synthesis generated from Reflection Logs or AI analysis.
 * Often starts with 'PULSING' solidity until more resources are linked.
 */
export interface InsightNode extends BaseNode {
  type: 'INSIGHT';
  // reflectionId: ID;
  // data: ReflectionLogEntry
}

/**
 * 5. QUERY NODE
 * Represents a research gap or a "need-to-know" compass.
 */
export interface QueryNode extends BaseNode {
  type: 'QUERY';
  // priority: 'High' | 'Low';
}

/**
 * 6. NAVIGATION NODE
 * Portal for space-time transition between different CanvasViews.
 */
export interface NavigationNode extends BaseNode {
  type: 'NAVIGATION';
  // targetCanvasId: ID;
  // targetCanvasName: string;
}

/**
 * 7. GROUP NODE (Container)
 * Defines physical boundaries and categorization on the canvas.
 */
export interface GroupNode extends BaseNode {
  type: 'GROUP';
  // topicScopeId: ID;
  // childNodeIds: ID[];
  // size: RectSize;
  // data: TopicScopeElement;
  // color?: string;
}

/** * Discriminated Union for ConceptualNode
 * This ensures TypeScript knows exactly which fields are available based on 'type'.
 */
export type ConceptualNode =
  | FocusNode
  | ResourceNode
  | ConceptNode
  | InsightNode
  | QueryNode
  | NavigationNode
  | GroupNode;

/**
 * ConceptualEdge: Defining the semantic relationship
 */
export interface ConceptualEdge {
  id: ID;
  source: ID; // ConceptualNode ID
  target: ID; // ConceptualNode ID
  label: string; // e.g., "results in", "opposes", "defines"
  isCrossCanvas?: boolean;
}