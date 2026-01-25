<template>
  <div class="flex flex-col h-full bg-white">
    <header class="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Icon name="Flag" size="md" />
        </div>
        <Text tag="h2" size="2xl" weight="bold" color="gray-900">
          Final Research Question
        </Text>
      </div>
      <Text tag="p" size="sm" color="gray-500" class="max-w-xl">
        This definitive statement will guide your subsequent exploration and formulation phases.
        Ensure it is clear, researchable, and aligned with your findings.
      </Text>
    </header>

    <main class="flex-1 p-6 space-y-6 overflow-y-auto stable-gutter">
      <div class="space-y-2">
        <div class="flex justify-between items-end">
          <Text tag="label" size="sm" weight="bold" color="gray-700" for="final-question-input">
            Research Statement
          </Text>
          <Text size="xs" color="gray-400">
            {{ draftQuestion.length }} / 500 characters
          </Text>
        </div>

        <Textarea
          id="final-question-input"
          v-model="draftQuestion"
          :rows="6"
          :placeholder="'Enter your final, well-defined research question here...'"
          class="w-full text-lg leading-relaxed font-serif p-4"
          :class="{ 'border-red-500 focus:ring-red-500': hasError }"
        />

        <p v-if="hasError" class="flex items-center gap-1 text-sm text-red-600">
          <Icon name="ExclamationTriangle" size="xs" />
          {{ errorMessage }}
        </p>
      </div>

      <div class="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <Text tag="h4" size="xs" weight="bold" class="uppercase tracking-widest text-gray-400">
          Current Context Feedback
        </Text>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <Text size="xs" color="gray-500">Stability Score</Text>
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="stabilityScore < 7 ? 'bg-amber-400' : 'bg-emerald-400'"
              ></div>
              <Text size="sm" weight="bold" color="gray-900">{{ stabilityScore }} / 10</Text>
            </div>
          </div>
          <div class="space-y-1">
            <Text size="xs" color="gray-500">Resource Feasibility</Text>
            <Badge :variant="feasibilityStatus === 'HIGH' ? 'emerald' : 'amber'" size="xs">
              {{ feasibilityStatus }}
            </Badge>
          </div>
        </div>

        <div v-if="stabilityScore < 7" class="pt-2">
          <Text size="xs" color="amber-700" italic class="bg-amber-50 p-2 rounded border border-amber-100 block">
            Note: Your stability score is currently moderate. Consider if the question needs further narrowing before locking.
          </Text>
        </div>
      </div>
    </main>

    <footer class="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
      <div class="flex justify-end items-center gap-3">
        <Button variant="tertiary" size="md" @click="emit('close-modal')">
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          :disabled="!isSaveEnabled"
          @click="handleSaveAndLock"
        >
          <Icon name="LockClosed" size="sm" class="mr-2" />
          Confirm & Finalize Question
        </Button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FeasibilityStatus } from '@/interfaces/core';

// Atoms & Molecules
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import Badge from '@/components/atoms/Badge.vue';

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
    return draftQuestion.value.trim() !== '' &&
           draftQuestion.value.trim().length >= 10;
});

watch(() => props.initialValue, (newVal) => {
  draftQuestion.value = newVal;
});

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