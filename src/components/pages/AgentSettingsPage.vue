<template>
  <VBox tag="main" class="w-full min-h-screen bg-slate-50">
    <VBox class="max-w-7xl mx-auto w-full">
      <VStack gap="lg">
        <VBox
          background="white"
          padding="md"
          rounded="lg"
          class="border border-slate-200/60 shadow-sm"
        >
          <VAgentToolbar
            v-model="toolbarState"
            @create="isDeployModalOpen = true"
          />
        </VBox>

        <VBox v-if="hasAgents || isFiltering" class="max-w-7xl mx-auto w-full px-6">
          <VGrid cols="1 sm:2 lg:3 xl:3" gap="lg">
            <VInteractivePlaceholder
              label="Deploy New Agent"
              icon-name="CpuChip"
              class="h-full"
              @click="isDeployModalOpen = true"
            />

            <VAgentCard
              v-for="agent in filteredAgents"
              :key="agent.id"
              :agent="agent"
              @click="openAgentEditor(agent.id)"
            />
          </VGrid>
        </VBox>

        <VEmptyState
          v-else
          title="No agents found"
          description="Try adjusting your model filters or deploy a new specialized agent."
          icon="UserPlus"
        />

      </VStack>
    </VBox>
<!--
    <VModal v-if="isDeployModalOpen" @close="isDeployModalOpen = false">
      <template #title>Deploy Specialized Agent</template>
      <VBox padding="md">
        <VTypography color="slate-500">
          Select a blueprint from the Agent Marketplace to begin.
        </VTypography>
      </VBox>
    </VModal>
     -->
  </VBox>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAgentStore } from '@/stores/agent';

// Layout Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VGrid from '@/components/atoms/layout/VGrid.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

// Resource Molecules
import VAgentToolbar from '@/components/molecules/resources/VAgentToolbar.vue';
import VAgentCard from '@/components/molecules/resources/VAgentCard.vue';
import VInteractivePlaceholder from '@/components/molecules/resources/VInteractivePlaceholder.vue';

// Feedback Molecules
import VEmptyState from '@/components/molecules/feedback/VEmptyState.vue';
import VModal from '@/components/molecules/feedback/VModal.vue';

import type { ModelSelectorState } from '@/interfaces/indicators';
import type { Agent } from '@/interfaces/agents';

// --- State Management ---
const router = useRouter();
const agentStore = useAgentStore();
const isDeployModalOpen = ref(false);

const toolbarState = ref<ModelSelectorState>({
  filter: 'ALL',
  modelFamily: 'ALL',
  sorter: 'NAME'
});

// --- Logic: Filtering & Sorting ---
const isFiltering = computed(() =>
  toolbarState.value.filter !== 'ALL' || toolbarState.value.modelFamily !== 'ALL'
);

const filteredAgents = computed(() => {
  let list = Array.from(agentStore.agents.values());

  // Filter by Status
  // if (toolbarState.value.filter !== 'ALL') {
  //   list = list.filter(a => a.status === toolbarState.value.filter);
  // }

  if (toolbarState.value.modelFamily !== 'ALL') {
    list = list.filter(a =>
      a.llmParameters.model.toUpperCase().includes(toolbarState.value.modelFamily || '')
    );
  }

  // Sort Logic
  return [...list].sort((a, b) => {
    if (toolbarState.value.sorter === 'NAME') return a.name.localeCompare(b.name);
    // if (toolbarState.value.sorter === 'VERSION') return b.version.localeCompare(a.version);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
});

const hasAgents = computed(() => agentStore.agents.size > 0);

// --- Lifecycle & Actions ---
onMounted(() => {
  agentStore.loadProviders();
  agentStore.loadAgents();
});

const openAgentEditor = (agentId: string) => {
  router.push(`/settings/agents/${agentId}/`)
};
</script>

<style scoped>
/* Page-level transitions or layout specific tweaks */
main {
  /* Ensure smooth scrolling for long lists of agents */
  overflow-y: auto;
  scroll-behavior: smooth;
}
</style>