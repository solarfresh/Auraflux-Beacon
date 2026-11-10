import type { Ref } from 'vue';
export type { ConceptualNode, ConceptualEdge, ConceptualGraph, ViewPort, CanvasViewInstance, NodeType, EdgeType } from '@auraflux/design-system/interfaces/conceptual-map';
import type { CanvasViewInstance, ConceptualNode, ConceptualEdge } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';

export interface ConceptualMapContext {
  instance: CanvasViewInstance;
  selectedNodeId: Ref<ID | null>;
  selectedEdgeId: Ref<ID | null>;
  addNode: (nodeData?: Partial<ConceptualNode>) => void;
  removeNode: (nodeId: ID) => void;
  updateNode: (nodeId: ID, updatedNode: ConceptualNode) => void;
  addEdge: (edge: ConceptualEdge) => void;
  updateEdge: (edgeId: ID, updatedEdge: ConceptualEdge) => void;
  selectNode: (id: ID) => void;
  selectEdge: (id: ID) => void;
  deselectAllNodes: () => void;
  deselectAllEdges: () => void;
  deselectAll: () => void;
  isNodeSelected: (nodeId: ID) => boolean;
  isEdgeSelected: (edgeId: ID) => boolean;
}



