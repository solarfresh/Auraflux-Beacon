<template>
  <div class="h-screen w-screen">
    <ThreePaneWorkspaceTemplate>

      <template #header>
        <ProgressTracker
          :current-stage="currentStep"
          :completion-percentage="currentStepCompletionPercentage"
        />
      </template>

      <template #left-sidebar>
        <CanvasStructureSidebar
          :current-focus="currentFocusData"
          :canvas-views="conceptualCanvasViews"
          :active-view-id="activeCanvasViewId"
          :node-summary="currentNodeSummary"
          @view-details="handleViewDetails"
          @switch-canvas="handleCanvasSwitch"
          @manage-canvas="handleManageCanvas"
        />
      </template>

      <template #main-content>
        <ConceptualMapCanvas
          :nodes="conceptualNodes"
          :edges="conceptualEdges"
          @node-update="handleNodeUpdate"
          @edge-update="handleEdgeUpdate"
          @edge-create="handleEdgeUpdate"
          @drop-resource="handleDropResource"
        />
      </template>

      <template #right-panel>
        <div class="h-full flex flex-col">
          <TabbedPanel @active-tab-updated="handleTabSwitch">

            <template #tab-1-title>Resources ({{ resources.length }})</template>
            <template #tab-1-content>
              <ResourceRepository
                :resources="resources"
                @add-manual-request="handleManualResourceRequest"
                @search-resources="handleSearchResources"
                @add-to-canvas="handleAddToCanvas"
                @update-resource="handleResourceUpdate"
              />
            </template>

            <template #tab-2-title>
              AI Guide & Search
              <span
                v-if="hasNewAiContent"
                class="inline-block w-2 h-2 ml-1 rounded-full bg-red-500"
                aria-label="New message from AI Guide"
              ></span>
            </template>
            <template #tab-2-content>
              <ChatInterface
                :messages="chatMessages"
                :is-typing="isTyping"
                :suggestions="aiSearchSuggestions"
                @send-message="handleSendMessage"
              />
            </template>
          </TabbedPanel>
        </div>
      </template>

      <template #footer>
        <ActionBar
          :is-proceed-ready="isExplorationComplete"
          :proceed-label="'Proceed to Formulation'"
          @transition-request="handlePhaseTransitionRequest"
        />
      </template>

    </ThreePaneWorkspaceTemplate>

    <FullScreenModalTemplate
      :is-open="isManagementModalOpen"
      :max-width-class="getModalWidthClass(managementModalType)"
      @close="isManagementModalOpen = false"
    >
      <template #header>
        Manage {{ getModalTitle(managementModalType) }}
      </template>
      <template #content>
        <ReflectionLogForm
          v-if="managementModalType === 'reflection-log'"
          :initial-entries="reflectionLogEntries"
          @close-modal="isManagementModalOpen = false"
        />
<!--
        <RefinementModal
          v-else-if="isFocusRefinementType(managementModalType)"
          :type="managementModalType"
          :initial-data="getFocusData(managementModalType)"
          @update-focus="handleUpdateFocus"
          @close-modal="isManagementModalOpen = false"
        />

        <ResourceAddItemModal
          v-else-if="managementModalType === 'manual-resource'"
          @add-resource="handleAddManualResource"
          @close-modal="isManagementModalOpen = false"
        />
 -->
        <div v-else class="text-center p-8">...</div>
      </template>
    </FullScreenModalTemplate>
  </div>
</template>

<script setup lang="ts">
import { useExplorationStore } from '@/stores/exploration';
import { useInitiativeStore } from '@/stores/initiation';
import { useWorkflowStore } from '@/stores/workflow';
import { computed, onMounted, ref } from 'vue';

// --- Layout & Global Components ---
import ActionBar from '@/components/molecules/ActionBar.vue';
import ProgressTracker from '@/components/molecules/ProgressTracker.vue';
import TabbedPanel from '@/components/molecules/TabbedPanel.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';
import ThreePaneWorkspaceTemplate from '@/components/templates/ThreePaneWorkspaceTemplate.vue';

// --- Workspace Organisms ---
import ChatInterface from '@/components/organisms/ChatInterface.vue';
import ConceptualMapCanvas from '@/components/organisms/ConceptualMapCanvas.vue';
import ReflectionLogForm from '@/components/organisms/ReflectionLogForm.vue';
import ResourceRepository from '@/components/organisms/ResourceRepository.vue';

// --- Custom Sidebar & Modal Components (NEW) ---
import CanvasStructureSidebar from '@/components/templates/CanvasStructureSidebar.vue'; // NEW: For multi-canvas management (U.S. 2, 12)
// import RefinementModal from '@/components/organisms/RefinementModal.vue'; // NEW: For editing Focus data (U.S. 1)
// import ResourceAddItemModal from '@/components/organisms/ResourceAddItemModal.vue'; // NEW: For manual resource entry (U.S. 5)

// --- Interfaces ---
import type { ConceptualEdge, ConceptualNode } from '@/interfaces/conceptual-map.ts';
import type { ManualResourceData } from '@/interfaces/exploration.ts';
import type { ManagementType } from '@/interfaces/exploration.ts';
import type { ResourceItem } from '@/interfaces/knowledge.ts';

// --- Initialization ---
const workflowStore = useWorkflowStore();
const initiativeStore = useInitiativeStore();
const explorationStore = useExplorationStore();

// --- Local UI State ---
const isManagementModalOpen = ref(false);
const managementModalType = ref<ManagementType>(null);

// --- Store State Mapping (Computed Properties) ---
const currentStep = computed(() => workflowStore.currentStepName);
const currentStepCompletionPercentage = computed(() => workflowStore.currentStepCompletionPercentage);

// Data from Initiation/Selection (The Focus structure)
const currentFocusData = computed(() => ({
  latestReflection: initiativeStore.latestReflection,
  feasibilityStatus: initiativeStore.feasibilityStatus,
  finalQuestion: initiativeStore.finalQuestion,
  keywords: initiativeStore.topicKeywords,
  resourceSuggestion: initiativeStore.resourceSuggestion,
  scope: initiativeStore.topicScope,
  stabilityScore: initiativeStore.stabilityScore,
}));

// Exploration Specific Data
const resources = computed(() => explorationStore.resources as ResourceItem[]);
const conceptualNodes = computed(() => explorationStore.conceptualNodes as ConceptualNode[]);
const conceptualEdges = computed(() => explorationStore.conceptualEdges as ConceptualEdge[]);
const conceptualCanvasViews = computed(() => explorationStore.canvasViews); // NEW: For multi-canvas
const activeCanvasViewId = computed(() => explorationStore.activeCanvasViewId); // NEW
const currentNodeSummary = computed(() => explorationStore.currentNodeSummary); // NEW: For sidebar index (U.S. 12)
const chatMessages = computed(() => explorationStore.chatMessages);
const isTyping = computed(() => explorationStore.isTyping);
const aiSearchSuggestions = computed(() => explorationStore.aiSearchSuggestions);
const reflectionLogEntries = computed(() => explorationStore.reflectionLogs);
const hasNewAiContent = computed(() => explorationStore.hasUnreadAIChat); // NEW: For Notification Badge (U.S. 10)

// Flow control logic
const isExplorationComplete = computed(() => explorationStore.isExplorationSufficient);

// --- Lifecycle ---
onMounted(() => {
  initiativeStore.getRefinedTopic();
  explorationStore.loadExplorationData();
});

// --- Action Handlers ---

/**
 * Handles tab switching in the TabbedPanel (Right Panel).
 * Used primarily to clear the AI notification badge when the user views the chat. (U.S. 10)
 */
function handleTabSwitch(index: number) {
  // Assuming AI Guide is Tab 2 (index 1)
  if (index === 1 && hasNewAiContent.value) {
    explorationStore.markAIChatAsRead();
  }
}

/**
 * Handles sending messages to the AI Agent. (U.S. 11)
 */
function handleSendMessage(content: string) {
  if (isTyping.value || !content.trim()) return;
  explorationStore.addMessage(content);
  explorationStore.getAgentResponse(content);
}

/**
 * Handles search request from Resource Repository (U.S. 4)
 */
function handleSearchResources(term: string) {
  // Store action should handle calling both internal and external (Google) search APIs
  explorationStore.searchResources(term);
}

/**
 * Opens the modal for manually adding a resource (U.S. 5)
 */
function handleManualResourceRequest() {
  managementModalType.value = 'manual-resource';
  isManagementModalOpen.value = true;
}

/**
 * Handles the actual submission of a manually entered resource.
 */
function handleAddManualResource(data: ManualResourceData) {
  explorationStore.addManualResource(data);
  isManagementModalOpen.value = false;
}

/**
 * Handles the event from Resource Repository to add a resource/concept to the canvas.
 * This is triggered by a button click, typically used for testing.
 */
function handleAddToCanvas(item: ResourceItem, position: { x: number, y: number }) {
  explorationStore.addResourceToCanvas(item, position);
}

/**
 * Handles the drag-and-drop event from Resource Repository onto the canvas. (U.S. 6)
 */
function handleDropResource(item: ResourceItem, position: { x: number, y: number }) {
  explorationStore.addResourceToCanvas(item, position);
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
 * Handles user interaction to update notes or relevance of a collected resource.
 */
function handleResourceUpdate(resource: ResourceItem) {
  // explorationStore.updateResource(resource);
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
 * Handles the event to switch the active conceptual canvas view (U.S. 2).
 */
function handleCanvasSwitch(viewId: string) {
  explorationStore.setActiveCanvasView(viewId);
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

function isFocusRefinementType(type: ManagementType): boolean {
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
</script>

<style scoped>
/* Scoped styles specific to the Exploration Page view */
</style>