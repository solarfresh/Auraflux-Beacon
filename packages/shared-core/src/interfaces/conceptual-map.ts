export type { ConceptualNode, ConceptualEdge, ConceptualGraph, ViewPort, CanvasViewInstance, NodeType, EdgeType } from '@auraflux/design-system/interfaces/conceptual-map';
import type { CanvasViewInstance, ConceptualNode, ConceptualEdge } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';

export interface ConceptualMapContext {
  instance: CanvasViewInstance;
  addNode: (node: ConceptualNode) => void;
  removeNode: (nodeId: ID) => void;
  updateNode: (nodeId: ID, updatedNode: ConceptualNode) => void;
  addEdge: (edge: ConceptualEdge) => void;
}



