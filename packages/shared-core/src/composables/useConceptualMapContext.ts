/**
 * @file useConceptualMapContext.ts
 * @description Encapsulates canvas state management and defensive interaction logic for shared-core.
 */

import { reactive } from 'vue';
import type { ConceptualNode, ConceptualEdge, CanvasViewInstance } from '@auraflux/design-system/interfaces/conceptual-map';

export function useConceptualMapContext() {
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

  const addNode = (node: ConceptualNode) => {
    if (!node || !node.id) return;
    instance.conceptualNodes.set(node.id, node);
  };

  const removeNode = (nodeId: string) => {
    instance.conceptualNodes.delete(nodeId);
  };

  const addEdge = (edge: ConceptualEdge) => {
    if (!edge || !edge.id) return;
    instance.conceptualEdges.push(edge);
  };

  return {
    instance,
    addNode,
    removeNode,
    addEdge,
  };
}
