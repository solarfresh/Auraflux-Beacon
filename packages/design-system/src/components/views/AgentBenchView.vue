<template>
  <VStack gap="lg" class="h-full">
    <!-- Top Toolbar: Agent/Embedding Selection, Provider/Model Controls & Actions -->
    <VAgentToolbar
      class="px-6 shrink-0"
      :agents="agents"
      :embeddings="embeddings"
      :selected-agent="selectedAgent"
      :selected-embedding="selectedEmbedding"
      :disabled="disabled"
      :is-dirty="isDirty"
      :providers="providers"
      :models="models"
      @save="$emit('save')"
      @select-agent="(target: Agent | Embedding) => $emit('select-agent', target)"
      @status-change="(status: EntityStatus) => $emit('status-change', status)"
      @update:selected-provider="(providerId: ID) => $emit('update:selected-provider', providerId)"
      @update:selected-model="(modelId: ID) => $emit('update:selected-model', modelId)"
    />

    <!-- Dynamic Workspace Split-Pane View Switcher -->
    <component
      :is="activeBenchComponent"
      class="flex-1 min-h-0"
      v-bind="activeBenchProps"
      @submit-prompt="$emit('submit-prompt')"
      @run-test="$emit('run-test')"
      @update:variable-values="(values: Record<string, string>) => $emit('update:variable-values', values)"
      @submit-config="(val: EmbeddingFormData) => $emit('submit-config', val)"
      @update:config-data="(val: EmbeddingFormData) => $emit('update:config-data', val)"
      @update:query-text="(val: string) => $emit('update:query-text', val)"
    />
  </VStack>
</template>

<script setup lang="ts">
/**
 * AgentBenchView Component
 * A standardized presenter & router view workspace for Agent Prompt configuration
 * and live vector/RRF hybrid search testing.
 *
 * @category Organisms
 * @subcategory Views
 */
import { computed } from 'vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VAgentToolbar from '@auraflux/design-system/components/organisms/navs/VAgentToolbar.vue';

import LlmPromptBenchView from './LlmPromptBenchView.vue';
import EmbeddingBenchView from './EmbeddingBenchView.vue';

import type {
  Agent,
  DynamicVariable,
  Embedding,
  EmbeddingFormData,
  ModelOption,
  PromptSchemaFormData,
  ProviderOption,
} from '@auraflux/design-system/interfaces/agents';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';
import type { RankBreakdownItem, SearchMetrics } from '../organisms/panels/HybridSearchPlaygroundPanel.vue';

export interface AgentBenchViewProps {
  /** Disables header control actions */
  disabled?: boolean;
  /** Indicates whether pending unsaved form changes exist */
  isDirty?: boolean;
  /** Available agent configurations */
  agents?: Agent[];
  /** Available embedding configurations */
  embeddings?: Embedding[];
  /** Currently selected agent object */
  selectedAgent?: Partial<Agent> | null;
  /** Currently selected embedding entity (if active mode is search/embedding) */
  selectedEmbedding?: Partial<Embedding> | null;
  /** Currently selected model ID */
  selectedModelId?: ID;
  /** Provider list for model configuration */
  providers?: ProviderOption[];
  /** Model list for selection */
  models?: ModelOption[];

  // LLM Prompt Mode Props
  /** Prompt schema form state */
  promptFormData?: PromptSchemaFormData;
  /** Dynamic template variables */
  variables?: DynamicVariable[];
  /** Whether output JSON schema validation is enabled */
  hasOutputSchema?: boolean;
  /** State of schema validation */
  isSchemaValid?: boolean;
  /** Raw JSON or key-value test output */
  responseOutput?: Record<string, unknown> | string;
  /** Rendered Markdown output */
  rawMarkdownOutput?: string;
  /** Execution performance metrics for LLM */
  metrics?: {
    latency?: number;
    tokens?: number;
  };

  // Embedding & RRF Mode Props
  /** Embedding configuration dataset */
  embeddingConfigData?: EmbeddingFormData;
  /** Two-way bound query text for search playground */
  queryText?: string;
  /** Reciprocal Rank Fusion dataset for search table */
  breakdownData?: RankBreakdownItem[];
  /** Search performance metrics */
  searchMetrics?: SearchMetrics;

  /** General execution pending state */
  isExecuting?: boolean;
}

const props = withDefaults(defineProps<AgentBenchViewProps>(), {
  disabled: false,
  isDirty: false,
  agents: () => [],
  embeddings: () => [],
  selectedAgent: null,
  selectedEmbedding: null,
  selectedModelId: '',
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
  embeddingConfigData: undefined,
  queryText: '',
  breakdownData: () => [],
  searchMetrics: undefined,
  isExecuting: false,
});

defineEmits<{
  /** Triggered when save button is clicked in toolbar */
  (e: 'save'): void;
  /** Triggered when agent target is switched */
  (e: 'select-agent', target: Agent | Embedding): void;
  /** Triggered when agent active status changes */
  (e: 'status-change', status: EntityStatus): void;
  /** Triggered when AI provider option changes */
  (e: 'update:selected-provider', providerId: ID): void;
  /** Triggered when AI model selection changes */
  (e: 'update:selected-model', modelId: ID): void;

  /** LLM: Prompt schema submission emit */
  (e: 'submit-prompt'): void;
  /** General: Execution trigger for sandbox testing */
  (e: 'run-test'): void;
  /** LLM: Variable input values update emit */
  (e: 'update:variable-values', values: Record<string, string>): void;

  /** Embedding: Configuration submission emit */
  (e: 'submit-config', value: EmbeddingFormData): void;
  /** Embedding: Two-way config data sync emit */
  (e: 'update:config-data', value: EmbeddingFormData): void;
  /** Embedding: Query text input sync emit */
  (e: 'update:query-text', value: string): void;
}>();

/**
 * Clean & Type-safe determination:
 * Switches to EmbeddingBenchView if selectedEmbedding is active or embeddingConfigData is provided.
 */
const isEmbeddingMode = computed(() => {
  if (props.selectedEmbedding && (props.selectedEmbedding.id || !props.selectedAgent?.id)) {
    return true;
  }
  return false;
});

/**
 * Dynamically resolves the target bench view component to mount.
 */
const activeBenchComponent = computed(() => {
  return isEmbeddingMode.value ? EmbeddingBenchView : LlmPromptBenchView;
});

/**
 * Normalizes and passes props down to active sub-views according to the active mode.
 */
const activeBenchProps = computed(() => {
  if (isEmbeddingMode.value) {
    return {
      configData: props.embeddingConfigData,
      providers: props.providers,
      queryText: props.queryText,
      breakdownData: props.breakdownData,
      searchMetrics: props.searchMetrics,
      isExecuting: props.isExecuting,
    };
  }

  return {
    promptFormData: props.promptFormData,
    variables: props.variables,
    hasOutputSchema: props.hasOutputSchema,
    isSchemaValid: props.isSchemaValid,
    responseOutput: props.responseOutput,
    rawMarkdownOutput: props.rawMarkdownOutput,
    metrics: props.metrics,
    isExecuting: props.isExecuting,
  };
});
</script>