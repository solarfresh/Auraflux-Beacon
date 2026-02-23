<template>
  <BaseSidebarLayout class="w-[384px] h-full border-l border-slate-100 shadow-xl">

    <template #header>
      <VBox background="white" padding="none">
        <VStack gap="none">
          <VBox padding="md" border="bottom">
            <VCluster justify="between" align="center">
              <VTypography tag="h2" size="lg" weight="bold">Strategic Liaison</VTypography>
              <VBadge variant="emerald" pill size="xs">Live</VBadge>
            </VCluster>
          </VBox>

          <VBox background="amber-50" padding="sm" border="bottom">
            <VCluster gap="sm" align="start">
              <VIcon name="Sparkles" size="xs" class="text-amber-600 mt-0.5" />
              <VTypography size="xs" color="slate-700">
                Currently analyzing
                <VTypography tag="span" size="xs" weight="bold">Project Scope</VTypography>
                and
                <VTypography tag="span" size="xs" weight="bold">Node Dependencies</VTypography>
                on the canvas.
              </VTypography>
            </VCluster>
          </VBox>
        </VStack>
      </VBox>
    </template>

    <template #body>
      <VBox background="slate-50" border="none" class="h-full">
        <ChatInterface
          :messages="chatMessages"
          :is-typing="isAiProcessing"
          @send-message="handleAiCommand"
        />
      </VBox>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

// Atoms & Molecules
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import ChatInterface from '@/components/organisms/chat/ChatInterface.vue';

import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/interfaces/core';

const isAiProcessing = ref(false);

const chatMessages = reactive<ChatMessage[]>([
  {
    id: uuidv4(),
    role: 'system',
    content: 'Based on the current nodes, I suggest evaluating the correlation between your "Resource Constraints" and the "Q4 Deadline".',
    timestamp: new Date().toISOString(),
    sequenceNumber: 0
  }
]);

const handleAiCommand = (content: string) => {
  isAiProcessing.value = true;
};
</script>