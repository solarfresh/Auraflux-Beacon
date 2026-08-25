<template>
  <VBox
    padding="lg"
    class="shadow-md"
  >
    <VStack gap="lg">
      <!-- 1. Header Control Bar -->
      <VCluster justify="between" align="center">
        <VStack gap="xs">
          <VTypography size="md" weight="bold">
            Agent Preview
          </VTypography>
          <VTypography size="xs" attention="tertiary">
            Test Agent prompt execution in real-time
          </VTypography>
        </VStack>

        <VButton
          intent="success"
          surface="solid"
          rounded="md"
          icon-name="Play"
          size="sm"
          :is-loading="isLoading"
          @click="handleRunTest"
        >
          Run Test
        </VButton>
      </VCluster>

      <!-- 2. Dynamic Variable Simulation Sandbox -->
      <VFieldset
        v-if="hasVariables"
        title="Variables Sandbox"
        description="Configure dynamic variables to simulate agent execution."
        padding="md"
        class="w-full"
      >
        <VFormField
          v-for="variable in variables"
          :key="variable.name"
          :label="`${variable.name}:`"
          class="w-full"
        >
          <!-- Type Hint Slot -->
          <template #hint>
            <VTypography
              v-if="variable.type"
              size="xs"
              attention="tertiary"
              class="font-mono"
            >
              {{ variable.type }}
            </VTypography>
          </template>

          <!-- Input Control Slot Container -->
          <template #default="{ id: slotId }">
            <VTextarea
              v-if="variable.multiline"
              :id="slotId"
              :model-value="variableValues[variable.name]"
              placeholder="Enter variable value..."
              :rows="3"
              size="sm"
              class="font-mono text-xs leading-relaxed"
              @update:model-value="val => handleVariableChange(variable.name, val)"
            />
            <VInput
              v-else
              :id="slotId"
              :model-value="variableValues[variable.name]"
              placeholder="Enter variable value..."
              size="sm"
              class="font-mono text-xs"
              @update:model-value="val => handleVariableChange(variable.name, val)"
            />
          </template>
        </VFormField>

        <!-- Reset Actions -->
        <VCluster justify="end" class="w-full pt-1">
          <VButton
            size="xs"
            attention="secondary"
            @click="handleResetVariables"
          >
            Reset Variables
          </VButton>
        </VCluster>
      </VFieldset>

      <VTypography v-else size="xs" attention="tertiary" class="italic">
        No dynamic variables detected in system prompt.
      </VTypography>

      <!-- 3. Output Section (JSON vs. Markdown Route) -->
      <VStack gap="sm" class="w-full">
        <!-- Route A: Structured Output Schema Present -->
        <VJsonViewer
          v-if="hasOutputSchema"
          label="Output Response"
          :is-validated="isSchemaValid"
          :value="responseOutput"
        />

        <!-- Route B: Non-Structured Output Fallback (Markdown) -->
        <VStack v-else gap="xs" class="w-full">
          <VTypography
            tag="label"
            size="sm"
            weight="bold"
            attention="secondary"
            class="uppercase tracking-wider"
          >
            Output Response
          </VTypography>
          <VBox
            intent="neutral"
            surface="solid"
            padding="md"
            rounded="lg"
            border="all"
            class="shadow-inner w-full min-h-[100px]"
          >
            <VMarkdown :content="rawMarkdownOutput" />
          </VBox>
        </VStack>
      </VStack>

      <!-- 4. Execution Metrics Grid -->
      <VGrid :cols="2" gap="md" class="w-full">
        <!-- Latency Metric Card -->
        <VCard padding="md" class="text-center">
          <VTypography size="xs" attention="tertiary" class="uppercase tracking-wider">
            Latency
          </VTypography>
          <VTypography size="sm" weight="semibold">
            {{ metrics?.latency ? `${metrics.latency} s` : '--' }}
          </VTypography>
        </VCard>

        <!-- Token Usage Metric Card -->
        <VCard padding="md" class="text-center">
          <VTypography size="xs" attention="tertiary" class="uppercase tracking-wider">
            Token Usage
          </VTypography>
          <VTypography size="sm" weight="semibold">
            {{ metrics?.tokens ? `${metrics.tokens} tokens` : '--' }}
          </VTypography>
        </VCard>
      </VGrid>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VAgentBench Component
 * Organism orchestrating Agent execution test benches, dynamic variable inputs,
 * output view routing (JSON/Markdown), and performance metric grids.
 */
import { computed, ref, watch } from 'vue';

import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VTextarea from '@auraflux/design-system/components/atoms/forms/VTextarea.vue';
import VMarkdown from '@auraflux/design-system/components/atoms/indicators/VMarkdown.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VGrid from '@auraflux/design-system/components/atoms/layout/VGrid.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VFieldset from '@auraflux/design-system/components/molecules/forms/VFieldset.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VJsonViewer from '@auraflux/design-system/components/molecules/indicators/VJsonViewer.vue';
import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';

import type { DynamicVariable } from '@auraflux/design-system/interfaces/agents';

export interface AgentPreviewPanelProps {
  /** Dynamic prompt variables list extracted from prompt schema */
  variables?: DynamicVariable[];
  /** Flag determining if an Output Schema constraint is active */
  hasOutputSchema?: boolean;
  /** Response status against defined JSON Schema */
  isSchemaValid?: boolean;
  /** Response payload for structured JSON view */
  responseOutput?: Record<string, unknown> | string;
  /** Raw text response fallback for non-structured view */
  rawMarkdownOutput?: string;
  /** Performance metrics */
  metrics?: {
    latency?: number;
    tokens?: number;
  };
  /** Execution loading state */
  isLoading?: boolean;
}

const props = withDefaults(defineProps<AgentPreviewPanelProps>(), {
  variables: () => [],
  hasOutputSchema: false,
  isSchemaValid: false,
  responseOutput: () => ({}),
  rawMarkdownOutput: '',
  metrics: undefined,
  isLoading: false,
});

const emit = defineEmits<{
  (e: 'run'): void;
  (e: 'update:variableValues', values: Record<string, string>): void;
}>();

const variableValues = ref<Record<string, string>>({});

// Keep variableValues updated when variables prop changes
watch(
  () => props.variables,
  (newVars) => {
    const nextValues: Record<string, string> = {};
    newVars.forEach((v) => {
      nextValues[v.name] = v.defaultValue || '';
    });
    variableValues.value = nextValues;
  },
  { immediate: true, deep: true }
);

const hasVariables = computed(() => props.variables && props.variables.length > 0);

const handleVariableChange = (name: string, value: string) => {
  variableValues.value[name] = value;
  emit('update:variableValues', variableValues.value);
};

const handleResetVariables = () => {
  props.variables.forEach((v) => {
    variableValues.value[v.name] = v.defaultValue || '';
  });
  emit('update:variableValues', variableValues.value);
};

const handleRunTest = () => {
  emit('run');
};
</script>