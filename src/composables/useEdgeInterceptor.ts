/**
 * useEdgeInterceptor.ts
 * Controller Module: Intercepts raw connection events to collect semantic metadata.
 */
import type { ConceptualNode, ConceptualEdge, EdgeType } from '@/interfaces/conceptual-map';
import { useCanvasStore } from '@/stores/canvas';
import type { Connection } from '@vue-flow/core';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

export function useEdgeInterceptor() {
  const store = useCanvasStore();

  // --- Reactive State ---
  const pendingConnection = ref<Connection | null>(null);
  const interceptorPosition = ref({ x: 0, y: 0 });

  // Local state for the interceptor UI
  const localLabel = ref('');
  const localType = ref<EdgeType>('REF');
  const localEvidence = ref('');
  const localWeight = ref(1.0);

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
    pendingConnection.value = connection;
    interceptorPosition.value = midpoint;

    // Reset local form to defaults
    localLabel.value = '';
    localType.value = 'REF';
    localEvidence.value = '';
    localWeight.value = 1.0;
  };

  /**
   * Phase 2: ASSEMBLE_PAYLOAD & COMMIT_TO_STORE
   * Finalizes the data structure and sends it to the store.
   */
  const confirmCreation = () => {
    if (!pendingConnection.value) return;

    const { source, target, sourceHandle, targetHandle } = pendingConnection.value;

    const newEdge: ConceptualEdge = {
      id: uuidv4(),
      source,
      target,
      sourceHandle: sourceHandle ?? undefined,
      targetHandle: targetHandle ?? undefined,
      type: localType.value,
      label: localLabel.value || undefined,
      evidence: localEvidence.value || undefined,
      weight: localWeight.value,
      // Metadata for tracking
      metadata: {
        createdAt: new Date().toISOString(),
        isManual: true,
      },
    };

    // Dispatch to store action
    store.updateConceptualMapEdge(newEdge, 'create');

    // Clean up
    close();
  };

  return {
    // State
    interceptorPosition,
    localLabel,
    localType,
    localEvidence,
    localWeight,

    // Actions
    startInterception,
    confirmCreation,
  };
}