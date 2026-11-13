import type { AttentionToken, IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import type { Connection, Position } from '@vue-flow/core';
import type { EntityStatus, ID } from './core';

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

export interface Point2D {
  x: number;
  y: number;
}

export interface ConceptualNodeHandle {
  id: ID;
  type: 'source' | 'target';
  position: Position;
  intent?: IntentToken;
  surface?: SurfaceToken;
  attention?: AttentionToken;
  isConnectable?: boolean;
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
  handles?: ConceptualNodeHandle[];
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
  id: ID;
  title: string;
  conceptualNodes: Map<string, ConceptualNode>;
  conceptualEdges: ConceptualEdge[];
  pendingConnection: Connection | null;
  localEdgeData: ConceptualEdge;
  viewport: ViewPort;
  updateNode?: (nodeId: string, updatedNode: ConceptualNode) => void;
}
