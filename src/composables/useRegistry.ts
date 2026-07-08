import type { ID } from '@/interfaces/core';
import { useCanvasStore } from '@/stores/canvas';
import { useExplorationStore } from '@/stores/exploration';
import { computed } from 'vue';

/**
 * useRegistry
 * The physicalized logic controller that bridges the ExplorationStore
 * with the Sidebar and Canvas.
 */
export function useRegistry() {
  const canvasStore = useCanvasStore();
  const store = useExplorationStore();

  /**
   * GLOBAL REGISTRY ACCESS
   * Ensures the Sidebar has access to the full manifest of nodes.
   */
  const registryNodes = computed(() => {
    return Array.from(store.sidebarNodes.entries()).map(([id, node]) => {
      return node
    })
  });

  /**
   * INBOX VIEW
   * Nodes that are not yet placed on any canvas (DIMMED state).
   */
  const inboxNodes = computed(() => {
    const currentCanvas = canvasStore.getGraphCache(store.activeCanvasId);
    const sidebarNodesArray = Array.from(store.sidebarNodes.values());

    if (!currentCanvas?.nodes) {
      return sidebarNodesArray;
    }

    if (typeof currentCanvas.nodes.has === 'function') {
      return sidebarNodesArray.filter(node => !currentCanvas.nodes.has(node.id));
    }

    return sidebarNodesArray.filter(node => !(node.id in currentCanvas.nodes));
  });

  /**
   * ACTIVE CANVAS VIEW
   * Filtered nodes based on the currently active canvas ID.
   */
  const activeCanvasNodes = computed(() => {
    // return store.conceptualNodes.filter((node: ConceptualNode) =>
    //   node.canvases.includes(store.activeCanvasViewId)
    // );
    return []
  });

  /**
   * SELECTION SYNC
   * Centralized ID tracking for Sidebar and Panel highlighting.
   */
  const selectNode = (nodeId: ID | null) => {
    store.selectedNodeId = nodeId;
  };

  return {
    registryNodes,
    inboxNodes,
    activeCanvasNodes,
    selectedNodeId: computed(() => store.selectedNodeId),
    activeCanvasId: computed(() => store.activeCanvasId),
    selectNode
  };
}