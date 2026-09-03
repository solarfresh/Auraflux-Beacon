<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="lg" class="max-w-5xl mx-auto w-full">
      <AgentBenchView
        :disabled="false"
        :is-dirty="isDirty"
        :agents="agents"
        :embeddings="embeddings"
        :selected-agent="selectedAgent"
        :selected-embedding="selectedEmbedding"
        :providers="providerOptions"
        :models="modelOptions"
        :prompt-form-data="promptFormData"
        :embedding-config-data="embeddingConfigData"
        :variables="parsedVariables"
        :has-output-schema="hasOutputSchema"
        :is-schema-valid="isSchemaValid"
        :response-output="responseOutput"
        :raw-markdown-output="rawMarkdownOutput"
        :metrics="metrics"
        :is-executing="isExecuting || isPageLoading"
        @select-agent="handleSelectTarget"
        @status-change="handleStatusChange"
        @update:selected-provider="handleProviderChange"
        @update:selected-model="handleModelChange"
        @update:variable-values="handleVariableValuesChange"
        @save="handleSave"
        @run-test="handleRunTest"
      />
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
/**
 * AgentBenchPage (Business Container Page)
 * Connects AgentStore & EmbeddingStore to the shared bench composable
 * and renders the presentational AgentBenchView component.
 */
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import AgentBenchView from '@auraflux/design-system/components/views/AgentBenchView.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

import { useAgentBench } from '@auraflux/shared-core/composables/useAgentBench';
import { useAgentStore } from '@/stores/agent';
import { useEmbeddingStore } from '@/stores/embedding';

const route = useRoute();

// 1. Initialize Independent Stores
const agentStore = useAgentStore();
const embeddingStore = useEmbeddingStore();

const { agents, currentAgent, isLoading: isAgentLoading } = storeToRefs(agentStore);
const { embeddings, currentEmbedding, isLoading: isEmbeddingLoading } = storeToRefs(embeddingStore);

const isPageLoading = computed(() => isAgentLoading.value || isEmbeddingLoading.value);

// 2. Initialize useAgentBench using the Adapter pattern
const {
  isDirty,
  isExecuting,
  selectedAgent,
  selectedEmbedding,
  providerOptions,
  modelOptions,
  promptFormData,
  embeddingConfigData,
  parsedVariables,
  hasOutputSchema,
  isSchemaValid,
  responseOutput,
  rawMarkdownOutput,
  metrics,
  handleSelectTarget,
  handleStatusChange,
  handleProviderChange,
  handleModelChange,
  handleVariableValuesChange,
  handleSave,
  handleRunTest,
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
  onSaveAgent: async (payload) => {
    await agentStore.updateCurrentAgent(payload);
  },
  onSaveEmbedding: async (payload) => {
    await embeddingStore.updateCurrentEmbedding(payload);
  },
  onRunTest: async (payload, variables) => {
    // Invoke module-specific execution service
  },
});

// 3. Fetch project resources on load
onMounted(async () => {
  const projectId = (route.params.projectId as string) || '';
  if (projectId) {
    await Promise.all([
      agentStore.fetchAgentsByProject(projectId),
      embeddingStore.fetchEmbeddingsByProject(projectId),
    ]);
  }
});
</script>