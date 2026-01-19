import type { ConceptualNode } from '@/interfaces/conceptual-map';
import type { ID } from '@/interfaces/core';
import { getNodeGroundednessContext } from '@/logic/workflow';
import { useExplorationStore } from '@/stores/exploration';
import { computed } from 'vue';

/**
 * useRegistry
 * The physicalized logic controller that bridges the ExplorationStore
 * with the Sidebar and Canvas.
 */
export function useRegistry() {
  const store = useExplorationStore();

  /**
   * GLOBAL REGISTRY ACCESS
   * Ensures the Sidebar has access to the full manifest of nodes.
   */
  const registryNodes = computed(() => store.conceptualNodes);

  /**
   * INBOX VIEW
   * Nodes that are not yet placed on any canvas (DIMMED state).
   */
  const inboxNodes = computed(() =>
    store.conceptualNodes.filter((node: ConceptualNode) => node.canvases.length === 0)
  );

  /**
   * ACTIVE CANVAS VIEW
   * Filtered nodes based on the currently active canvas ID.
   */
  const activeCanvasNodes = computed(() => {
    return store.conceptualNodes.filter((node: ConceptualNode) =>
      node.canvases.includes(store.activeCanvasViewId)
    );
  });

  /**
   * MOUNT TO CANVAS
   * Transition logic from "Semantic Seed" to "Physical Instance".
   */
  const mountToCanvas = (nodeId: ID, canvasId: ID, position?: { x: number, y: number }) => {
    const node = store.conceptualNodes.find(n => n.id === nodeId);
    if (!node) return;

    // 1. Update presence array to support Multi-Canvas Badges
    if (!node.canvases.includes(canvasId)) {
      node.canvases.push(canvasId);
    }

    // 2. Physical Evolution: Transition from DIMMED to PULSING (Hypothesis)
    if (node.solidity === 'DIMMED') {
      node.solidity = 'PULSING';
    }

    // 3. Spatial Localization: Assign physical coordinates
    if (position) {
      node.position = position;
    }
  };

  /**
   * UNMOUNT FROM CANVAS
   * Handles the removal from a specific space without deleting the semantic identity.
   */
  const unmountFromCanvas = (nodeId: ID, canvasId: ID) => {
    const node = store.conceptualNodes.find(n => n.id === nodeId);
    if (!node) return;

    node.canvases = node.canvases.filter(id => id !== canvasId);

    // 4. Persistence Guard: Return to DIMMED if no longer on any canvas
    if (node.canvases.length === 0) {
      node.solidity = 'DIMMED';
    }
  };

  /**
   * STABILITY CONTROLLER (Anti-Hallucination)
   * Linked to the Jitter animation in the SidebarNodeItem.
   */
  const updateGroundedness = (nodeId: ID, delta: number) => {
    const node = store.conceptualNodes.find(n => n.id === nodeId);
    if (!node) return;

    // Constrain stability between 0 and 100
    node.groundedness = Math.max(0, Math.min(10, node.groundedness + delta));

    // 5. Solidity Light Logic: Automated transition based on stability
    node.solidity = getNodeGroundednessContext(node.groundedness).solidity;
  };

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
    activeCanvasId: computed(() => store.activeCanvasViewId),
    mountToCanvas,
    unmountFromCanvas,
    updateGroundedness,
    selectNode
  };
}