import type { Ref } from 'vue';
export type { ConceptualNode, ConceptualEdge, ConceptualGraph, ViewPort, CanvasViewInstance, NodeType, EdgeType } from '@auraflux/design-system/interfaces/conceptual-map';
import type { CanvasViewInstance, ConceptualNode, ConceptualEdge } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';

export interface ConceptualMapContext {
  instance: CanvasViewInstance;
  selectedNodeId: Ref<ID | null>;
  addNode: (node: ConceptualNode) => void;
  removeNode: (nodeId: ID) => void;
  updateNode: (nodeId: ID, updatedNode: ConceptualNode) => void;
  addEdge: (edge: ConceptualEdge) => void;
  selectNode: (id: ID) => void;
  deselectAllNodes: () => void;
  isSelected: (nodeId: ID) => boolean;
}



