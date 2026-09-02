<template>
  <VBox padding="none" border="none" class="flex flex-1 w-full">
    <EmbeddingSearchConfigPanel
      :model-value="configData"
      :providers="providers"
      :embedding-models="embeddingModels"
      class="w-1/2 border-r border-slate-200"
      @update:model-value="(val: EmbeddingRrfConfigFormData) => $emit('update:configData', val)"
      @submit="(val: EmbeddingRrfConfigFormData) => $emit('submit-config', val)"
    />

    <HybridSearchPlaygroundPanel
      :query-text="queryText"
      :breakdown-data="breakdownData"
      :metrics="searchMetrics"
      :is-searching="isExecuting"
      class="w-1/2"
      @update:query-text="(val: string) => $emit('update:queryText', val)"
      @run-test="$emit('run-test')"
    />
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import EmbeddingSearchConfigPanel from '@auraflux/design-system/components/organisms/panels/EmbeddingSearchConfigPanel.vue';
import HybridSearchPlaygroundPanel, {
  type RankBreakdownItem,
  type SearchMetrics,
} from '@auraflux/design-system/components/organisms/panels/HybridSearchPlaygroundPanel.vue';

import type {
  EmbeddingModelOption,
  EmbeddingRrfConfigFormData,
  ProviderOption,
} from '@auraflux/design-system/interfaces/agents';

export interface EmbeddingBenchViewProps {
  configData?: EmbeddingRrfConfigFormData;
  providers?: ProviderOption[];
  embeddingModels?: EmbeddingModelOption[];
  queryText?: string;
  breakdownData?: RankBreakdownItem[];
  searchMetrics?: SearchMetrics;
  isExecuting?: boolean;
}

withDefaults(defineProps<EmbeddingBenchViewProps>(), {
  configData: undefined,
  providers: () => [],
  embeddingModels: () => [],
  queryText: '',
  breakdownData: () => [],
  searchMetrics: undefined,
  isExecuting: false,
});

defineEmits<{
  (e: 'update:configData', value: EmbeddingRrfConfigFormData): void;
  (e: 'submit-config', value: EmbeddingRrfConfigFormData): void;
  (e: 'update:queryText', value: string): void;
  (e: 'run-test'): void;
}>();
</script>