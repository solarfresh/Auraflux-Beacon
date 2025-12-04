<template>
  <div class="h-screen">
    <!-- Main Workspace Template: Utilizes the DualPane layout -->
    <DualPaneWorkspaceTemplate>

      <!-- Slot: status-tracker (Shows ISP steps) -->

      <template #status-tracker>
        <ProgressTracker
          :current-stage="currentStep"
          :completion-percentage="50"
        />
      </template>

      <!-- Slot: sidebar (Displays structured output and progress) -->
      <template #sidebar>
<!--
        <SidebarContent
          :keywords="keywords"
          :scope="scope"
          :final-question="searchQuery"
          @keyword-update="handleKeywordUpdate"
        />
 -->
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
          @reflect-start="handleReflect"
          @transition-request="handlePhaseTransitionRequest"
        />
      </template>

    </DualPaneWorkspaceTemplate>

    <!-- FullScreen Modal for Reflection Log -->
    <FullScreenModalTemplate
      :is-open="isReflecting"
      @close="isReflecting = false"
    >
      <template #header>
        Log a Thought (Reflector Agent)
      </template>
      <template #default>
        <!-- ReflectionLogForm now emits the thought data -->
        <ReflectionLogForm @log-thought="logThought" />
      </template>
    </FullScreenModalTemplate>
  </div>
</template>

<script setup lang="ts">
import { useInitiativeStore } from '@/stores/initiation';
import { useWorkflowStore } from '@/stores/workflow';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import ActionBar from '@/components/molecules/ActionBar.vue';
import ProgressTracker from '@/components/molecules/ProgressTracker.vue';
import ReflectionLogForm from '@/components/molecules/ReflectionLogForm.vue';
import ChatInterface from '@/components/organisms/ChatInterface.vue';
import DualPaneWorkspaceTemplate from '@/components/templates/DualPaneWorkspaceTemplate.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';


// --- Initialization ---
const workflowStore = useWorkflowStore();
const initiativeStore = useInitiativeStore();
const router = useRouter();

// --- Local UI State ---
const isReflecting = ref(false); // Controls the visibility of the Reflection Modal

// --- Store State Mapping (Computed Properties) ---
const currentStep = computed(() => workflowStore.currentStep);
const isTyping = computed(() => initiativeStore.isTyping);
const chatMessages = computed(() => initiativeStore.chatMessages);
// const searchQuery = computed(() => store.searchQuery);

// Mock data mapping from store's placeholder results (as defined in workflow.ts)
// const keywords = computed(() => store.keywords);
// const scope = computed(() => store.scope);

// --- Lifecycle ---
onMounted(() => {
    // Fetch initial state or resume persisted session when the page loads
    initiativeStore.getMessages();
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
 * B. Handles manual keyword updates from the Sidebar.
 */
function handleKeywordUpdate(payload: { index: number, newText: string }) {
    // This action would update the structured data in the store
    // Example: store.updateKeyword(payload);
    console.log(`[INITIATION PAGE] Store Action: Updating keyword at index ${payload.index} to: ${payload.newText}`);
}

/**
 * C. Opens the reflection modal.
 */
function handleReflect() {
    isReflecting.value = true;
}

/**
 * D. Handles the submission of a thought from the Reflection form.
 */
function logThought(thought: string, category: string) {
    // store.logReflection(thought, category);
    isReflecting.value = false;
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