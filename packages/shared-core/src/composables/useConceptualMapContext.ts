/**
 * @file useConceptualMapContext.ts
 * @description Encapsulates canvas state management and defensive interaction logic for shared-core.
 */

import type { CanvasViewInstance, ConceptualEdge, ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';
import type { ConceptualMapContext } from '@auraflux/shared-core/interfaces/conceptual-map';
import { Position } from '@vue-flow/core';
import { reactive, ref } from 'vue';

export function useConceptualMapContext(): ConceptualMapContext {
  const instance = reactive<CanvasViewInstance>({
    id: '',
    title: '',
    conceptualNodes: new Map<string, ConceptualNode>(),
    conceptualEdges: [],
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
  const pendingPositions = new Map<ID, { x: number; y: number }>();

  const addNode = (node?: Partial<ConceptualNode>): ConceptualNode => {
    const timestamp = Date.now();
    const id = node?.id || `node-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    const newNode: ConceptualNode = {
      ...node,
      id,
      label: node?.label || 'New Concept',
      type: node?.type || 'CONCEPT',
      handles: node?.handles || [
        {
          id: `h-source-${id}`,
          type: 'source',
          position: Position.Right
        },
        {
          id: `h-target-${id}`,
          type: 'target',
          position: Position.Left
        }
      ],
      position: node?.position || {
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
      },
    };
    instance.conceptualNodes.set(id, newNode);
    return newNode;
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
    if (selectedEdgeId.value === edgeId) {
      selectedEdgeId.value = null;
    }
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

  const batchUpdateNodePositions = (nodes: { id: ID; position: { x: number; y: number } }[]) => {
    nodes.forEach(item => {
      updateNode(item.id, { position: item.position });
    });
  };

  const queueNodePosition = (nodeId: ID, position: { x: number; y: number }) => {
    pendingPositions.set(nodeId, position);
  };

  const updateEdge = (edgeId: ID, updatedEdge: ConceptualEdge) => {
    if (!edgeId || !updatedEdge) return;
    // Defensive design: constrain weight between 1 and 5
    const validWeight = Math.max(1, Math.min(5, updatedEdge.weight || 1));
    const normalizedEdge = { ...updatedEdge, id: edgeId, weight: validWeight };

    const index = instance.conceptualEdges.findIndex(e => e.id === edgeId);
    if (index !== -1) {
      instance.conceptualEdges.splice(index, 1, normalizedEdge);
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

  const setGraph = (newGraph: CanvasViewInstance) => {
    Object.assign(instance, newGraph);
  };

  return {
    instance,
    selectedNodeId,
    selectedEdgeId,
    pendingPositions,
    addNode,
    removeNode,
    removeEdge,
    updateNode,
    batchUpdateNodePositions,
    queueNodePosition,
    addEdge,
    updateEdge,
    selectNode,
    selectEdge,
    deselectAllNodes,
    deselectAllEdges,
    deselectAll,
    isNodeSelected,
    isEdgeSelected,
    setGraph,
  };
}
