<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="lg" class="max-w-5xl mx-auto w-full">
      <AgentBenchView
        :disabled="disabled"
        :is-dirty="isDirty"
        :agents="agents"
        :providers="providerOptions"
        :selected-provider="selectedProviderId"
        :selected-model="selectedModelFamilyId"
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
        @update:prompt-form-data="handlePromptFormUpdate"
        @update:variable-values="handleVariableValuesChange"
        @save="handleSave"
        @edit="handleEdit"
        @run-test="handleRunTest"
      />
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
/**
 * AgentBenchPage (Business Container Page)
 * Connects the application logic/Pinia store (via useAgentBench)
 * to the presentational AgentBenchView component.
 */
import { onMounted } from 'vue';
import AgentBenchView from '@auraflux/design-system/components/views/AgentBenchView.vue';
import { useAgentBench } from '@auraflux/shared-core/composables/useAgentBench';
import { useAgentStore } from '@auraflux/shared-core/stores/agent';

import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

const agentStore = useAgentStore();

const {
  disabled,
  isDirty,
  isExecuting,
  agents,
  providerOptions,
  selectedProviderId,
  selectedModelFamilyId,
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
  handlePromptFormUpdate,
  handleVariableValuesChange,
  handleSave,
  handleEdit,
  handleRunTest,
} = useAgentBench();

// Fetch initial data from backend services when the page loads
onMounted(async () => {
  await Promise.all([
    agentStore.fetchAgents(),
    agentStore.fetchProviders(),
  ]);
});
</script>