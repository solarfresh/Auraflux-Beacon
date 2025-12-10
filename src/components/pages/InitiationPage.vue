<template>
  <div class="h-screen">
    <!-- Main Workspace Template: Utilizes the DualPane layout -->
    <DualPaneWorkspaceTemplate>

      <!-- Slot: status-tracker (Shows ISP steps) -->

      <template #status-tracker>
        <ProgressTracker
          :current-stage="currentStep"
          :completion-percentage="currentStepCompletionPercentage"
        />
      </template>

      <!-- Slot: sidebar (Displays structured output and progress) -->
      <template #sidebar>
        <SidebarContent
          :feasibility-status="feasibilityStatus"
          :final-question="finalQuestion"
          :keywords="topicKeywords"
          :latest-reflection="latestReflection"
          :resource-suggestion="resourceSuggestion"
          :scope="topicScope"
          :stability-score="stabilityScore"
          @view-details="handleViewDetails"
        />
      </template>

      <!-- Slot: chat-interface -->
      <template #chat-interface>
        <ChatInterface
          :messages="chatMessages"
          :is-typing="isTyping"
          @send-message="handleSendMessage"
        />
      </template>

      <!-- Slot: action-bar (Flow Control) -->
      <template #action-bar>
        <ActionBar
          :final-question="'searchQuery'"
          @transition-request="handlePhaseTransitionRequest"
        />
      </template>

    </DualPaneWorkspaceTemplate>

    <!-- FullScreen Modal for Reflection Log -->
    <FullScreenModalTemplate
      :is-open="isManagementModalOpen"
      @close="isManagementModalOpen = false"
    >
      <template #header>
        Manage {{ managementModalType }}
      </template>
      <template #default>
        <FinalQuestionEditor
            v-if="managementModalType === 'final-question'"
            :initial-question="initiativeStore.finalQuestion"
            :feasibility-status="initiativeStore.feasibilityStatus"
            :stability-score="initiativeStore.stabilityScore"
            @close-modal="isManagementModalOpen = false"
        />
        <KeywordRefinementForm
            v-if="managementModalType === 'keyword'"
            :initial-keyword="editingInitialKeyword!"
            :keyword-index="editingKeywordIndex!"
            @close-modal="isManagementModalOpen = false"
        />
        <ScopeRefinementForm
            v-else-if="managementModalType === 'scope-management'"
            :initial-scope="initiativeStore.topicScope"
            :feasibility-status="initiativeStore.feasibilityStatus"
            @close-modal="isManagementModalOpen = false"
        />

        <div v-else class="text-center p-8">Select an item to manage.</div>
        <!-- ReflectionLogForm now emits the thought data -->
        <!-- <ReflectionLogForm @log-thought="logThought" /> -->
      </template>
    </FullScreenModalTemplate>
  </div>
</template>

<script setup lang="ts">
import { useInitiativeStore } from '@/stores/initiation';
import { useWorkflowStore } from '@/stores/workflow';
import { computed, onMounted, ref } from 'vue';

import ActionBar from '@/components/molecules/ActionBar.vue';
import ProgressTracker from '@/components/molecules/ProgressTracker.vue';
// import ReflectionLogForm from '@/components/molecules/ReflectionLogForm.vue';
import ChatInterface from '@/components/organisms/ChatInterface.vue';
import FinalQuestionEditor from '@/components/organisms/FinalQuestionEditor.vue';
import KeywordRefinementForm from '@/components/organisms/KeywordRefinementForm.vue';
import ScopeRefinementForm from '@/components/organisms/ScopeRefinementForm.vue';
import DualPaneWorkspaceTemplate from '@/components/templates/DualPaneWorkspaceTemplate.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';
import SidebarContent from '@/components/templates/SidebarContent.vue';

import { TopicKeyword } from '@/interfaces/initiation';
import type { ManagementType } from '@/interfaces/initiation.ts';

// --- Initialization ---
const workflowStore = useWorkflowStore();
const initiativeStore = useInitiativeStore();

// --- Local UI State ---
const isReflecting = ref(false); // Controls the visibility of the Reflection Modal
const isManagementModalOpen = ref(false); // Controls a generic modal for editing Question/Scope/Keywords
const managementModalType = ref<ManagementType>(null);
const editingKeywordIndex = ref<number | undefined>(undefined);
const editingInitialKeyword = ref<TopicKeyword | null>(null);

// --- Store State Mapping (Computed Properties) ---
const chatMessages = computed(() => initiativeStore.chatMessages);
const currentStep = computed(() => workflowStore.currentStepName);
const currentStepCompletionPercentage = computed(() => workflowStore.currentStepCompletionPercentage);
const feasibilityStatus = computed(() => initiativeStore.feasibilityStatus)
const finalQuestion = computed(() => initiativeStore.finalQuestion);
const isTyping = computed(() => initiativeStore.isTyping);
const latestReflection = computed(() => initiativeStore.latestReflection);
const resourceSuggestion = computed(() => initiativeStore.resourceSuggestion)
const stabilityScore = computed(() => initiativeStore.stabilityScore);
const topicKeywords = computed(() => initiativeStore.topicKeywords);
const topicScope = computed(() => initiativeStore.topicScope);

// --- Lifecycle ---
onMounted(() => {
    // Fetch initial state or resume persisted session when the page loads
    initiativeStore.getMessages();
    initiativeStore.getRefinedTopic();
});

// --- Action Handlers (Orchestrating the Store) ---

/**
 * Handles user message input and sends it to the workflow store.
 */
function handleSendMessage(content: string) {
    if (isTyping.value || !content.trim()) return;
    initiativeStore.addMessage(content);
    // Trigger agent response logic here if needed: store.getAgentResponse(content);
}

/**
 * Handles the 'viewDetails' event emitted by the SidebarContent.
 *
 * @param type The type of detail view requested.
 * @param index Optional index for specific items (e.g., keywords).
 */
function handleViewDetails(type: ManagementType, index?: number, value?: any) {
    editingKeywordIndex.value = undefined;
    editingInitialKeyword.value = null;

    switch (type) {
        case 'reflection-log':
            // The reflection log should probably open its own dedicated full-screen log view
            // For now, let's assume it leads to the same full-screen modal as handleReflect() if it's just viewing the history.
            // If viewing history, a separate component would be needed.
            console.log('[INITIATION PAGE] Action: Opening full Reflection History view.');
            // isReflectionHistoryOpen.value = true; // Example

            // If we decide to use a dedicated modal for all, then:
            // managementModalType.value = type;
            // isManagementModalOpen.value = true;
            break;

        case 'final-question':
        case 'scope-management':
            // Open a generic management modal for Question/Scope
            managementModalType.value = type;
            isManagementModalOpen.value = true;
            break;

        case 'keyword-add':
        case 'keyword':
          editingKeywordIndex.value = index || topicKeywords.value.length;
          editingInitialKeyword.value = value || {text: '', status: 'USER_DRAFT'} as TopicKeyword;
          managementModalType.value = 'keyword';
          isManagementModalOpen.value = true;
          break;

        default:
            console.warn(`[INITIATION PAGE] Unknown view detail type: ${type}`);
    }
}

/**
 * E. Handles the core workflow transition request from the ActionBar.
 * This combines the "Lock Data" and "Change Phase" actions.
 */
async function handlePhaseTransitionRequest() {
    // if (isLoading.value || !searchQuery.value) return;

    // store.isLoading = true;

    // try {
    //     // 1. Data Lock (The finalization of structured data)
    //     await store.lockData();

    //     // 2. Phase Transition (The flow control change)
    //     await store.transitionToNextPhase();

    //     // 3. Navigation
    //     // Assuming the next phase (SELECTION) is mapped to the '/selection' route
    //     router.push('/selection');

    // } catch (error) {
    //     console.error('Failed to transition phase:', error);
    //     // Display user-friendly error message
    // } finally {
    //     store.isLoading = false;
    // }
}
</script>

<style scoped>
/* Scoped styles specific to the Initiation Page view */
</style>