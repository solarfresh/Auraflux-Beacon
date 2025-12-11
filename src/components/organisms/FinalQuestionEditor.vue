<template>
  <div class="space-y-6 p-6">
    <Text tag="h2" size="2xl" weight="bold" color="gray-900">
      Final Research Question Statement
    </Text>
    <Text tag="p" size="md" color="gray-600">
      This is the definitive research question that will guide all subsequent Exploration and Formulation phases. Please review, refine, and confirm below.
    </Text>

    <div class="space-y-2">
      <Text tag="label" size="sm" weight="medium" color="gray-700" for="final-question-input">
        Final Statement
      </Text>

      <Textarea
        id="final-question-input"
        v-model="draftQuestion"
        :rows="4"
        :placeholder="'Enter your final, well-defined research question here.'"
        :class="{ 'border-red-500': hasError }"
      />

      <p v-if="hasError" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </div>

    <div class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg space-y-2">
      </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <Button variant="secondary" @click="emit('close-modal')">
        Cancel
      </Button>
      <Button :disabled="!isSaveEnabled" @click="handleSaveAndLock">
        <Icon name="LockClosed" type="solid" size="sm" />
        Confirm & Save Question
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import type { FeasibilityStatus } from '@/interfaces/initiation';
import { computed, ref, watch } from 'vue';

// --- Props ---
const props = defineProps<{
  /** The current question statement (passed from store). */
  initialQuestion: string;
  /** The current stability score for real-time feedback. */
  stabilityScore: number;
  /** The current feasibility status for warning/confirmation. */
  feasibilityStatus: FeasibilityStatus;
}>();

// --- Emits ---
const emit = defineEmits<{
  /** Emitted when the user confirms the question. */
  (e: 'questionUpdate', newText: string): void;
  /** Emitted to close the modal, typically handled by the parent. */
  (e: 'close-modal'): void;
}>();

// --- State ---
// Initialize draft with the question passed from props
const draftQuestion = ref(props.initialQuestion);
const hasError = ref(false);
const errorMessage = ref('');

// --- Computed ---

/** Checks if the save button should be enabled. */
const isSaveEnabled = computed(() => {
    // Requires question to be non-empty and different from initial, or high score
    return draftQuestion.value.trim() !== '' && draftQuestion.value.trim() !== props.initialQuestion;
});

// --- Watcher (for external changes to initial question) ---
watch(() => props.initialQuestion, (newVal) => {
  draftQuestion.value = newVal;
});


// --- Methods ---

/** Handles the final save and lock action. */
function handleSaveAndLock() {
  const text = draftQuestion.value.trim();

  // Basic validation check
  if (text.length < 10) {
    hasError.value = true;
    errorMessage.value = 'The question statement is too short; please ensure it is a complete, descriptive sentence.';
    return;
  }

  hasError.value = false;
  errorMessage.value = '';

  // 1. Emit the update event
  emit('questionUpdate', text);

  // 2. Close the modal
  emit('close-modal');

  // NOTE: The actual transition to the next ISP phase ('EXPLORATION')
  // should be handled by the parent component (InitiationPage.vue) after receiving this update,
  // potentially triggered by an ActionBar click *after* the question is finalized.
}
</script>