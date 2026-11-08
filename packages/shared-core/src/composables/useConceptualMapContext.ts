/**
 * @file useConceptualMapContext.ts
 * @description Encapsulates canvas state management and defensive interaction logic for shared-core.
 */

import type { CanvasViewInstance, ConceptualEdge, ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { reactive, ref } from 'vue';
import type { ConceptualMapContext } from '../interfaces/conceptual-map';

export function useConceptualMapContext(): ConceptualMapContext {
  const instance = reactive<CanvasViewInstance>({
    conceptualNodes: new Map<string, ConceptualNode>(),
    conceptualEdges: [],
    isDragging: false,
    isDragOver: false,
    draggedNode: null,
    isInterceptionActive: false,
    interceptorAction: '',
    interceptorPosition: { x: 0, y: 0 },
    pendingConnection: null,
    localEdgeData: {
      id: '',
      source: '',
      target: '',
      type: 'LINK',
      weight: 1,
    },
    viewport: { x: 0, y: 0, zoom: 1 },
  });

  const selectedNodeId = ref<ID | null>(null);

  const addNode = (node: ConceptualNode) => {
    if (!node || !node.id) return;
    instance.conceptualNodes.set(node.id, node);
  };

  const removeNode = (nodeId: ID) => {
    instance.conceptualNodes.delete(nodeId);
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null;
    }
  };

  const updateNode = (nodeId: ID, updatedNode: ConceptualNode) => {
    if (!nodeId || !updatedNode) return;
    if (instance.conceptualNodes.has(nodeId)) {
      instance.conceptualNodes.set(nodeId, updatedNode);
    }
  };

  const addEdge = (edge: ConceptualEdge) => {
    if (!edge || !edge.id) return;
    instance.conceptualEdges.push(edge);
  };

  const selectNode = (id: ID) => {
    selectedNodeId.value = id;
  };

  const deselectAllNodes = () => {
    selectedNodeId.value = null;
  };

  const isSelected = (nodeId: ID) => {
    return selectedNodeId.value === nodeId;
  };

  return {
    instance,
    selectedNodeId,
    addNode,
    removeNode,
    updateNode,
    addEdge,
    selectNode,
    deselectAllNodes,
    isSelected,
  };
}
