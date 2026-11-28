import type { CanvasViewInstance, ConceptualEdge, ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';
import type { Ref } from 'vue';
export type { CanvasViewInstance, ConceptualEdge, ConceptualGraph, ConceptualNode, EdgeType, NodeType, ViewPort } from '@auraflux/design-system/interfaces/conceptual-map';

export interface ConceptualMapContext {
  instance: CanvasViewInstance;
  selectedNodeId: Ref<ID | null>;
  selectedEdgeId: Ref<ID | null>;
  pendingPositions: Map<ID, { x: number; y: number }>;
  addNode: (nodeData?: Partial<ConceptualNode>) => ConceptualNode;
  removeNode: (nodeId: ID) => void;
  removeEdge: (edgeId: ID) => void;
  updateNode: (nodeId: ID, updatedNode: Partial<ConceptualNode>) => void;
  batchUpdateNodePositions: (nodes: { id: ID; position: { x: number; y: number } }[]) => void;
  queueNodePosition: (nodeId: ID, position: { x: number; y: number }) => void;
  addEdge: (edge: ConceptualEdge) => void;
  updateEdge: (edgeId: ID, updatedEdge: ConceptualEdge) => void;
  selectNode: (id: ID) => void;
  selectEdge: (id: ID) => void;
  deselectAllNodes: () => void;
  deselectAllEdges: () => void;
  deselectAll: () => void;
  isNodeSelected: (nodeId: ID) => boolean;
  isEdgeSelected: (edgeId: ID) => boolean;
  setGraph: (newGraph: CanvasViewInstance) => void;
}



