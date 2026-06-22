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
            @create="openAgentEditor(null)"
          />
        </VBox>

        <VBox v-if="hasAgents || isFiltering" class="max-w-7xl mx-auto w-full px-6">
          <VGrid cols="1 sm:2 lg:3 xl:3" gap="lg">
            <VInteractivePlaceholder
              label="Deploy New Agent"
              icon-name="CpuChip"
              class="h-full"
              @click="openAgentEditor(null)"
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
  </VBox>
</template>

<script setup lang="ts">
import { apiService } from '@/api/apiService';
import VBox from '@/components/atoms/layout/VBox.vue';
import VGrid from '@/components/atoms/layout/VGrid.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VEmptyState from '@/components/molecules/feedback/VEmptyState.vue';
import VAgentCard from '@/components/molecules/resources/VAgentCard.vue';
import VAgentToolbar from '@/components/molecules/resources/VAgentToolbar.vue';
import VInteractivePlaceholder from '@/components/molecules/resources/VInteractivePlaceholder.vue';
import type { ModelSelectorState } from '@/interfaces/indicators';
import { useAgentStore } from '@/stores/agent';
import { useProjectStore } from '@/stores/project';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// --- State Management ---
const router = useRouter();
const agentStore = useAgentStore();
const projectStore = useProjectStore();

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
const projectId = computed(() => projectStore.currentProjectId);

// --- Lifecycle & Actions ---
onMounted(() => {
  agentStore.loadProviders();
  agentStore.loadAgents();
});

const openAgentEditor = async (agentId: string | null) => {
  if (!agentId) {
    let response = await apiService.agents.createConfig();
    agentId = response.data.id;
  }

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