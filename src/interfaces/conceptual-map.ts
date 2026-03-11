import { EntityStatus, ID, Point2D } from './core';

/**
 * NodeType Definition
 * The 'type' field acts as the discriminator for the Union.
 *
 * 1. FOCUS NODE
 * The North Star of the research, derived from ResearchFocus.finalQuestion.
 * High mass, central gravity.
 * 2. RESOURCE NODE
 * Linked to a specific evidence item in the knowledge layer.
 * Usually has the highest 'Solidity' once verified.
 * 3. CONCEPT NODE
 * The core logical bridge. Refers to TopicKeyword but manages its own node life.
 * Directly supports Panel-Canvas synchronization via keywordId.
 * 4. INSIGHT NODE
 * Synthesis generated from Reflection Logs or AI analysis.
 * Often starts with 'PULSING' solidity until more resources are linked.
 * 5. QUERY NODE
 * Represents a research gap or a "need-to-know" compass.
 * 6. NAVIGATION NODE
 * Portal for space-time transition between different CanvasViews.
 * 7. GROUP NODE (Container)
 * Defines physical boundaries and categorization on the canvas.
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
export interface ConceptualNode {
  /** Physical Instance ID (Unique across the session) */
  id: ID;

  /** The displayed text label */
  label: string;

  /** Type: Determines the node's role and visual representation. */
  type: NodeType;

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

  user_notes?: string;

  status?: EntityStatus;

  position?: Point2D;

  /** * Persistence: Multi-Canvas Presence
   * Tracks which Canvas IDs this node is currently placed on.
   * If empty, the node resides only in the Sidebar Registry.
   */
  // canvases: ID[];
}

/**
 * ConceptualEdge: Defining the semantic relationship
 */
export interface ConceptualEdge {
  id: ID;
  source: ID; // ConceptualNode ID
  target: ID; // ConceptualNode ID
  // label: string; // e.g., "results in", "opposes", "defines"
  weight: number;
}

export interface ConceptualGraph {
  nodes: Map<string, ConceptualNode>;
  edges: ConceptualEdge[];
}
