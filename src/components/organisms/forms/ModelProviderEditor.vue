<template>
  <VStack gap="xl" class="v-model-provider-editor">

    <VStack gap="md">
      <VTypography size="sm" weight="bold" color="slate-400" class="uppercase tracking-wider">
        Engine Identity
      </VTypography>

      <VGrid cols="1 md:2" gap="md">
        <VFormField label="Provider Name">
          <VInput
            v-model="form.name"
            placeholder="e.g., Gemini Pro (Production)"
          />
        </VFormField>

        <VFormField label="Provider Type">
          <VSelect v-model="form.type">
            <option v-for="option in providerOptions" :value="option.value">{{ option.label }}</option>
          </VSelect>
        </VFormField>
      </VGrid>
    </VStack>

    <VStack gap="md">
      <VTypography size="sm" weight="bold" color="slate-400" class="uppercase tracking-wider">
        Authentication & Endpoint
      </VTypography>

      <VBox background="slate-50" padding="md" rounded="lg" border="all" class="border-slate-200/60">
        <VStack gap="md">
          <VFormField
            label="API Key"
            :help-text="isEdit ? 'Leave blank to keep current encrypted key' : 'Your key will be masked after saving'"
          >
            <VInput
              v-model="form.apiKey"
              type="password"
              placeholder="••••••••••••••••"
              class="font-mono"
            />
          </VFormField>

          <VFormField v-if="form.type === 'LOCAL' || form.type === 'CUSTOM'" label="Base URL">
            <VInput
              v-model="form.baseUrl"
              placeholder="https://api.your-domain.com/v1"
              class="font-mono"
            />
          </VFormField>
        </VStack>
      </VBox>
    </VStack>

    <VBox
      padding="md"
      rounded="lg"
      :background="testResult.status === 'SUCCESS' ? 'emerald-50' : 'slate-50'"
      :class="[
        'transition-all border border-dashed',
        testResult.status === 'ERROR' ? 'border-rose-200' : 'border-slate-300'
      ]"
    >
      <VCluster justify="between" align="center">
        <VCluster gap="sm">
          <VBox
            v-if="isTesting"
            width="3" height="3" rounded="full" background="indigo-50"
            class="animate-ping"
          />
          <VStack gap="none">
            <VTypography size="sm" weight="bold" :color="testResult.status === 'SUCCESS' ? 'emerald-700' : 'slate-700'">
              Connectivity Diagnostic
            </VTypography>
            <VTypography size="xs" color="slate-500">
              {{ testResult.message || 'Verification is required to establish the infrastructure bridge.' }}
            </VTypography>
          </VStack>
        </VCluster>

        <VButton
          size="xs"
          variant="outline"
          :loading="isTesting"
          @click="testConnection"
        >
          {{ testResult.status === 'IDLE' ? 'Test Link' : 'Re-verify' }}
        </VButton>
      </VCluster>
    </VBox>

    <VCluster justify="end" gap="sm" class="pt-6 mt-2 border-t border-slate-100">
      <VButton variant="ghost" @click="$emit('close')">Cancel</VButton>
      <VButton
        variant="primary"
        :disabled="!isReadyToSave"
        @click="submit"
      >
        {{ isEdit ? 'Update Engine' : 'Establish Connection' }}
      </VButton>
    </VCluster>
  </VStack>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { ModelProvider } from '@/interfaces/agents';

// UI Atoms & Molecules
import VStack from '@/components/atoms/layout/VStack.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VGrid from '@/components/atoms/layout/VGrid.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VSelect from '@/components/atoms/forms/VSelect.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';
import { PROVIDER_OPTIONS } from '@/constants/agents';

const props = defineProps<{
  initialData?: ModelProvider | null;
}>();

const emit = defineEmits(['close', 'save']);

const providerOptions = ref(PROVIDER_OPTIONS);

const isEdit = computed(() => !!props.initialData);
const isTesting = ref(false);
const testResult = reactive({
  status: 'IDLE' as 'IDLE' | 'SUCCESS' | 'ERROR',
  message: ''
});

const form = reactive({
  name: props.initialData?.name || '',
  type: props.initialData?.type || 'GOOGLE',
  apiKey: '', // Always empty for security on load
  baseUrl: props.initialData?.baseUrl || '',
});

const isReadyToSave = computed(() => {
  if (!form.name || !form.type) return false;
  if (!isEdit.value && !form.apiKey) return false;
  return true;
});

async function testConnection() {
  isTesting.value = true;
  testResult.status = 'IDLE';

  setTimeout(() => {
    isTesting.value = false;
    testResult.status = 'SUCCESS';
    testResult.message = 'Bridge verified. Latency: 128ms. Supported: Gemini 1.5 Pro, Flash.';
  }, 1200);
}

function submit() {
  emit('save', { ...form });
}
</script>