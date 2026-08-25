<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="lg" class="max-w-5xl mx-auto w-full">
      <VStack gap="lg">
        <VAgentToolbar
          :disabled="true"
          :agents="agents"
          :selected-agent="selectedAgent"
          :providers="providerOptions"
          :models="modelOptions"
          @edit="goToEditAgent"
          @select-agent="handleSelectAgent"
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
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router'
import { useAgentBench } from '@auraflux/shared-core/composables/useAgentBench';
import { useAgentStore } from '@/stores/agent';

import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VAgentToolbar from '@auraflux/design-system/components/organisms/navs/VAgentToolbar.vue';
import PropositionInitializerCard from '@/components/organisms/propositions/PropositionInitializerCard.vue';

const agentStore = useAgentStore();
const { agents, currentAgent, isLoading: isAgentLoading } = storeToRefs(agentStore);

const route = useRoute();
const router = useRouter();
const {
  selectedAgent,
  providerOptions,
  modelOptions,
  handleSelectAgent,
  handleStatusChange,
  handleProviderChange,
  handleModelChange,
} = useAgentBench({
  agents,
  currentAgent,
  isLoading: isAgentLoading,
  onSelectAgent: (agentId) => agentStore.setCurrentAgentId(agentId),
  onSaveAgent: async (payload) => {},
  onRunTest: async (payload, variables) => {
    // Invoke module-specific execution service
  },
});

const goToEditAgent = () => {
  router.push({
    name: 'AgentBenchPage',
    params: {
      projectId: route.params.projectId,
    },
  });
}
</script>