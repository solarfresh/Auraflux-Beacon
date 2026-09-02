<template>
  <VBox
    tag="section"
    surface="solid"
    intent="neutral"
    padding="none"
    class="flex flex-col h-full shadow-md"
  >
    <!-- Section Header Bar -->
    <VBox
      padding="none"
      border="bottom"
      surface="solid"
      class="shrink-0 pt-6 px-6 pb-4"
    >
      <VSectionHeader
        title="Embeddings & RRF Hybrid Config"
        icon="Sliders"
        size="md"
        weight="bold"
      />
    </VBox>

    <!-- Scrollable Form Body -->
    <VBox class="flex-1 p-6 overflow-y-auto">
      <VForm gap="lg" @submit="handleSubmit">

        <!-- SECTION 1: Index-Bound Settings (Provider & Model Selection) -->
        <VBox
          intent="warning"
          surface="soft"
          padding="md"
          rounded="lg"
          border="all"
          class="space-y-4"
        >
          <VCluster justify="between" align="center">
            <VCluster gap="xs" align="center">
              <VIcon name="ExclamationTriangle" class="w-4 h-4" />
              <VTypography size="xs" weight="bold" class="uppercase">
                Initial Core Config (Re-index Required)
              </VTypography>
            </VCluster>
            <VBadge size="xs">Index Binding</VBadge>
          </VCluster>

          <!-- Provider & Embedding Model (Grid Layout / Provider-First) -->
          <VGrid cols="2" gap="sm">
            <!-- Provider Selector -->
            <VFormField label="Embedding Provider">
              <template #default="{ id }">
                <VSelect
                  :id="id"
                  :model-value="formData.providerId"
                  size="sm"
                  class="text-xs"
                  @update:model-value="handleProviderChange"
                >
                  <option
                    v-for="provider in providers"
                    :key="provider.value"
                    :value="provider.value"
                  >
                    {{ provider.label }}
                  </option>
                </VSelect>
              </template>
            </VFormField>

            <!-- Embedding Model Selector (Filtered by Provider) -->
            <VFormField label="Embedding Model">
              <template #default="{ id }">
                <VSelect
                  :id="id"
                  :model-value="formData.modelFamilyId"
                  :disabled="!formData.providerId"
                  size="sm"
                  class="text-xs"
                  @update:model-value="handleModelChange"
                >
                  <option value="" disabled>Select Model...</option>
                  <option
                    v-for="model in availableModels"
                    :key="model.value"
                    :value="model.value"
                  >
                    {{ model.label }}
                  </option>
                </VSelect>
              </template>
            </VFormField>
          </VGrid>

          <VGrid cols="2" gap="sm">
            <!-- Dimensions (Auto-filled & Readonly) -->
            <VFormField label="Dimensions">
              <template #default="{ id }">
                <VInput
                  :id="id"
                  v-model="formData.dimensions"
                  size="sm"
                  disabled
                  class="font-mono bg-gray-100"
                />
              </template>
            </VFormField>

            <!-- Sub-query Candidate Top-N -->
            <VFormField label="Candidate Top-N" description="Pre-RRF pool per pipeline">
              <template #default="{ id }">
                <VInput
                  :id="id"
                  type="number"
                  v-model.number="formData.candidateTopN"
                  size="sm"
                  class="font-mono"
                />
              </template>
            </VFormField>
          </VGrid>
        </VBox>

        <!-- SECTION 2: OpenSearch RRF Dynamic Tuning (Query Time) -->
        <VStack gap="md" class="w-full">
          <VCluster justify="between" align="center">
            <VTypography size="xs" weight="bold" class="uppercase">
              OpenSearch RRF Tuning (Real-time)
            </VTypography>
            <VBadge intent="success" size="xs">Query-Time Active</VBadge>
          </VCluster>

          <!-- RRF Smoothing Factor (k-factor) -->
          <VFormField label="RRF Smoothing Constant (k-factor)">
            <template #hint>
              <VTypography size="xs" class="font-mono font-bold">
                {{ formData.kFactor }}
              </VTypography>
            </template>
            <template #default="{ id }">
              <VSlider
                :id="id"
                v-model.number="formData.kFactor"
                :min="1"
                :max="100"
                :step="1"
              />
            </template>
          </VFormField>

          <!-- Pipeline Weights Box -->
          <VBox intent="neutral" surface="soft" padding="md" rounded="lg" border="all" class="space-y-3">
            <VTypography size="xs" weight="bold">Weighted RRF Rank Weights</VTypography>

            <!-- Vector Weight -->
            <VFormField label="Vector Rank Weight">
              <template #hint>
                <VTypography size="xs" class="font-mono font-bold text-blue-600">
                  {{ formData.vectorWeight }}
                </VTypography>
              </template>
              <template #default="{ id }">
                <VSlider
                  :id="id"
                  v-model.number="formData.vectorWeight"
                  :min="0"
                  :max="2"
                  :step="0.1"
                />
              </template>
            </VFormField>

            <!-- BM25 Weight -->
            <VFormField label="BM25 Keyword Weight">
              <template #hint>
                <VTypography size="xs" class="font-mono font-bold text-emerald-600">
                  {{ formData.bm25Weight }}
                </VTypography>
              </template>
              <template #default="{ id }">
                <VSlider
                  :id="id"
                  v-model.number="formData.bm25Weight"
                  :min="0"
                  :max="2"
                  :step="0.1"
                />
              </template>
            </VFormField>
          </VBox>

          <!-- Final Top-K & Cutoff -->
          <VGrid cols="2" gap="sm">
            <VFormField label="Final Top-K">
              <template #default="{ id }">
                <VInput
                  :id="id"
                  type="number"
                  v-model.number="formData.topK"
                  size="sm"
                  class="font-mono"
                />
              </template>
            </VFormField>

            <VFormField label="Score Cutoff">
              <template #default="{ id }">
                <VInput
                  :id="id"
                  v-model="formData.scoreCutoff"
                  size="sm"
                  class="font-mono"
                  placeholder="0.0150"
                />
              </template>
            </VFormField>
          </VGrid>
        </VStack>

      </VForm>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VSlider from '@auraflux/design-system/components/atoms/forms/VSlider.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VGrid from '@auraflux/design-system/components/atoms/layout/VGrid.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VForm from '@auraflux/design-system/components/molecules/forms/VForm.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';

import type { EmbeddingModelOption, EmbeddingFormData, ProviderOption } from '@auraflux/design-system/interfaces/agents';

interface Props {
  providers?: ProviderOption[];
  embeddingModels?: EmbeddingModelOption[];
}

const props = withDefaults(defineProps<Props>(), {
  providers: () => [
    { label: 'OpenAI', value: 'openai' },
    { label: 'BAAI (HuggingFace)', value: 'baai' },
    { label: 'Cohere', value: 'cohere' },
  ],
  embeddingModels: () => [
    { label: 'text-embedding-3-small', value: 'text-embedding-3-small', providerId: 'openai', dimensions: 1536 },
    { label: 'text-embedding-3-large', value: 'text-embedding-3-large', providerId: 'openai', dimensions: 3072 },
    { label: 'bge-m3', value: 'bge-m3', providerId: 'baai', dimensions: 1024 },
    { label: 'embed-multilingual-v3.0', value: 'embed-multilingual-v3.0', providerId: 'cohere', dimensions: 1024 },
  ],
});

const formData = defineModel<EmbeddingFormData>({
  default: () => ({
    providerId: 'openai',
    modelFamilyId: 'text-embedding-3-small',
    dimensions: 1536,
    candidateTopN: 50,
    kFactor: 60,
    vectorWeight: 1.0,
    bm25Weight: 0.8,
    topK: 5,
    scoreCutoff: '0.0150',
  }),
});

const emit = defineEmits<{
  (e: 'submit', value: EmbeddingFormData): void;
}>();

const availableModels = computed(() => {
  return props.embeddingModels.filter((m) => m.providerId === formData.value.providerId);
});

const handleProviderChange = (providerVal: string) => {
  formData.value.providerId = providerVal;
  const firstModel = props.embeddingModels.find((m) => m.providerId === providerVal);
  if (firstModel) {
    formData.value.modelFamilyId = firstModel.value;
    formData.value.dimensions = firstModel.dimensions;
  } else {
    formData.value.modelFamilyId = '';
    formData.value.dimensions = 0;
  }
};

const handleModelChange = (modelVal: string) => {
  formData.value.modelFamilyId = modelVal;
  const selectedModel = props.embeddingModels.find((m) => m.value === modelVal);
  if (selectedModel) {
    formData.value.dimensions = selectedModel.dimensions;
  }
};

const handleSubmit = () => {
  emit('submit', { ...formData.value });
};
</script>