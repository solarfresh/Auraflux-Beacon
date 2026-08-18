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
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project';
import { useAgentBench } from '@auraflux/shared-core/composables/useAgentBench';

import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VAgentToolbar from '@auraflux/design-system/components/organisms/navs/VAgentToolbar.vue';
import PropositionInitializerCard from '@/components/organisms/propositions/PropositionInitializerCard.vue';

import type { ID } from '@auraflux/design-system/interfaces/core';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const {
  agents,
  selectedAgent,
  providerOptions,
  modelOptions,
  handleSelectAgent,
  handleStatusChange,
  handleProviderChange,
  handleModelChange,
} = useAgentBench();

watch(
  () => route.params.projectId,
  (newProjectId, oldProjectId) => {
    if (newProjectId && newProjectId !== oldProjectId) {
      if (!Array.isArray(newProjectId)) {
        projectStore.setCurrentProjectId(newProjectId);
      }
    }
  },
  { immediate: true }
)

const goToEditAgent = () => {
  router.push({
    name: 'AgentBenchPage',
    params: {
      projectId: route.params.projectId,
    },
  });
}
</script>