import type { EntityStatus, ID, Point2D } from './core';
import type { Connection } from '@vue-flow/core';

/**
 * Unified Node Type for Auraflux.
 * Categorized by Empirical Core and Canvas Functional roles.
 */
export type NodeType =
  // --- Empirical Core ---
  | 'EVENT'     // Objective data points
  | 'OUTCOME'   // Final results / North Star
  | 'BOUNDARY'  // Constraints / Scope
  | 'ENTITY'    // Subjects / Tools
  // --- Canvas Functional ---
  | 'FOCUS'     // Focal point of view
  | 'RESOURCE'  // External evidence items
  | 'CONCEPT'   // Logical bridges
  | 'INSIGHT'   // AI/Human Synthesis
  | 'QUERY'     // Research gaps
  | 'NAVIGATION'// Portal for View transitions
  | 'GROUP';    // Container boundaries

/**
 * Unified Edge Type for Auraflux.
 */
export type EdgeType =
  // --- Empirical Core ---
  | 'VALIDATES'  // Strong support
  | 'CONSTRAINS' // Restriction
  | 'TRIGGERS'   // Causal/Sequential
  // --- Functional ---
  | 'REF'        // Weak association
  | 'LINK';       // Structural connection

/**
 * ConceptualNode: Single Source of Truth for Canvas Nodes
 */
export interface ConceptualNode {
  // --- Identity & UI ---
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

  // --- Knowledge Content (Empirical Layer) ---
  content?: string;      // Detailed snippet
  sourceRef?: string;   // Grounding reference

  // --- AI Reasoning (Logic Layer) ---
  rationale?: string;    // AI's justification
  anchorId?: ID;        // Parent node for growth tracking

  // --- Spatial Information (Layout Layer) ---
  position?: Point2D;

  // NOTE: Pre-existing UI states (Optional depending on frontend needs)
  userNotes?: string;   // Maps to content if needed
  status?: EntityStatus;
}

/**
 * ConceptualEdge: Single Source of Truth for Relationships
 */
export interface ConceptualEdge {
  id: ID;
  source: ID;
  target: ID;

  // --- Metadata & Identification ---
  label?: string;
  type: EdgeType; // Default: 'REF'

  // --- Knowledge & Grounding (Empirical Layer) ---
  /** Logical justification for this link (Crucial for Agentic Audit) */
  evidence?: string;
  /** Strength of the relationship (Default: 1.0) */
  weight: number;

  // --- AI Reasoning & Metadata (Logic Layer) ---
  rationale?: string;
  /** Bucket for scenario-specific data (timestamps, confidence scores, etc.) */
  metadata?: Record<string, any>;

  // --- Spatial Information (Layout Layer) ---
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface ConceptualGraph {
  nodes: Map<string, ConceptualNode>;
  edges: ConceptualEdge[];
}

export interface ViewPort {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasViewInstance {
  conceptualNodes: Map<string, ConceptualNode>; // Nodes for the active view
  conceptualEdges: ConceptualEdge[]; // Edges for the active view

  isDragging: boolean;
  isDragOver: boolean;
  draggedNode: any | null;

  isInterceptionActive: boolean;
  interceptorAction: string;
  interceptorPosition: Point2D;
  pendingConnection: Connection | null;

  localEdgeData: ConceptualEdge;
  viewport: ViewPort;
}
