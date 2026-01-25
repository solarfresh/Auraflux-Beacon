<template>
  <VBox tag="section" background="white" class="flex flex-col h-full overflow-hidden">

    <VBox padding="lg" border="bottom" class="flex-shrink-0">
      <VCluster gap="md" align="center">
        <VBox padding="sm" background="indigo-50" rounded="lg" class="text-indigo-600">
          <VIcon name="Flag" size="md" />
        </VBox>
        <VStack gap="none">
          <VTypography tag="h2" size="2xl" weight="bold" color="gray-900">
            Final Research Question
          </VTypography>
          <VTypography size="sm" color="gray-500" class="max-w-xl">
            This definitive statement will guide your subsequent exploration and formulation phases.
          </VTypography>
        </VStack>
      </VCluster>
    </VBox>

    <VBox tag="main" padding="lg" class="flex-1 overflow-y-auto stable-gutter">
      <VStack gap="xl">

        <VFormField
          id="final-question-input"
          label="Research Statement"
        >
          <template #hint>
            <VTypography size="xs" color="gray-400">
              {{ draftQuestion.length }} / 500 characters
            </VTypography>
          </template>

          <template #default="{ id }">
            <VStack gap="xs">
              <VTextarea
                :id="id"
                v-model="draftQuestion"
                :rows="6"
                placeholder="Enter your final, well-defined research question here..."
                class="w-full text-lg leading-relaxed font-serif p-4"
                :class="{ 'border-red-500 focus:ring-red-500': hasError }"
              />
              <VCluster v-if="hasError" gap="xs" align="center" class="text-red-600">
                <VIcon name="ExclamationTriangle" size="xs" />
                <VTypography size="xs">{{ errorMessage }}</VTypography>
              </VCluster>
            </VStack>
          </template>
        </VFormField>

        <VStack gap="md">
          <VTypography tag="h4" size="xs" weight="bold" class="uppercase tracking-widest text-gray-400">
            Current Context Feedback
          </VTypography>

          <VBox padding="md" background="gray-50" rounded="xl" border="all">
            <div class="grid grid-cols-2 gap-8">
              <VStack gap="xs">
                <VTypography size="xs" color="gray-500">Stability Score</VTypography>
                <VCluster gap="sm" align="center">
                  <div
                    class="w-2.5 h-2.5 rounded-full"
                    :class="stabilityScore < 7 ? 'bg-amber-400' : 'bg-emerald-400'"
                  />
                  <VTypography size="md" weight="bold" color="gray-900">
                    {{ stabilityScore }} / 10
                  </VTypography>
                </VCluster>
              </VStack>

              <VStack gap="xs">
                <VTypography size="xs" color="gray-500">Resource Feasibility</VTypography>
                <VBadge :variant="feasibilityStatus === 'HIGH' ? 'emerald' : 'amber'" size="xs">
                  {{ feasibilityStatus }}
                </VBadge>
              </VStack>
            </div>
          </VBox>

          <VStatusCard
            v-if="stabilityScore < 7"
            variant="warning"
            icon-name="ExclamationCircle"
            title="Moderate Stability"
          >
            Consider if the question needs further narrowing before locking to ensure research quality.
          </VStatusCard>
        </VStack>
      </VStack>
    </VBox>

    <VBox padding="md" background="gray-50" border="top" class="flex-shrink-0">
      <VCluster justify="end" gap="md">
        <VButton variant="tertiary" @click="emit('close-modal')">
          Cancel
        </VButton>
        <VButton
          variant="primary"
          icon-name="LockClosed"
          :disabled="!isSaveEnabled"
          @click="handleSaveAndLock"
        >
          Confirm & Finalize Question
        </VButton>
      </VCluster>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FeasibilityStatus } from '@/interfaces/core';

// Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';

// Molecules
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VStatusCard from '@/components/molecules/indicators/VStatusCard.vue';

const props = defineProps<{
  initialValue: string;
  stabilityScore: number;
  feasibilityStatus: FeasibilityStatus;
}>();

const emit = defineEmits<{
  (e: 'questionUpdate', newText: string): void;
  (e: 'close-modal'): void;
}>();

const draftQuestion = ref(props.initialValue);
const hasError = ref(false);
const errorMessage = ref('');

const isSaveEnabled = computed(() => {
  const trimmed = draftQuestion.value.trim();
  return trimmed !== '' && trimmed.length >= 10;
});

watch(() => props.initialValue, (newVal) => (draftQuestion.value = newVal));

function handleSaveAndLock() {
  const text = draftQuestion.value.trim();
  if (text.length < 10) {
    hasError.value = true;
    errorMessage.value = 'Please provide a more descriptive research question.';
    return;
  }
  hasError.value = false;
  emit('questionUpdate', text);
  emit('close-modal');
}
</script>