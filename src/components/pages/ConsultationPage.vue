<template>
  <div class="h-screen w-screen">
    <!-- Main Workspace Template: Utilizes the DualPane layout -->
    <DualPaneWorkspaceTemplate>

      <template #sidebar>
        <ConsultationSidebar />
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
import { computed, onMounted, ref } from 'vue';

import ChatInterface from '@/components/organisms/chat/ChatInterface.vue';
import DualPaneWorkspaceTemplate from '@/components/templates/DualPaneWorkspaceTemplate.vue';
import ConsultationSidebar from '@/components/organisms/domain/consultation/ConsultationSidebar.vue';
import type { ID } from '@/interfaces/core';

import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/project';

// --- Initialization ---
const consultationStore = useConsultationStore();
const projectStore = useProjectStore();
const route = useRoute();

// --- Store State Mapping (Computed Properties) ---
const chatMessages = computed(() => consultationStore.chatMessages);
const isTyping = computed(() => consultationStore.isTyping);

const currentProjectId = computed((): ID => {
  return route.params.id as ID || projectStore.currentProjectId || '';
});

// --- Lifecycle ---
onMounted(async () => {
  // Fetch initial state or resume persisted session when the page loads
  if (projectStore.currentProjectId === null) {
    projectStore.setCurrentProjectId(route.params.id as ID);
  }

  if (projectStore.currentStage !== 'EXPLORATION') {
    projectStore.updateProjectDetail({currentStage: 'EXPLORATION'})
  }

  await projectStore.getMessages();
  await projectStore.loadProjectDetail();
  await projectStore.loadConceptualNodes();
});

// --- Action Handlers (Orchestrating the Store) ---

/**
 * Handles user message input and sends it to the project store.
 */
function handleSendMessage(content: string) {
    if (isTyping.value || !content.trim()) return;

    const agentName = 'ExplorerAgent';
    projectStore.addMessage(content, agentName);
    // Trigger agent response logic here if needed: store.getAgentResponse(content);
}
</script>

<style scoped>
/* Scoped styles specific to the Initiation Page view */
</style>