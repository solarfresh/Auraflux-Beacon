<template>
  <div class="h-screen w-screen">
    <!-- Main Workspace Template: Utilizes the DualPane layout -->
    <DualPaneWorkspaceTemplate>

      <!-- Slot: status-tracker (Shows ISP steps) -->

      <template #status-tracker>
        <VStepProgress
          :current-stage="currentStep"
          :completion-percentage="currentStepCompletionPercentage"
        />
      </template>

      <!-- Slot: sidebar (Displays structured output and progress) -->
      <template #sidebar>
        <InitiationSidebar
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
        <VButtonToolbar
          :is-proceed-ready="true"
          @transition-request="handlePhaseTransitionRequest"
        />
      </template>

    </DualPaneWorkspaceTemplate>

    <FullScreenModalTemplate
      :is-open="isManagementModalOpen"
      :max-width-class="getModalWidthClass(managementModalType)"
      @close="isManagementModalOpen = false"
    >
      <template #header>
        Manage {{ getModalTitle(managementModalType) }}
      </template>
      <template #content>
        <FinalQuestionEditor
          v-if="managementModalType === 'final-question'"
          :initialValue="initiativeStore.finalQuestion"
          :feasibility-status="initiativeStore.feasibilityStatus"
          :stability-score="initiativeStore.stabilityScore"
          @close-modal="isManagementModalOpen = false"
        />
        <KeywordDetailEditor
          v-else-if="managementModalType === 'keyword'"
          :initial-keyword="editingInitialKeyword!"
          :keyword-index="editingKeywordIndex!"
          @close-modal="isManagementModalOpen = false"
        />
        <SingleScopeDetailEditor
          v-else-if="managementModalType === 'scope'"
          :initial-scope-element="editingInitialScope!"
          :scope-index="editingScopeIndex!"
          :feasibility-status="feasibilityStatus"
          @close-modal="isManagementModalOpen = false"
        />

        <ReflectionLogForm
          v-else-if="managementModalType === 'reflection-log'"
          :initial-entries="reflectionLogEntries"
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
import { useRouter } from 'vue-router';

import VButtonToolbar from '@/components/molecules/forms/VButtonToolbar.vue';
import VStepProgress from '@/components/molecules/indicators/VStepProgress.vue';
import ChatInterface from '@/components/organisms/chat/ChatInterface.vue';
import FinalQuestionEditor from '@/components/organisms/forms/FinalQuestionEditor.vue';
import KeywordDetailEditor from '@/components/organisms/forms/KeywordDetailEditor.vue';
import SingleScopeDetailEditor from '@/components/organisms/forms/SingleScopeDetailEditor.vue';
import DualPaneWorkspaceTemplate from '@/components/templates/DualPaneWorkspaceTemplate.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';
import InitiationSidebar from '@/components/organisms/sidebars/InitiationSidebar.vue';
import ReflectionLogForm from '@/components/organisms/forms/ReflectionLogForm.vue';

import type { ManagementType, ProcessedKeyword, ProcessedScope } from '@/interfaces/initiation';
import { apiService } from '@/api/apiService';

// --- Initialization ---
const workflowStore = useWorkflowStore();
const initiativeStore = useInitiativeStore();
const router = useRouter();

// --- Local UI State ---
const isReflecting = ref(false); // Controls the visibility of the Reflection Modal
const isManagementModalOpen = ref(false); // Controls a generic modal for editing Question/Scope/Keywords
const managementModalType = ref<ManagementType>(null);
const editingKeywordIndex = ref<number | undefined>(undefined);
const editingInitialKeyword = ref<ProcessedKeyword | null>(null);
const editingScopeIndex = ref<number | undefined>(undefined);
const editingInitialScope = ref<ProcessedScope | null>(null);

// --- Store State Mapping (Computed Properties) ---
const chatMessages = computed(() => initiativeStore.chatMessages);
const currentStep = computed(() => workflowStore.currentStepName);
const currentStepCompletionPercentage = computed(() => workflowStore.currentStepCompletionPercentage);
const feasibilityStatus = computed(() => initiativeStore.feasibilityStatus)
const finalQuestion = computed(() => initiativeStore.finalQuestion);
const isTyping = computed(() => initiativeStore.isTyping);
const latestReflection = computed(() => initiativeStore.latestReflection);
const reflectionLogEntries = computed(() => initiativeStore.reflectionLogs);
const resourceSuggestion = computed(() => initiativeStore.resourceSuggestion)
const stabilityScore = computed(() => initiativeStore.stabilityScore);
const topicKeywords = computed(() => initiativeStore.topicKeywords);
const topicScope = computed(() => initiativeStore.topicScope);

// --- Lifecycle ---
onMounted(() => {
    // Fetch initial state or resume persisted session when the page loads
    initiativeStore.getMessages();
    initiativeStore.getRefinedTopic();
    initiativeStore.getReflection();
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
  editingScopeIndex.value = undefined;
  editingInitialKeyword.value = null;
  editingInitialScope.value = null;
  managementModalType.value = type;

  switch (type) {
    case 'reflection-log':
      isManagementModalOpen.value = true;
      break;

    case 'final-question':
      // isManagementModalOpen.value = true;
      break;

    case 'scope':
      // Open a generic management modal for Question/Scope
      editingScopeIndex.value = index || topicScope.value.length;
      editingInitialScope.value = value || {
        id: '',
        label: '',
        value: '',
        entityStatus: 'USER_DRAFT',
        boundaryType: 'INCLUSION',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ProcessedScope;
      isManagementModalOpen.value = true;
      break;

    case 'keyword':
      editingKeywordIndex.value = index || topicKeywords.value.length;
      editingInitialKeyword.value = value || {
        id: '',
        label: '',
        entityStatus: 'USER_DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ProcessedKeyword;
      isManagementModalOpen.value = true;
      break;

    default:
      console.warn(`[INITIATION PAGE] Unknown view detail type: ${type}`);
  }
}

function getModalWidthClass(type: ManagementType | null): string {
  switch (type) {
    case 'reflection-log':
      // Requires the largest width for split view
      return 'max-w-6xl';
    case 'final-question':
      // Question editor might need moderate width
      return 'max-w-3xl';
    case 'keyword':
    case 'scope':
    default:
      // Standard forms can use the default or slightly smaller width
      return 'max-w-2xl';
  }
}

function getModalTitle(type: ManagementType | null): string {
  switch (type) {
    case 'reflection-log':
      // Requires the largest width for split view
      return 'Reflection Log';
    case 'final-question':
      return 'Final Question';
    case 'keyword':
      return 'Topic Keyword';
    case 'scope':
      return 'Topic Scope Element';
    default:
      // Standard forms can use the default or slightly smaller width
      return '';
  }
}

/**
 * E. Handles the core workflow transition request from the ActionBar.
 * This combines the "Lock Data" and "Change Phase" actions.
 */
async function handlePhaseTransitionRequest() {
  try {
    const response = await apiService.workflows.exploration.createSession(initiativeStore.stabilityScore, initiativeStore.finalQuestion);
    if (response.data) {
      router.push('/exploration');
    } else {
      console.log(response.data);
    }
  } catch (error) {
    console.error('Failed to transition phase:', error);
    // Display user-friendly error message
  }
}
</script>

<style scoped>
/* Scoped styles specific to the Initiation Page view */
</style>