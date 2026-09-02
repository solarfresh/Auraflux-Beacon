<template>
  <VBox padding="none" border="none" class="flex flex-1 w-full">
    <PromptSchemaPanel
      :model-value="promptFormData"
      class="w-1/2 border-r border-slate-200"
      @submit="$emit('submit-prompt')"
    />

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
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import AgentPreviewPanel from '@auraflux/design-system/components/organisms/panels/AgentPreviewPanel.vue';
import PromptSchemaPanel from '@auraflux/design-system/components/organisms/panels/PromptSchemaPanel.vue';

defineProps<{
  promptFormData?: any;
  variables?: any[];
  hasOutputSchema?: boolean;
  isSchemaValid?: boolean;
  responseOutput?: any;
  rawMarkdownOutput?: string;
  metrics?: any;
  isExecuting?: boolean;
}>();

defineEmits(['submit-prompt', 'run-test', 'update:variable-values']);
</script>