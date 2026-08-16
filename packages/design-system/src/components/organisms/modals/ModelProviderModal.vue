<template>
  <VModal
    :is-open="isOpen"
    :title="isNew ? 'Add Model Provider' : 'Edit Model Provider'"
    size="md"
    @close="$emit('cancel')"
  >
    <VForm @submit.prevent="handleSubmit" class="flex flex-col max-h-[80vh]">
      <VBox class="overflow-y-auto px-1 py-2 flex-1">
        <VStack gap="md" class="py-2">
          <!-- 1. Provider Name -->
          <VFormField
            label="Provider Name"
            description="User-defined label (e.g., 'Production Gemini')"
            required
          >
            <template #default="{ id }">
              <VInput
                :id="id"
                v-model="form.name"
                placeholder="e.g. Production OpenAI"
                required
              />
            </template>
          </VFormField>

          <!-- 2. Technical Type -->
          <VFormField
            label="Provider Type"
            description="Technical integration category"
            required
          >
            <template #default="{ id }">
              <VSelect
                :id="id"
                v-model="form.type"
                :options="providerTypeOptions"
              />
            </template>
          </VFormField>

          <!-- 3. API Key -->
          <VFormField
            label="API Key"
            :description="isNew ? 'API key will be masked after saving.' : `Current Fingerprint: ${form.apiKeyFingerprint || '••••'}`"
            :required="isNew"
          >
            <template #default="{ id }">
              <VInput
                :id="id"
                v-model="rawApiKey"
                type="password"
                :placeholder="isNew ? 'sk-...' : 'Leave blank to keep existing key'"
              />
            </template>
          </VFormField>

          <!-- 4. Custom Endpoint / Base URL -->
          <VFormField
            label="Base URL"
            description="Required for Local, Private LLMs, or Azure endpoints."
          >
            <template #default="{ id }">
              <VInput
                :id="id"
                v-model="form.baseUrl"
                placeholder="https://api.openai.com/v1"
              />
            </template>
          </VFormField>
        </VStack>

        <!-- Modal Footer Actions -->
        <VCluster justify="end" gap="sm" class="mt-6 pt-4 border-t border-slate-100">
          <VButton
            type="button"
            intent="neutral"
            surface="ghost"
            size="sm"
            @click="$emit('cancel')"
          >
            Cancel
          </VButton>
          <VButton
            type="submit"
            attention="primary"
            size="sm"
          >
            {{ isNew ? 'Create Provider' : 'Save Changes' }}
          </VButton>
        </VCluster>
      </VBox>
    </VForm>
  </VModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Design System Molecules & Form Controls
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VForm from '@auraflux/design-system/components/molecules/forms/VForm.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VModal from '@auraflux/design-system/components/molecules/indicators/VModal.vue';

import type { ModelProvider, ProviderType } from '@auraflux/design-system/interfaces/agents';

export interface ModelProviderModalProps {
  isOpen: boolean;
  provider?: ModelProvider | null;
  isNew?: boolean;
}

const props = withDefaults(defineProps<ModelProviderModalProps>(), {
  provider: null,
  isNew: true,
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', provider: ModelProvider): void;
}>();

const providerTypeOptions: { label: string; value: ProviderType }[] = [
  { label: 'OpenAI', value: 'OPENAI' },
  { label: 'Anthropic', value: 'ANTHROPIC' },
  { label: 'Google', value: 'GOOGLE' },
  { label: 'Custom', value: 'CUSTOM' },
];

const rawApiKey = ref('');
const form = ref<ModelProvider>({
  id: '',
  name: '',
  type: 'OPENAI',
  status: 'ONLINE',
  apiKeyFingerprint: '',
  baseUrl: '',
  latencyMs: null,
  lastVerifiedAt: new Date().toISOString(),
  supportedFamilies: [],
  activeAgentCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

watch(
  () => props.provider,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    } else {
      form.value = {
        id: '',
        name: '',
        type: 'OPENAI',
        status: 'ONLINE',
        apiKeyFingerprint: '',
        baseUrl: '',
        latencyMs: null,
        lastVerifiedAt: new Date().toISOString(),
        supportedFamilies: [],
        activeAgentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    rawApiKey.value = '';
  },
  { immediate: true }
);

const handleSubmit = () => {
  const updatedFingerprint = rawApiKey.value
    ? `••••${rawApiKey.value.slice(-4)}`
    : form.value.apiKeyFingerprint;

  emit('confirm', {
    ...form.value,
    apiKeyFingerprint: updatedFingerprint,
    updatedAt: new Date().toISOString(),
  });
};
</script>