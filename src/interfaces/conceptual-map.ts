import { ID, Point2D, RectSize } from './core';
import { TopicKeyword, ResourceItem } from './knowledge';

/**
 * NodeType Definition
 * The 'type' field acts as the discriminator for the Union.
 */
export type NodeType =
  | 'Focus'
  | 'Resource'
  | 'Concept'
  | 'Insight'
  | 'Query'
  | 'Group'
  | 'Navigation';

/** * Base Node Interface
 * Common spatial and UI properties for all canvas elements.
 */
interface BaseNode extends Point2D {
  id: ID;
  label: string;
  isLocked?: boolean;
}

/** 1. Focus Node: Directly mapped from ResearchFocus.finalQuestion */
export interface FocusNode extends BaseNode {
  type: 'FOCUS';
}

/** 2. Resource Node: Linked to a ResourceItem from Knowledge Layer */
export interface ResourceNode extends BaseNode {
  type: 'RESOURCE';
  resourceId: ID; // Link to ResourceItem
  data?: ResourceItem; // Optional cached data for quick rendering
}

/** 3. Concept Node: Directly uses TopicKeyword structure */
export interface ConceptNode extends BaseNode {
  type: 'CONCEPT';
  keywordId: ID; // Link to TopicKeyword
  data?: TopicKeyword; // This is the key to Panel-Canvas synchronization
}

/** 4. Insight Node: Synthesis from Reflection Logs */
export interface InsightNode extends BaseNode {
  type: 'INSIGHT';
  reflectionId: ID;
}

/** 5. Query Node: Representing research gaps */
export interface QueryNode extends BaseNode {
  type: 'QUERY';
  priority: 'High' | 'Low';
}

/** 6. Navigation Node: Portal to other CanvasViews (U.S. 3) */
export interface NavigationNode extends BaseNode {
  type: 'NAVIGATION';
  targetCanvasId: ID;
  targetCanvasName: string;
}

/** 7. Group Node: Container for categorization (U.S. 7) */
export interface GroupNode extends BaseNode, RectSize {
  type: 'GROUP';
  childNodeIds: ID[];
  color?: string;
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