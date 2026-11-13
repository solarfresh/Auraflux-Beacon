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
    id: '',
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
  const selectedEdgeId = ref<ID | null>(null);

  const addNode = (node?: Partial<ConceptualNode>) => {
    const timestamp = Date.now();
    const id = node?.id || `node-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    const newNode: ConceptualNode = {
      id,
      label: node?.label || 'New Concept',
      type: node?.type || 'CONCEPT',
      handles: node?.handles || [
        {
          id: `h-source-${id}`,
          type: 'source',
          position: 'right' as any
        },
        {
          id: `h-target-${id}`,
          type: 'target',
          position: 'left' as any
        }
      ],
      position: node?.position || {
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
      },
    };
    instance.conceptualNodes.set(id, newNode);
  };

  const removeNode = (nodeId: ID) => {
    instance.conceptualEdges = instance.conceptualEdges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    instance.conceptualNodes.delete(nodeId);
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null;
    }
  };

  const removeEdge = (edgeId: ID) => {
    if (!edgeId) return;
    const exists = instance.conceptualEdges.some(e => e.id === edgeId);
    if (!exists) return;

    instance.conceptualEdges = instance.conceptualEdges.filter(
      edge => edge.id !== edgeId
    );
    if (selectedEdgeId.value === edgeId) {
      selectedEdgeId.value = null;
    }
  };

  const updateNode = (nodeId: ID, updatedNode: Partial<ConceptualNode>) => {
    if (!nodeId || !updatedNode) return;
    const existing = instance.conceptualNodes.get(nodeId);
    if (!existing) {
      console.warn(`[useConceptualMapContext] Attempted to update non-existent node with id: ${nodeId}`);
      return;
    }
    const merged = {
      ...existing,
      ...updatedNode,
      position: updatedNode.position || existing.position,
    };
    instance.conceptualNodes.set(nodeId, merged);
  };

  const updateEdge = (edgeId: ID, updatedEdge: ConceptualEdge) => {
    if (!edgeId || !updatedEdge) return;
    // Defensive design: constrain weight between 1 and 5
    const validWeight = Math.max(1, Math.min(5, updatedEdge.weight || 1));
    const normalizedEdge = { ...updatedEdge, weight: validWeight };

    const index = instance.conceptualEdges.findIndex(e => e.id === edgeId);
    if (index !== -1) {
      instance.conceptualEdges[index] = normalizedEdge;
    }
  };

  const addEdge = (edge: ConceptualEdge) => {
    if (!edge || !edge.id) return;
    instance.conceptualEdges.push(edge);
  };

  const selectNode = (id: ID) => {
    selectedNodeId.value = id;
    selectedEdgeId.value = null;
  };

  const selectEdge = (id: ID) => {
    selectedEdgeId.value = id;
    selectedNodeId.value = null;
  };

  const deselectAllNodes = () => {
    selectedNodeId.value = null;
  };

  const deselectAllEdges = () => {
    selectedEdgeId.value = null;
  };

  const deselectAll = () => {
    selectedNodeId.value = null;
    selectedEdgeId.value = null;
  };

  const isNodeSelected = (nodeId: ID) => {
    return selectedNodeId.value === nodeId;
  };

  const isEdgeSelected = (edgeId: ID) => {
    return selectedEdgeId.value === edgeId;
  };

  return {
    instance,
    selectedNodeId,
    selectedEdgeId,
    addNode,
    removeNode,
    removeEdge,
    updateNode,
    addEdge,
    updateEdge,
    selectNode,
    selectEdge,
    deselectAllNodes,
    deselectAllEdges,
    deselectAll,
    isNodeSelected,
    isEdgeSelected,
  };
}
