import type { EntityStatus, ID, Point2D } from './core';
import type { Connection } from '@vue-flow/core';

export type NodeType =
  | 'EVENT'
  | 'OUTCOME'
  | 'BOUNDARY'
  | 'ENTITY'
  | 'FOCUS'
  | 'RESOURCE'
  | 'CONCEPT'
  | 'INSIGHT'
  | 'QUERY'
  | 'NAVIGATION'
  | 'GROUP';

export type EdgeType =
  | 'VALIDATES'
  | 'CONSTRAINS'
  | 'TRIGGERS'
  | 'REF'
  | 'LINK';

export type RefType = 'LINK' | 'DOCUMENT' | 'NODE';

export interface SourceReference {
  name: string;
  type: RefType;
}

export interface ConceptualNode {
  id: ID;
  label: string;
  type: NodeType;
  content?: string;
  sourceRef?: ConceptualNode[];
  rationale?: string;
  position?: Point2D;
  status?: EntityStatus;
}

export interface ConceptualEdge {
  id: ID;
  source: ID;
  target: ID;
  label?: string;
  type: EdgeType;
  status?: EntityStatus;
  evidence?: string;
  weight: number;
  rationale?: string;
  metadata?: Record<string, any>;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface ConceptualGraph {
  canvasId: ID;
  nodes: Map<string, ConceptualNode>;
  edges: ConceptualEdge[];
}

export interface ViewPort {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasViewInstance {
  conceptualNodes: Map<string, ConceptualNode>;
  conceptualEdges: ConceptualEdge[];
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
