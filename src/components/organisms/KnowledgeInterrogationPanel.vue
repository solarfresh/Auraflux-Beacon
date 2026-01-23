<template>
  <aside class="h-full flex flex-col relative bg-white border-l border-gray-200 overflow-hidden">

    <transition
      enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-400 ease-in"
    >
      <div
        v-if="store.isAdversaryVisible"
        class="absolute inset-0 z-50 bg-red-50/98 backdrop-blur-xl p-8 flex flex-col border-l-4 border-red-500 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]"
      >
        <div class="flex items-center gap-3 mb-8">
          <div class="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
          <Text tag="h3" size="xl" weight="bold" color="red-700" class="tracking-widest uppercase italic font-serif">
            Adversarial Alert
          </Text>
        </div>

        <div class="flex-grow space-y-6">
          <Text tag="p" size="lg" weight="bold" color="gray-900" class="border-b border-red-200 pb-2">
            Logical Paradox Detected
          </Text>
          <Text tag="p" size="md" color="red-900" class="leading-relaxed font-medium">
            "{{ store.adversaryData.critique }}"
          </Text>
        </div>

        <div class="flex flex-col gap-3 mt-auto">
          <Button variant="destructive" size="lg" class="w-full shadow-md hover:shadow-lg transition-shadow" @click="handleAdversaryAction('acknowledge')">
            <Text tag="span" weight="bold" color="white">Acknowledge Risks</Text>
          </Button>
          <Button variant="danger-outline" class="w-full bg-white border-red-200 hover:bg-red-50" @click="handleAdversaryAction('add-reflection')">
            <Text tag="span" size="sm" weight="medium" color="red-600">Inject Correction Node</Text>
          </Button>
        </div>
      </div>
    </transition>

    <TabbedPanel class="flex-grow flex flex-col overflow-hidden bg-white" @active-tab-updated="handleTabSwitch">

      <template #tab-1-title>
        <div class="flex items-center gap-2 px-1">
          <Text tag="span" size="sm" weight="medium" color="gray-700">Repository</Text>
          <div class="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-mono">
            <Text tag="span" size="xs" color="gray-500">{{ store.resources.length }}</Text>
          </div>
        </div>
      </template>
      <template #tab-1-content>
        <ResourceRepository
          :resources="store.resources"
          :node-summary="store.currentNodeSummary"
          @drop-to-canvas="handleDrop"
          class="bg-gray-50/50"
        />
      </template>

      <template #tab-2-title>
        <div class="relative py-1 flex items-center gap-2">
          <Text tag="span" size="sm" weight="medium" color="gray-700">AI Interrogator</Text>
          <span v-if="store.hasUnreadAIChat" class="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>
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
 * KnowledgeInterrogationPanel.vue (Light Mode)
 * Responsibilities: AI interaction & Resource management in a clean, high-contrast UI.
 */
import { useExplorationStore } from '@/stores/exploration';
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';
import TabbedPanel from '@/components/molecules/navigation/TabbedPanel.vue';
import ChatInterface from '@/components/organisms/ChatInterface.vue';
import ResourceRepository from '@/components/organisms/ResourceRepository.vue';

const store = useExplorationStore();
const emit = defineEmits(['drop-to-canvas', 'open-refinement']);

function handleAdversaryAction(action: 'acknowledge' | 'add-reflection') {
  if (action === 'acknowledge') {
    store.dismissAdversaryOverlay();
  } else {
    emit('open-refinement', 'reflection-log');
  }
}

function handleDrop(item: any, position: { x: number, y: number }) {
  emit('drop-to-canvas', item, position);
}

function handleTabSwitch(index: number) {
  if (index === 1 && store.hasUnreadAIChat) {
    store.markAIChatAsRead();
  }
}
</script>