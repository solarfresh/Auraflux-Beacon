<template>
  <div class="h-screen w-screen">
    <!-- Main Workspace Template: Utilizes the DualPane layout -->
    <DualPaneWorkspaceTemplate>

      <template #sidebar>
        <ConsultationSidebar
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
    </DualPaneWorkspaceTemplate>
  </div>
</template>

<script setup lang="ts">
import { useConsultationStore } from '@/stores/consultation';
import { useProjectStore } from '@/stores/project';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import ChatInterface from '@/components/organisms/chat/ChatInterface.vue';
import DualPaneWorkspaceTemplate from '@/components/templates/DualPaneWorkspaceTemplate.vue';
import ConsultationSidebar from '@/components/organisms/domain/consultation/ConsultationSidebar.vue';

import type { ManagementType, ProcessedKeyword, ProcessedScope } from '@/interfaces/consultation';
import { apiService } from '@/api/apiService';
import { useProjectConsultation } from '@/composables/useProjectConsultation';

// --- Initialization ---
const projectStore = useProjectStore();
const consultationStore = useConsultationStore();
const router = useRouter();
const { addMessage, loadConsultationData } = useProjectConsultation();

// --- Local UI State ---
const isReflecting = ref(false); // Controls the visibility of the Reflection Modal
const isManagementModalOpen = ref(false); // Controls a generic modal for editing Question/Scope/Keywords
const managementModalType = ref<ManagementType>(null);
const editingKeywordIndex = ref<number | undefined>(undefined);
const editingInitialKeyword = ref<ProcessedKeyword | null>(null);
const editingScopeIndex = ref<number | undefined>(undefined);
const editingInitialScope = ref<ProcessedScope | null>(null);

// --- Store State Mapping (Computed Properties) ---
const chatMessages = computed(() => consultationStore.chatMessages);
const feasibilityStatus = computed(() => consultationStore.feasibilityStatus)
const finalQuestion = computed(() => consultationStore.finalQuestion);
const isTyping = computed(() => consultationStore.isTyping);
const latestReflection = computed(() => consultationStore.latestReflection);
const reflectionLogEntries = computed(() => consultationStore.reflectionLogs);
const resourceSuggestion = computed(() => consultationStore.resourceSuggestion)
const stabilityScore = computed(() => consultationStore.stabilityScore);
const topicKeywords = computed(() => consultationStore.topicKeywords);
const topicScope = computed(() => consultationStore.topicScope);

// --- Lifecycle ---
onMounted(() => {
    // Fetch initial state or resume persisted session when the page loads
    loadConsultationData();
});

// --- Action Handlers (Orchestrating the Store) ---

/**
 * Handles user message input and sends it to the project store.
 */
function handleSendMessage(content: string) {
    if (isTyping.value || !content.trim()) return;
    addMessage(content);
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
      console.warn(`[CONSULTATION PAGE] Unknown view detail type: ${type}`);
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
 * E. Handles the core project transition request from the ActionBar.
 * This combines the "Lock Data" and "Change Phase" actions.
 */
async function handlePhaseTransitionRequest() {
  if (projectStore.currentProjectId === null) return;

  try {
    const response = await apiService.projects.exploration.createSession(projectStore.currentProjectId, consultationStore.stabilityScore, consultationStore.finalQuestion);
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