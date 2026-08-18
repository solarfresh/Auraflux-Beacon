<template>
  <VStack gap="lg">
    <!-- Top Toolbar: Agent Selection, Provider/Model Controls & Actions -->
    <VAgentToolbar
      class="px-6"
      :agents="agents"
      :selected-agent="selectedAgent"
      :disabled="disabled"
      :is-dirty="isDirty"
      :providers="providers"
      :models="models"
      @save="$emit('save')"
      @select-agent="agent => $emit('select-agent', agent)"
      @status-change="status => $emit('status-change', status)"
      @update:selected-provider="providerId => $emit('update:selected-provider', providerId)"
      @update:selected-model="modelId => $emit('update:selected-model', modelId)"
    />

    <!-- Main Workspace Split-Pane View -->
    <VBox padding="none" class="flex flex-1 w-full">
      <!-- Left Pane: Prompt Schema Panel (Config & Output Constraints) -->
      <PromptSchemaPanel
        :model-value="promptFormData"
        class="w-1/2"
        @submit="$emit('submit-prompt')"
      />

      <!-- Right Pane: Agent Bench (Variable Sandbox, Output Viewer & Metrics) -->
      <AgentPreviewPanel
        class="w-1/2"
        :variables="variables"
        :has-output-schema="hasOutputSchema"
        :is-schema-valid="isSchemaValid"
        :response-output="responseOutput"
        :raw-markdown-output="rawMarkdownOutput"
        :metrics="metrics"
        :is-loading="isExecuting"
        @run="$emit('run-test')"
        @update:variable-values="values => $emit('update:variable-values', values)"
      />
    </VBox>
  </VStack>
</template>

<script setup lang="ts">
/**
 * AgentBenchView (Organism View)
 * A standardized presentational workspace component for Agent Prompt configuration and live testing.
 * Designed purely with Props & Emits for Design System integration.
 */
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VAgentToolbar from '@auraflux/design-system/components/organisms/navs/VAgentToolbar.vue';
import AgentPreviewPanel from '@auraflux/design-system/components/organisms/panels/AgentPreviewPanel.vue';
import PromptSchemaPanel from '@auraflux/design-system/components/organisms/panels/PromptSchemaPanel.vue';

import type { Agent, DynamicVariable, ModelOption, PromptSchemaFormData, ProviderOption } from '@auraflux/design-system/interfaces/agents';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';

export interface AgentBenchViewProps {
  // Toolbar Props
  disabled?: boolean;
  isDirty?: boolean;
  agents?: Agent[];
  selectedAgent?: Partial<Agent> | null;
  providers?: ProviderOption[];
  models?: ModelOption[];

  // Prompt Schema Panel Props
  promptFormData?: PromptSchemaFormData;

  // Agent Bench Panel Props
  variables?: DynamicVariable[];
  hasOutputSchema?: boolean;
  isSchemaValid?: boolean;
  responseOutput?: Record<string, unknown> | string;
  rawMarkdownOutput?: string;
  metrics?: {
    latency?: number;
    tokens?: number;
  };
  isExecuting?: boolean;
}

withDefaults(defineProps<AgentBenchViewProps>(), {
  disabled: false,
  isDirty: false,
  agents: () => [],
  selectedAgent: null,
  providers: () => [],
  models: () => [],
  promptFormData: () => ({
    purpose: '',
    systemPrompt: '',
    promptTemplate: '',
    schemaFields: [],
  }),
  variables: () => [],
  hasOutputSchema: false,
  isSchemaValid: false,
  responseOutput: () => ({}),
  rawMarkdownOutput: '',
  metrics: undefined,
  isExecuting: false,
});

defineEmits<{
  // Toolbar Emits
  (e: 'save'): void;
  (e: 'edit', agentId?: ID): void;
  (e: 'select-agent', agent: Agent): void;
  (e: 'status-change', status: EntityStatus): void;
  (e: 'update:selected-provider', providerId: ID): void;
  (e: 'update:selected-model', modelId: ID): void;

  // Prompt Schema Panel Emits
  (e: 'submit-prompt'): void;

  // Agent Bench Emits
  (e: 'run-test'): void;
  (e: 'update:variable-values', values: Record<string, string>): void;
}>();
</script>