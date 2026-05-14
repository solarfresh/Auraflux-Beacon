/**
 * useEdgeInterceptor.ts
 * Controller Module: Intercepts raw connection events to collect semantic metadata.
 */
import type { ConceptualNode, ConceptualEdge, EdgeType } from '@/interfaces/conceptual-map';
import { useCanvasStore } from '@/stores/canvas';
import type { Connection } from '@vue-flow/core';

export function useEdgeInterceptor() {
  const store = useCanvasStore();

  /**
   * Internal Utility: getEdgeMidpoint
   * Calculates the center point between two nodes to place the interceptor UI.
   * Directly used within startInterception.
   */
  const calculateMidpoint = (connection: Connection, nodes: Map<string, ConceptualNode>) => {
    // In Vue Flow, connection object provides source and target node info
    // But we need to access the actual node positions from the store or VueFlow instance
    const sourceNode = nodes.get(connection.source);
    const targetNode = nodes.get(connection.target);

    if (!sourceNode?.position || !targetNode?.position) {
      return { x: 0, y: 0 };
    }

    return {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    };
  };

  /**
   * Phase 1: INITIATE_CONNECTION
   * Called by @connect event in the canvas.
   */
  const startInterception = (connection: Connection, nodes: Map<string, ConceptualNode>) => {
    const midpoint = calculateMidpoint(connection, nodes);

    // Prevent immediate creation
    store.setInterceptionActivity(true);
    store.openInterceptor(connection, midpoint);
  };

  /**
   * Phase 2: ASSEMBLE_PAYLOAD & COMMIT_TO_STORE
   * Finalizes the data structure and sends it to the store.
   */
  const confirmRelation = () => {
    if (!store.current?.pendingConnection && store.current?.interceptorAction == 'create') return;

    const newEdge: ConceptualEdge = {
      ...store.current?.localEdgeData!,
    };

    // Dispatch to store action
    if (store.current?.interceptorAction == 'create') {
      store.updateConceptualMapEdge(newEdge, 'create');
    } else if (store.current?.interceptorAction == 'update') {
      store.updateConceptualMapEdge(newEdge, 'update');
    }

    // Clean up
    store.closeInterceptor();
  };

  return {
    // Actions
    startInterception,
    confirmRelation,
  };
}