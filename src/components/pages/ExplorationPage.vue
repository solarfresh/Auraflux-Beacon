<template>
  <div class="h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
    <ThreePaneWorkspaceTemplate>

      <template #header>
        <ProgressTracker
          :current-stage="currentStep"
          :completion-percentage="currentStepCompletionPercentage"
        />
      </template>

      <template #left-sidebar>
        <CanvasStructureSidebar
          @select-node="handleNodeSelect"
          @request-teleport="handleTeleport"
        />
      </template>

      <template #main-content>
        <main class="relative h-full w-full">
          <ConceptualMapCanvas
            ref="canvas"
            :nodes="explorationStore.conceptualNodes"
            :edges="explorationStore.conceptualEdges"
            :health-scores="explorationStore.stabilityScore"
            :active-view-id="explorationStore.activeCanvasViewId"
            @node-update="handleNodeUpdate"
            @edge-update="handleEdgeUpdate"
            @drop-resource="handleDropResource"
          />

          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-1 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-full shadow-2xl z-10">
            <Button
              v-for="mode in ['Matrix', 'Causal', 'Radial']"
              :key="mode"
              variant="tertiary"
              size="sm"
              class="rounded-full !px-4 hover:bg-slate-800 group"
            >
              <Text tag="span" size="xs" weight="medium" color="slate-400" class="group-hover:text-slate-200">
                {{ mode }}
              </Text>
            </Button>
          </div>
        </main>
      </template>

      <template #right-panel>
        <KnowledgeInterrogationPanel
          @drop-to-canvas="handleDropResource"
          @open-refinement="handleOpenAligner"
          @send-message="explorationStore.getAgentResponse"
        />
      </template>

      <template #footer>
        <ActionBar
          :is-proceed-ready="false"
          :proceed-label="'Proceed to Formulation'"
          @transition-request="handlePhaseTransitionRequest"
        >
          <template #action-button>
            <Button
              variant="primary"
              size="lg"
              :disabled="!explorationStore.isExplorationSufficient"
              class="!bg-indigo-600 shadow-xl shadow-indigo-900/20 group"
            >
              <Text tag="span" weight="bold" color="white" class="group-hover:translate-x-0.5 transition-transform">
                Commit to Formulation
              </Text>
            </Button>
          </template>
        </ActionBar>
      </template>

    </ThreePaneWorkspaceTemplate>

    <FullScreenModalTemplate
      :is-open="isManagementModalOpen"
      :max-width-class="getModalWidthClass(managementModalType)"
      @close="isManagementModalOpen = false"
    >
      <template #header>
        <div class="flex items-center gap-2 px-2">
          <Text tag="span" color="slate-500" weight="light" class="uppercase tracking-widest text-[10px]">System</Text>
          <Text tag="span" weight="bold" color="indigo-400" size="lg">{{ getModalTitle(managementModalType) }}</Text>
        </div>
      </template>
      <template #content>
        <FocusAligner
          v-if="isFocusType(managementModalType)"
          :type="managementModalType"
          :initial-data="getFocusData(managementModalType)"
          @update-focus="handleUpdateFocus"
          @close="isManagementModalOpen = false"
        />
        <div v-else class="flex flex-col h-80 items-center justify-center gap-4">
          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <Text tag="span" color="slate-600" weight="light" class="italic font-sm">Synthesizing metadata...</Text>
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
import { useInitiativeStore } from '@/stores/initiation';
import { useWorkflowStore } from '@/stores/workflow';
import { useRegistry } from '@/composables/useRegistry';

// Atoms & Layout Components
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';
import ThreePaneWorkspaceTemplate from '@/components/templates/ThreePaneWorkspaceTemplate.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';

// Organisms
import ProgressTracker from '@/components/molecules/ProgressTracker.vue';
import ActionBar from '@/components/molecules/ActionBar.vue';
import CanvasStructureSidebar from '@/components/organisms/CanvasStructureSidebar.vue';
import ConceptualMapCanvas from '@/components/organisms/ConceptualMapCanvas.vue';
import KnowledgeInterrogationPanel from '@/components/organisms/KnowledgeInterrogationPanel.vue';
import FocusAligner from '@/components/organisms/FocusAligner.vue';

import type { ConceptualEdge, ConceptualNode } from '@/interfaces/conceptual-map.ts';
import type { ManagementType } from '@/interfaces/exploration.ts';

// Stores
const explorationStore = useExplorationStore();
const initiativeStore = useInitiativeStore();
const workflowStore = useWorkflowStore();

const {
  registryNodes,
  selectNode
} = useRegistry();

// UI State
const isManagementModalOpen = ref(false);
const managementModalType = ref<ManagementType>(null);

const currentStep = computed(() => workflowStore.currentStepName);
const currentStepCompletionPercentage = computed(() => workflowStore.currentStepCompletionPercentage);

// Initial Data Fetching
onMounted(async () => {
  await initiativeStore.getRefinedTopic();
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
  const node = registryNodes.value.find(n => n.id === nodeId);
  if (node && node.stabilityScore < 4) {
    explorationStore.isAdversaryVisible = true;
    // Potentially trigger a specific "Critical Inquiry" mode in the Adversary Data
    // explorationStore.adversaryData.focusNodeId = nodeId;
  }
};

/**
 * Manages cross-canvas navigation when a presence badge is clicked.
 */
const handleTeleport = async (data: { nodeId: string; canvasId: string }) => {
  const { nodeId, canvasId } = data;

  // Step 1: Switch the active canvas view if it's different
  if (explorationStore.activeCanvasViewId !== canvasId) {
    explorationStore.activeCanvasViewId = canvasId;
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
  explorationStore.addResourceToCanvas(item, position);
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
 * E. Handles the core workflow transition request to the next phase (Formulation).
 */
async function handlePhaseTransitionRequest() {
  // Logic to transition phase and navigate
  // workflowStore.transitionToNextPhase();
  // router.push('/formulation');
}

// --- Utility functions for Modals ---

function getFocusData(type: ManagementType): any {
  switch (type) {
    case 'final-question':
      return initiativeStore.finalQuestion;
    case 'keyword':
      return initiativeStore.topicKeywords;
    case 'scope':
      return initiativeStore.topicScope;
    default:
      return null;
  }
}

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