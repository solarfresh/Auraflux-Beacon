<template>
  <aside class="h-full flex flex-col relative bg-white overflow-hidden">
    <VNavTabs
      class="flex-grow flex flex-col overflow-hidden bg-white"
      active-tab-class="text-indigo-600"
      @active-tab-updated="handleTabSwitch"
    >
      <template #tab-1-title>
        <div class="flex items-center gap-2.5 px-1 py-1">
          <VIcon name="Briefcase" size="xs" />
          <VTypography tag="span" size="sm" weight="bold">Repository</VTypography>
          <VBadge variant="gray" size="xs" class="font-mono">{{ store.resources.length }}</VBadge>
        </div>
      </template>
      <template #tab-1-content>
        <ResourceRepository />
      </template>

      <template #tab-2-title>
        <div class="relative py-1 flex items-center gap-2.5">
          <VIcon name="CommandLine" size="xs" />
          <VTypography tag="span" size="sm" weight="bold">Interrogator</VTypography>
          <span
            v-if="store.hasUnreadAIChat"
            class="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce"
          ></span>
        </div>
      </template>
      <template #tab-2-content>
        <ChatInterface
          :messages="store.chatMessages"
          :is-typing="store.isTyping"
          @solidify-to-canvas="handleDrop"
          @send-message="store.getAgentResponse"
          class="bg-white"
        />
      </template>
    </VNavTabs>
  </aside>
</template>

<script setup lang="ts">
/**
 * KnowledgeInterrogationPanel.vue
 * The critical right-hand side panel for AI collaboration and resource management.
 * Features a high-urgency overlay for "Adversarial" logic checking.
 */
import { useExplorationStore } from '@/stores/exploration';

// Atoms & Molecules
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import VNavTabs from '@/components/molecules/navs/VNavTabs.vue';

// Organisms
import ChatInterface from '@/components/organisms/chat/ChatInterface.vue';
import ResourceRepository from '@/components/organisms/sections/ResourceRepository.vue';

import type { ManagementType } from '@/interfaces/exploration.ts';

const store = useExplorationStore();
const emit = defineEmits<{
  (e: 'drop-to-canvas', item: any, pos: { x: number, y: number }): void;
  (e: 'open-refinement', type: ManagementType): void;
}>();

// --- Handlers ---

/**
 * Passes items dragged from repository/chat onto the research canvas.
 */
function handleDrop(item: any, position: { x: number, y: number }) {
  emit('drop-to-canvas', item, position);
}

/**
 * Tab state management, handles read-receipts for AI chat.
 */
function handleTabSwitch(index: number) {
  if (index === 1 && store.hasUnreadAIChat) {
    store.markAIChatAsRead();
  }
}
</script>