/**
 * useEdgeInterceptor.ts
 * Controller Module: Intercepts raw connection events to collect semantic metadata.
 * Refactored to utilize Scoped Component Context to eliminate lifecycle leaks and memory staleness.
 */
import { inject } from 'vue';
import type { ConceptualNode, ConceptualEdge } from '@/interfaces/conceptual-map';
import { type Connection, type EdgeUpdateEvent, useVueFlow } from '@vue-flow/core';
import { ConceptualMapContextKey } from '@/constants/injection-keys';

export function useEdgeInterceptor(explicitContext?: any) {
  const context = explicitContext || inject(ConceptualMapContextKey, null);
  if (!context) {
    throw new Error(
      '[Architectural Violation] useEdgeInterceptor must be invoked within the subtree of a <ConceptualMapCanvas>.'
    );
  }

  const { updateEdge } = useVueFlow()

  /**
   * Internal Utility: getEdgeMidpoint
   * Calculates the center point between two nodes to place the interceptor UI.
   * Directly used within startEdgeEdit.
   */
  const calculateMidpoint = (connection: Connection, nodes?: Map<string, ConceptualNode> | null) => {
    // In Vue Flow, connection object provides source and target node info
    // But we need to access the actual node positions from the store or VueFlow instance

    const refNodes = nodes || context.conceptualNodes;

    const sourceNode = refNodes.get(connection.source);
    const targetNode = refNodes.get(connection.target);

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
  const startEdgeEdit = (connection: Connection, nodes?: Map<string, ConceptualNode> | null) => {
    const midpoint = calculateMidpoint(connection, nodes);

    // Prevent immediate graph insertion; open the scoped contextual input form instead
    context.openInterceptor(connection, midpoint);
  };

  /**
   * Phase 2: ASSEMBLE_PAYLOAD & COMMIT_TO_STORE
   * Finalizes the data structure and sends it to the store.
   */
  const confirmRelation = async () => {
    const newEdge: ConceptualEdge = {
      ...context.localEdgeData.value,
    };

    try {
      // Dispatch to store action
      await context.updateConceptualMapEdge(newEdge, context.interceptorAction.value);

      // Clean up
      context.closeInterceptor();
    } catch(error) {
      console.error('[Interceptor Flow Error] Aborted edge persistence:', error);
    }
  };

  const cancelRelation = () => {
    context.closeInterceptor();
  };

  const deleteRelation = () => {
    context.updateConceptualMapEdge(context!.localEdgeData.value, 'delete');
    context.closeInterceptor();
  };

  const updateRelation = async ({ edge, connection }: EdgeUpdateEvent) => {
    updateEdge(edge, connection)

    const updatedEdgeData = {
      ...edge.data,
      id: edge.id,
      status: 'USER_DRAFT',
      source: connection.source,
      sourceHandle: connection.sourceHandle?.replace('source-', '') || '',
      target: connection.target,
      targetHandle: connection.targetHandle?.replace('target-', '') || '',
    }

    const midpoint = calculateMidpoint(connection, null);
    context.openInterceptor(connection, midpoint, updatedEdgeData);
  }

  return {
    context,
    // Actions
    startEdgeEdit,
    confirmRelation,
    cancelRelation,
    deleteRelation,
    updateRelation
  };
}