<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="lg" class="max-w-5xl mx-auto w-full">
      <AgentBenchView
        :disabled="isLoading"
        :is-dirty="isDirty"
        :agents="agents"
        :selected-agent="selectedAgent"
        :providers="providerOptions"
        :models="modelOptions"
        :prompt-form-data="promptFormData"
        :variables="parsedVariables"
        :has-output-schema="hasOutputSchema"
        :is-schema-valid="isSchemaValid"
        :response-output="responseOutput"
        :raw-markdown-output="rawMarkdownOutput"
        :metrics="metrics"
        :is-executing="isExecuting"
        @select-agent="handleSelectAgent"
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
 * Connects the local feature module store to the shared bench composable
 * and renders the presentational AgentBenchView component.
 */
import { storeToRefs } from 'pinia';
import AgentBenchView from '@auraflux/design-system/components/views/AgentBenchView.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

import { useAgentBench } from '@auraflux/shared-core/composables/useAgentBench';
import { useAgentStore } from '@/stores/agent';

const agentStore = useAgentStore();
const { agents, currentAgent, isLoading: isAgentLoading } = storeToRefs(agentStore);

// 3. Initialize useAgentBench using the Adapter interface pattern
const {
  isDirty,
  isExecuting,
  isLoading,
  selectedAgent,
  providerOptions,
  modelOptions,
  promptFormData,
  parsedVariables,
  hasOutputSchema,
  isSchemaValid,
  responseOutput,
  rawMarkdownOutput,
  metrics,
  handleSelectAgent,
  handleStatusChange,
  handleProviderChange,
  handleModelChange,
  handleVariableValuesChange,
  handleSave,
  handleRunTest,
} = useAgentBench({
  agents,
  currentAgent,
  isLoading: isAgentLoading,
  onSelectAgent: (agentId) => agentStore.setCurrentAgentId(agentId),
  onSaveAgent: async (payload) => {await agentStore.updateCurrentAgent(payload);},
  onRunTest: async (payload, variables) => {
    // Invoke module-specific execution service
  },
});
</script>