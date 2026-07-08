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
            :canvas-id="projectStore.activeCanvasId"
            :registry-count="projectStore.conceptualNodes.size"
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
import type { ID } from '@/interfaces/core';
import { useProjectStore } from '@/stores/project';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import ConceptualMapCanvas from '@/components/organisms/domain/canvases/ConceptualMapCanvas.vue';
import StrategicDiscoveryPanel from '@/components/organisms/panels/StrategicDiscoveryPanel.vue';
import DiscoverySidebar from '@/components/organisms/sidebars/DiscoverySidebar.vue';
import ThreePaneWorkspaceTemplate from '@/components/templates/ThreePaneWorkspaceTemplate.vue';

// Stores
const projectStore = useProjectStore();
const route = useRoute();

const currentProjectId = computed((): ID => {
  return route.params.id as ID || projectStore.currentProjectId || '';
});

// Initial Data Fetching
onMounted(async () => {
  // Fetch initial state or resume persisted session when the page loads
  if (projectStore.currentProjectId === null) {
    projectStore.setCurrentProjectId(route.params.id as ID);
  }

  if (projectStore.currentStage !== 'EXPLORATION') {
    projectStore.updateProjectDetail({currentStage: 'EXPLORATION'})
  }

  await projectStore.getMessages();
  await projectStore.loadExplorationPhaseData();
  await projectStore.loadProjectDetail();
  await projectStore.loadConceptualNodes();
});

/**
 * Synchronizes the selection across the Sidebar, Canvas, and Adversary Panel.
 */
const handleNodeSelect = (nodeId: string | null) => {
};

/**
 * Manages cross-canvas navigation when a presence badge is clicked.
 */
const handleTeleport = async (data: { nodeId: string; canvasId: string }) => {
};

// ... Additional lifecycle logic and data getters
</script>