<template>
  <div class="h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
    <ThreePaneWorkspaceTemplate>
      <template #left-sidebar>
        <DiscoverySidebar
          @select-node="handleNodeSelect"
          @request-teleport="handleTeleport"
        />
      </template>

      <template #main-content>
        <main class="relative h-full w-full">
          <ConceptualMapCanvas
            ref="canvas"
            :project-id="currentProjectId"
            :canvas-id="explorationStore.activeCanvasId"
            :registry-count="explorationStore.sidebarNodes.size"
          />
        </main>
      </template>

      <template #right-panel>
        <StrategicDiscoveryPanel />
      </template>
    </ThreePaneWorkspaceTemplate>
  </div>
</template>

<script setup lang="ts">
/**
 * ExplorationPage.vue
 * - Root template for the "War Room" phase.
 * - Handles top-level layout coordination and Store-to-Canvas event mapping.
 */
import { useProjectExploration } from '@/composables/useProjectExploration';
import { useRegistry } from '@/composables/useRegistry';
import { useExplorationStore } from '@/stores/exploration';
import { onMounted, ref } from 'vue';

// Atoms & Layout Components
import ThreePaneWorkspaceTemplate from '@/components/templates/ThreePaneWorkspaceTemplate.vue';

// Organisms
import ConceptualMapCanvas from '@/components/organisms/domain/canvases/ConceptualMapCanvas.vue';
import StrategicDiscoveryPanel from '@/components/organisms/panels/StrategicDiscoveryPanel.vue';
import DiscoverySidebar from '@/components/organisms/sidebars/DiscoverySidebar.vue';

// Stores
const explorationStore = useExplorationStore();
const { currentProjectId, loadExplorationData } = useProjectExploration();

const {
  selectNode
} = useRegistry();

// Initial Data Fetching
onMounted(async () => {
  await loadExplorationData();
});

/**
 * Synchronizes the selection across the Sidebar, Canvas, and Adversary Panel.
 */
const handleNodeSelect = (nodeId: string | null) => {
  // Update the centralized selected ID in the Store via useRegistry
  selectNode(nodeId);

  // If a node is selected and its stability is critical,
  // we trigger the Adversary Panel to force reflection.
  // const node = registryNodes.value.find(n => n.id === nodeId);
  // if (node && node.groundedness < 4) {
    // explorationStore.isAdversaryVisible = true;
    // Potentially trigger a specific "Critical Inquiry" mode in the Adversary Data
    // explorationStore.adversaryData.focusNodeId = nodeId;
  // }
};

/**
 * Manages cross-canvas navigation when a presence badge is clicked.
 */
const handleTeleport = async (data: { nodeId: string; canvasId: string }) => {
  const { nodeId, canvasId } = data;

  // Step 1: Switch the active canvas view if it's different
  if (explorationStore.activeCanvasId !== canvasId) {
    explorationStore.activeCanvasId = canvasId;
  }

  // Step 2: Set the node as selected for visual consistency
  handleNodeSelect(nodeId);

  // Step 3: Emit or trigger a Camera Focus event
  // We use nextTick to ensure the Canvas component has re-rendered for the new canvasId
  // await nextTick();

  // Dispatch a custom event or use a template ref to call the Canvas's auto-focus method
  // This ensures the user is "teleported" directly to the node's spatial coordinates.
  // eventBus.emit('canvas:focus-node', { nodeId });
};

// ... Additional lifecycle logic and data getters
</script>