<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="lg" class="max-w-5xl mx-auto w-full">
      <VStack gap="lg">
        <VAgentToolbar
          :disabled="true"
          :agents="agents"
          :is-dirty="isDirty"
          :providers="providerOptions"
          :models="modelOptions"
          :selected-provider="selectedProvider"
          :selected-model="selectedModel"
          @edit="goToEditAgent"
          @select-agent="handleSelectAgent"
          @status-change="handleStatusChange"
          @update:selected-provider="handleUpdateSelectedProvider"
          @update:selected-model="handleUpdateSelectedModel"
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
import { useAgentToolbar } from '@auraflux/shared-core/composables/useAgentToolbar';

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
  isDirty,
  providerOptions,
  modelOptions,
  selectedProvider,
  selectedModel,
  handleSelectAgent,
  handleStatusChange,
  handleUpdateSelectedProvider,
  handleUpdateSelectedModel
} = useAgentToolbar();

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

const goToEditAgent = (agentId?: ID) => {
  if (!agentId) return;

    // router.push({
    //   name: 'AgentPage',
    //   params: { projectId: projectId.value, agentId: agentId },
    // });
}
</script>