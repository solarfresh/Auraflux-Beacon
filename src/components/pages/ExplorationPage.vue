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
            :nodes="Array.from(explorationStore.conceptualNodes.values())"
            :edges="explorationStore.conceptualEdges"
            :health-scores="explorationStore.stabilityScore"
            :active-view-id="explorationStore.activeCanvasId"
            @node-update="handleNodeUpdate"
            @edge-update="handleEdgeUpdate"
            @drop-resource="handleDropResource"
          />
        </main>
      </template>

      <template #right-panel>
        <StrategicDiscoveryPanel />
      </template>

      <template #footer>
        <VButtonToolbar
          :is-proceed-ready="false"
          :proceed-label="'Proceed to Formulation'"
          @transition-request="handlePhaseTransitionRequest"
        >
          <template #action-button>
            <VButton
              variant="primary"
              size="lg"
              :disabled="!explorationStore.isExplorationSufficient"
              class="bg-indigo-600! shadow-xl shadow-indigo-900/20 group"
            >
              <VTypography tag="span" weight="bold" color="white" class="group-hover:translate-x-0.5 transition-transform">
                Commit to Formulation
              </VTypography>
            </VButton>
          </template>
        </VButtonToolbar>
      </template>

    </ThreePaneWorkspaceTemplate>

    <FullScreenModalTemplate
      :is-open="isManagementModalOpen"
      :max-width-class="getModalWidthClass(managementModalType)"
      @close="isManagementModalOpen = false"
    >
      <template #header>
        <div class="flex items-center gap-2 px-2">
          <VTypography tag="span" color="slate-500" weight="light" class="uppercase tracking-widest text-[10px]">System</VTypography>
          <VTypography tag="span" weight="bold" color="indigo-400" size="lg">{{ getModalTitle(managementModalType) }}</VTypography>
        </div>
      </template>
    </FullScreenModalTemplate>
  </div>
</template>

<script setup lang="ts">
/**
 * ExplorationPage.vue
 * - Root template for the "War Room" phase.
 * - Handles top-level layout coordination and Store-to-Canvas event mapping.
 */
import { ref, computed, onMounted } from 'vue';
import { useExplorationStore } from '@/stores/exploration';
import { useProjectStore } from '@/stores/project';
import { useRegistry } from '@/composables/useRegistry';

// Atoms & Layout Components
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import ThreePaneWorkspaceTemplate from '@/components/templates/ThreePaneWorkspaceTemplate.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';

// Organisms
import VButtonToolbar from '@/components/molecules/forms/VButtonToolbar.vue';
import DiscoverySidebar from '@/components/organisms/sidebars/DiscoverySidebar.vue';
import ConceptualMapCanvas from '@/components/organisms/canvases/ConceptualMapCanvas.vue';
import StrategicDiscoveryPanel from '@/components/organisms/panels/StrategicDiscoveryPanel.vue';

import type { ConceptualEdge, ConceptualNode } from '@/interfaces/conceptual-map.ts';
import type { ManagementType } from '@/interfaces/exploration.ts';

// Stores
const explorationStore = useExplorationStore();
const projectStore = useProjectStore();

const {
  registryNodes,
  selectNode
} = useRegistry();

// UI State
const isManagementModalOpen = ref(false);
const managementModalType = ref<ManagementType>(null);

// Initial Data Fetching
onMounted(async () => {
  await explorationStore.loadExplorationData();
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

/**
 * Open Modal for Focus Alignment or Reflection Logs
 */
function handleOpenAligner(type: ManagementType) {
  managementModalType.value = type;
  isManagementModalOpen.value = true;
}

/**
 * Handle resource drop from Right Panel to Canvas
 */
function handleDropResource(item: any, position: { x: number, y: number }) {
  // explorationStore.addResourceToCanvas(item, position);
}

/**
 * Handles the 'viewDetails' event emitted by the sidebar (U.S. 1, 9, 12).
 * Triggers modals for Focus refinement or Reflection Log.
 */
function handleViewDetails(type: ManagementType, index?: number, value?: any) {
  managementModalType.value = type;
  isManagementModalOpen.value = true;
}

/**
 * Switch Active Multi-Canvas View
 */
function handleCanvasSwitch(viewId: string) {
  explorationStore.setActiveCanvasView(viewId);
}

/**
 * Handles updates/interactions on the Conceptual Map Canvas (Node/Group actions). (U.S. 7, 9)
 */
function handleNodeUpdate(node: ConceptualNode, action: 'move' | 'link' | 'edit' | 'delete' | 'group') {
  explorationStore.updateConceptualMapNode(node, action);
}

/**
 * Handles updates/interactions on Conceptual Map Edges (Create, Delete, Label Edit). (U.S. 8)
 */
function handleEdgeUpdate(edge: ConceptualEdge, action: 'create' | 'delete' | 'update' | 'label-edit') {
  explorationStore.updateConceptualMapEdge(edge, action);
}

/**
 * Handles the request to update the Focus data (U.S. 1).
 */
function handleUpdateFocus(type: ManagementType, value: any) {
    // initiativeStore.updateFocusData(type, value);
    isManagementModalOpen.value = false;
}

/**
 * Handles the request to manage canvases (e.g., create new, rename)
 */
function handleManageCanvas(action: 'create' | 'rename' | 'delete', viewId?: string) {
    // Logic to open a dedicated canvas management modal or trigger store actions
    console.log(`Canvas management requested: ${action} on ${viewId}`);
}

/**
 * E. Handles the core project transition request to the next phase (Formulation).
 */
async function handlePhaseTransitionRequest() {
  // Logic to transition phase and navigate
  // projectStore.transitionToNextPhase();
  // router.push('/formulation');
}

// --- Utility functions for Modals ---

function isFocusType(type: ManagementType): boolean {
  return type === 'final-question' || type === 'keyword' || type === 'scope';
}

function getModalWidthClass(type: ManagementType): string {
  switch (type) {
    case 'reflection-log':
      return 'max-w-6xl';
    case 'manual-resource':
      return 'max-w-xl';
    default: // For Focus refinement modals
      return 'max-w-2xl';
  }
}

function getModalTitle(type: ManagementType): string {
  switch (type) {
    case 'reflection-log':
      return 'Exploration Reflection Log';
    case 'manual-resource':
      return 'Manual Resource Entry';
    case 'final-question':
        return 'Refine Research Question';
    case 'keyword':
        return 'Manage Topic Keywords';
    case 'scope':
        return 'Refine Topic Scope';
    default:
      return '';
  }
}
// ... Additional lifecycle logic and data getters
</script>