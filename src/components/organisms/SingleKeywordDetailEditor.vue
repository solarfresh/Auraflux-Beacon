<template>
  <div class="space-y-6 p-6">
    <Text tag="h2" size="2xl" weight="bold" color="gray-900">
      Refine Core Keyword
    </Text>
    <Text tag="p" size="md" color="gray-600">
      Edit the keyword's text below. Changes will only be saved when you click

      <Text tag="span" size="md" weight="bold" color="gray-900">
        Lock Keyword
      </Text>
       or
      <Text tag="span" size="md" weight="bold" color="gray-900">
        Put On Hold
      </Text>
      .
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
        :class="{ 'border-red-500': !draftText.trim() }"
      />
      <p v-if="!draftText.trim()" class="text-xs text-red-500">Keyword text cannot be empty.</p>
    </div>

    <div class="flex justify-between items-center p-3 rounded-lg border"
         :class="statusClasses">

      <Text tag="span" size="sm" weight="medium" :color="statusTextColor">
        Current Status: <span class="font-bold">{{ props.initialKeyword.entityStatus }}</span>
        <span v-if="isTextModified" class="text-xs text-red-500 italic ml-2">(Unsaved Text Changes)</span>
      </Text>

      <Icon :name="statusIcon" type="solid" size="sm" :color="statusIconColor" />
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">

      <Button variant="secondary" @click="handleCancelAndCheck">
        Cancel
      </Button>

      <Button
        v-if="!isLOCKED"
        variant="tertiary"
        @click="handleUnifiedSubmit('ON_HOLD')"
        :disabled="!draftText.trim()"
      >
        <Icon name="ArchiveBox" type="outline" size="sm" />
        Put On Hold
      </Button>

      <Button
        v-if="!isLOCKED"
        @click="handleUnifiedSubmit('LOCKED')"
        :disabled="!draftText.trim()"
        variant="primary"
      >
        <Icon name="LockClosed" type="solid" size="sm" />
        Lock Keyword
      </Button>

      <Button
        v-else
        @click="handleUnifiedSubmit(isTextModified ? 'LOCKED' : 'ON_HOLD')"
        :variant="isTextModified ? 'primary' : 'tertiary'"
      >
        <Icon :name="isTextModified ? 'DocumentCheck' : 'ArchiveBox'" type="solid" size="sm" />
        {{ isTextModified ? 'Save Text & Maintain Lock' : 'Unlock & Put On Hold' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import type { EntityStatus, ProcessedKeyword } from '@/interfaces/workflow';
import { useInitiativeStore } from '@/stores/initiation';
import { computed, ref, watch } from 'vue';

const initiativeStore = useInitiativeStore();

// --- Props & Emits ---
const props = defineProps<{
  /** The index of the keyword being edited. Crucial for updating the store. */
  keywordIndex: number;
  /** The current data of the keyword being edited (passed for convenience). */
  initialKeyword: ProcessedKeyword;
}>();

const emit = defineEmits<{
  /** Emitted when the user submits changes (text and status) through a commitment button. */
  (e: 'keywordUpdate', payload: { index: number, newText: string, newStatus: EntityStatus }): void;
  /** Emitted to close the modal. */
  (e: 'close-modal'): void;
}>();

// --- State ---
// Local state for editing the text (Deferred Save)
const draftText = ref(props.initialKeyword.label);

// Watcher to reset draft text if the initial keyword changes externally
watch(() => props.initialKeyword.label, (newText) => {
  draftText.value = newText;
});

const keywordId = computed(() => props.initialKeyword.id);

// --- Computed Properties for Status Management and UI ---

const isLOCKED = computed(() => props.initialKeyword.entityStatus === 'LOCKED');
const isON_HOLD = computed(() => props.initialKeyword.entityStatus === 'ON_HOLD');

/** Checks if the local text is different from the initial text. */
const isTextModified = computed(() => {
  return draftText.value.trim() !== props.initialKeyword.label;
});

/** Tailwind classes for the status box based on the current keyword status. */
const statusClasses = computed(() => {
  switch (props.initialKeyword.entityStatus) {
    case 'LOCKED': return 'bg-indigo-50 border-indigo-200';
    case 'AI_EXTRACTED': return 'bg-yellow-50 border-yellow-200';
    case 'ON_HOLD': return 'bg-gray-100 border-gray-300';
    case 'USER_DRAFT':
    default: return 'bg-white border-gray-200';
  }
});

/** Text color based on status. */
const statusTextColor = computed(() => {
  switch (props.initialKeyword.entityStatus) {
    case 'LOCKED': return 'indigo-700';
    case 'AI_EXTRACTED': return 'yellow-800';
    case 'ON_HOLD': return 'gray-500';
    case 'USER_DRAFT':
    default: return 'gray-800';
  }
});

/** Icon based on status. */
const statusIcon = computed(() => {
  switch (props.initialKeyword.entityStatus) {
    case 'LOCKED': return 'LockClosed';
    case 'AI_EXTRACTED': return 'Sparkles';
    case 'ON_HOLD': return 'ArchiveBox';
    case 'USER_DRAFT':
    default: return 'PencilSquare';
  }
});

/** Icon color based on status. */
const statusIconColor = computed(() => {
  switch (props.initialKeyword.entityStatus) {
    case 'LOCKED': return 'indigo-600';
    case 'AI_EXTRACTED': return 'yellow-600';
    case 'ON_HOLD': return 'gray-500';
    case 'USER_DRAFT':
    default: return 'gray-600';
  }
});


// --- Methods ---

async function handleUnifiedSubmit(targetStatus: EntityStatus) {
  const text = draftText.value.trim();
  if (!text) return; // Should be disabled by template logic, but safety check remains.

  let finalStatus = targetStatus;

  // Special logic for LOCKED state: If user is only saving text, the status remains LOCKED.
  if (isLOCKED.value && targetStatus === 'LOCKED') {
    // If locked and only saving modified text, keep it LOCKED
    finalStatus = 'LOCKED';
  } else if (isLOCKED.value && targetStatus === 'ON_HOLD') {
    // If locked and user clicks 'Unlock & Put On Hold'
    finalStatus = 'ON_HOLD';
  } else if (isON_HOLD.value && targetStatus === 'LOCKED') {
    // If on hold and user clicks 'Reactivate & Lock'
    finalStatus = 'LOCKED';
  }

  // For DRAFT/AI_EXTRACTED, targetStatus is already LOCKED or ON_HOLD, which is correct.
  initiativeStore.createOrUpdateTopicKeywords(keywordId.value, text, finalStatus);

  emit('close-modal');
}


function handleCancelAndCheck() {
  if (isTextModified.value) {
    // NOTE: In a production environment, this should trigger a custom confirmation dialog.
    const confirmation = window.confirm(
      'You have unsaved text changes. Are you sure you want to cancel and discard them?'
    );
    if (confirmation) {
      emit('close-modal');
    }
  } else {
    emit('close-modal');
  }
}
</script>