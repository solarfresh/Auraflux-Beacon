<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="lg" class="max-w-5xl mx-auto w-full">
      <VStack gap="lg">
        <VAgentToolbar
          :disabled="true"
          :agents="agents"
          :embeddings="embeddings"
          :selected-agent="selectedAgent"
          :selected-embedding="selectedEmbedding"
          :providers="providerOptions"
          :models="modelOptions"
          @edit="goToEditAgent"
          @select-agent="handleSelectTarget"
          @status-change="handleStatusChange"
          @update:selected-provider="handleProviderChange"
          @update:selected-model="handleModelChange"
        />

        <PropositionInitializerCard />
      </VStack>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

import { useAgentBench } from '@auraflux/shared-core/composables/useAgentBench';
import { useAgentStore } from '@/stores/agent';
import { useEmbeddingStore } from '@/stores/embedding';

import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VAgentToolbar from '@auraflux/design-system/components/organisms/navs/VAgentToolbar.vue';
import PropositionInitializerCard from '@/components/organisms/propositions/PropositionInitializerCard.vue';

const route = useRoute();
const router = useRouter();

const agentStore = useAgentStore();
const embeddingStore = useEmbeddingStore();

const { agents, currentAgent, isLoading: isAgentLoading } = storeToRefs(agentStore);
const { embeddings, currentEmbedding, isLoading: isEmbeddingLoading } = storeToRefs(embeddingStore);

const isPageLoading = computed(() => isAgentLoading.value || isEmbeddingLoading.value);

// 2. 透過 useAgentBench 整合狀態與事件
const {
  selectedAgent,
  selectedEmbedding,
  providerOptions,
  modelOptions,
  handleSelectTarget,
  handleStatusChange,
  handleProviderChange,
  handleModelChange,
} = useAgentBench({
  agents,
  currentAgent,
  embeddings,
  currentEmbedding,
  isLoading: isPageLoading,
  onSelectTarget: (targetId, type) => {
    if (type === 'AGENT') {
      agentStore.setCurrentAgentId(targetId);
      embeddingStore.setCurrentEmbeddingId(null);
    } else {
      embeddingStore.setCurrentEmbeddingId(targetId);
      agentStore.setCurrentAgentId(null);
    }
  },
  onSaveAgent: async () => {},
  onSaveEmbedding: async () => {},
});

onMounted(async () => {
  const projectId = (route.params.projectId as string) || '';
  if (projectId) {
    await Promise.all([
      agentStore.fetchAgentsByProject(projectId),
      embeddingStore.fetchEmbeddingsByProject(projectId),
    ]);
  }
});

const goToEditAgent = () => {
  router.push({
    name: 'AgentBenchPage',
    params: {
      projectId: route.params.projectId,
    },
  });
};
</script>