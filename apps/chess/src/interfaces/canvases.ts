export { ConceptualNode, ConceptualEdge } from '@auraflux/design-system/interfaces/conceptual-map';
import type { NodeType, Point2D, ConceptualNode, ConceptualEdge } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';

export interface CreateNodeRequest {
  label: string;
  type: NodeType;
  position: Point2D;
  content?: string;
}

export interface CreateEdgeRequest {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface CanvasGraphResponse {
  id: ID;
  title: string;
  nodes: ConceptualNode[];
  edges: ConceptualEdge[];
}
