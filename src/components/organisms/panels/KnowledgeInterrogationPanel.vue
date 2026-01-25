<template>
  <aside class="h-full flex flex-col relative bg-white border-l border-gray-100 overflow-hidden shadow-2xl">

    <transition
      enter-active-class="transition duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-400 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="store.isAdversaryVisible"
        class="absolute inset-0 z-50 bg-white/95 backdrop-blur-2xl p-8 flex flex-col border-l-8 border-red-600 shadow-[-20px_0_50px_rgba(220,38,38,0.1)]"
      >
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-600 rounded-lg text-white shadow-lg shadow-red-200">
              <Icon name="ExclamationTriangle" size="sm" />
            </div>
            <Text tag="h3" size="lg" weight="black" color="red-600" class="tracking-tighter uppercase italic">
              Adversarial Intercept
            </Text>
          </div>
          <div class="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
        </div>

        <div class="flex-grow space-y-8">
          <div class="space-y-2">
            <Text tag="span" size="xs" weight="black" color="red-400" class="uppercase tracking-widest">
              Anomaly Detected
            </Text>
            <Text tag="p" size="2xl" weight="bold" color="gray-900" class="leading-tight">
              Logical Paradox <br/> in Research Arc
            </Text>
          </div>

          <div class="p-6 bg-red-50 rounded-2xl border border-red-100 relative overflow-hidden group">
            <Icon name="ChatBubbleBottomCenterText" size="xl" class="absolute -right-4 -bottom-4 text-red-100 group-hover:scale-110 transition-transform" />
            <Text tag="p" size="md" color="red-900" class="leading-relaxed font-serif italic relative z-10">
              "{{ store.adversaryData.critique }}"
            </Text>
          </div>
        </div>

        <div class="flex flex-col gap-4 mt-auto">
          <Button variant="primary" size="lg" class="w-full bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200" @click="handleAdversaryAction('acknowledge')">
            <Text tag="span" weight="bold" color="white">Acknowledge Critique</Text>
          </Button>
          <Button variant="tertiary" size="md" class="w-full border border-red-200 text-red-600 hover:bg-red-50" @click="handleAdversaryAction('add-reflection')">
            <Icon name="DocumentPlus" size="xs" class="mr-2" />
            Inject Correction Node
          </Button>
        </div>
      </div>
    </transition>

    <TabbedPanel
      class="flex-grow flex flex-col overflow-hidden bg-white"
      active-tab-class="text-indigo-600"
      @active-tab-updated="handleTabSwitch"
    >
      <template #tab-1-title>
        <div class="flex items-center gap-2.5 px-1 py-1">
          <Icon name="Briefcase" size="xs" />
          <Text tag="span" size="sm" weight="bold">Repository</Text>
          <Badge variant="gray" size="xs" class="font-mono">{{ store.resources.length }}</Badge>
        </div>
      </template>
      <template #tab-1-content>
        <ResourceRepository
          :resources="store.resources"
          :node-summary="store.currentNodeSummary"
          @drop-to-canvas="handleDrop"
          class="bg-gray-50/30"
        />
      </template>

      <template #tab-2-title>
        <div class="relative py-1 flex items-center gap-2.5">
          <Icon name="CommandLine" size="xs" />
          <Text tag="span" size="sm" weight="bold">Interrogator</Text>
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
    </TabbedPanel>
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
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Badge from '@/components/atoms/Badge.vue';
import TabbedPanel from '@/components/molecules/navigation/TabbedPanel.vue';

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
 * Handles actions from the Adversarial paradox overlay.
 */
function handleAdversaryAction(action: 'acknowledge' | 'add-reflection') {
  if (action === 'acknowledge') {
    store.dismissAdversaryOverlay();
  } else {
    // Triggers a reflection node creation in the main canvas
    emit('open-refinement', 'reflection-log');
    store.dismissAdversaryOverlay();
  }
}

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