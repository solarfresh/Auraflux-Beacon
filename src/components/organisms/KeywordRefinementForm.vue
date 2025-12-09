<template>
  <div class="space-y-6 p-6">
    <Text tag="h2" size="2xl" weight="bold" color="gray-900">
      Refine Core Keyword
    </Text>
    <Text tag="p" size="md" color="gray-600">
      Edit the keyword below for precision, then lock it to finalize your topic scope. Draft keywords will not be used for initial resource retrieval.
    </Text>

    <div class="space-y-2">
      <Text tag="label" size="sm" weight="medium" color="gray-700" for="keyword-input">
        Keyword Text
      </Text>
      <Textarea
        id="keyword-input"
        v-model="draftText"
        :rows="1"
        :size="'md'"
        placeholder="Enter a precise keyword or phrase"
      />
    </div>

    <div class="flex justify-between items-center p-3 rounded-lg"
         :class="isLocked ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50 border border-gray-200'">
      <Text tag="span" size="sm" weight="medium" :color="isLocked ? 'indigo-700' : 'gray-600'">
        Current Status: <span class="font-bold">{{ isLocked ? 'LOCKED' : 'DRAFT' }}</span>
      </Text>
      <Icon :name="isLocked ? 'LockClosed' : 'LockOpen'" type="solid" size="sm" :color="isLocked ? 'indigo-600' : 'gray-400'" />
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <Button variant="secondary" @click="emit('close-modal')">
        Cancel
      </Button>

      <Button
        @click="handleUpdateAndLock"
        :disabled="!isUpdateEnabled"
        :variant="isLocked ? 'tertiary' : 'primary'"
      >
        <Icon :name="isLocked ? 'PencilSquare' : 'LockClosed'" type="solid" size="sm" />
        {{ isLocked ? 'Update Text' : 'Save & Lock Keyword' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue'; // The Atom component
import type { TopicKeyword } from '@/interfaces/workflow'; // Assuming TopicKeyword type exists

// --- Props ---
const props = defineProps<{
  /** The index of the keyword being edited in the main array. Crucial for updating the store. */
  keywordIndex: number;
  /** The current data of the keyword being edited (passed for convenience). */
  initialKeyword: TopicKeyword;
}>();

// --- Emits ---
const emit = defineEmits<{
  /** Emitted when the user confirms the update and implicitly locks the keyword. */
  (e: 'keywordUpdate', payload: { index: number, newText: string }): void;
  /** Emitted to close the modal, handled by the parent component. */
  (e: 'close-modal'): void;
}>();

// --- State ---
// Local state for editing the text
const draftText = ref(props.initialKeyword.text);

// Watcher to reset draft text if the index or initial keyword changes externally
watch(() => props.initialKeyword.text, (newText) => {
    draftText.value = newText;
});

// --- Computed ---

/** Checks if the current keyword is already locked. */
const isLocked = computed(() => props.initialKeyword.status === 'LOCKED');

/** Checks if the save button should be enabled (text has changed and is not empty). */
const isUpdateEnabled = computed(() => {
    return draftText.value.trim() !== '' && draftText.value.trim() !== props.initialKeyword.text;
});

// --- Methods ---

/** Handles the final update and lock action. */
function handleUpdateAndLock() {
  const text = draftText.value.trim();

  if (!isUpdateEnabled.value) {
      console.warn('Keyword text must be changed to update.');
      return;
  }

  // 1. Emit the update event with the index and new text
  // The parent component/store is responsible for setting the status to 'LOCKED'
  emit('keywordUpdate', {
      index: props.keywordIndex,
      newText: text
  });

  // 2. Close the modal
  emit('close-modal');
}
</script>