/**
 * @file useNodeInterceptor.ts
 * @description Controller Module: Intercepts node modification events.
 * Extracted from the component layer to ensure architectural parity with useEdgeInterceptor.
 */
import { inject } from 'vue';
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import { ConceptualMapContextKey } from '@/constants/injection-keys';

export function useNodeInterceptor(explicitContext?: any) {
  const context = explicitContext || inject(ConceptualMapContextKey, null);

  if (!context) {
    throw new Error(
      '[Architectural Violation] useNodeInterceptor must be invoked within the subtree of a <ConceptualMapCanvas>.'
    );
  }

  /**
   * Phase 1: INITIATE_NODE_EDIT
   * Called by @node-double-click or custom edit button on the canvas.
   */
  const startNodeEdit = (nodeId: string) => {
    const node = context.conceptualNodes.get(nodeId);
    if (node) {
      context.openNodeEditor(nodeId, node);
    }
  };

  /**
   * Phase 2: COMMIT_MUTATION_TO_STORE
   * Aggregates the modified cache from localNodeData and flashes it back to persistent layout memory.
   */
  const confirmNodeEdit = async () => {
    const nodeId = context.editingNodeId.value;
    const originalNode = context.conceptualNodes.get(nodeId);

    if (!nodeId || !originalNode) return;

    const updatedNode: ConceptualNode = {
      ...originalNode,
      label: context.localNodeData.value.label,
      userNotes: context.localNodeData.value.userNotes
    };

    try {
      // Dispatch persistent edit action to backend & global store through base context
      await context.updateConceptualMapNode(updatedNode, 'edit');

      // Clean up UI states
      context.closeNodeEditor();
    } catch (error) {
      console.error('[Node Interceptor Error] Failed to update node metadata:', error);
    }
  };

  const cancelNodeEdit = () => {
    context.closeNodeEditor();
  };

  return {
    context,
    // Actions exposed to UI Molecule
    startNodeEdit,
    confirmNodeEdit,
    cancelNodeEdit
  };
}