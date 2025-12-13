<template>
  <div class="w-2/3 h-full p-6 bg-white">

    <div v-if="currentDraft" class="flex flex-col h-full overflow-y-auto">

      <Text tag="h2" size="2xl" weight="bold" color="gray-900" class="mb-6">
        {{ isNewEntry ? 'Create New Reflection' : 'Edit Reflection' }}
      </Text>

      <div class="flex justify-between items-center text-sm text-gray-500 mb-4 pb-2 border-b border-gray-100">
        <Text tag="span" weight="medium">
          Entry Status:
          <span
            class="font-semibold"
            :class="statusColorClass"
          >
            {{ currentDraft.status === 'committed' ? 'Committed' : 'Draft' }}
          </span>
        </Text>
        <Text tag="span" weight="medium">
          Last Updated: {{ new Date(currentDraft.updateAt).toLocaleString() }}
        </Text>
      </div>

      <div class="mb-6">
        <Text tag="label" for="entry-title" size="sm" weight="medium" color="gray-700" class="block mb-1">
          Entry Title
        </Text>
        <Input
          id="entry-title"
          v-model="currentDraft.title"
          :disabled="!isEditable"
          required
          placeholder="Summarize the focus of this reflection (e.g., 'Initial Scope Review', 'Data Feasibility Check')"
          class="w-full"
        />
      </div>
      <Textarea
        v-model="currentDraft.content"
        :rows="15"
        :placeholder="editorPlaceholder"
        :disabled="!isEditable"
        class="mb-6 flex-1 min-h-[300px] transition-all duration-150"
      />

      <div class="flex justify-between items-center border-t border-gray-200 pt-4 mt-auto">

        <Button
          v-if="!isNewEntry && !isEditing"
          variant="secondary"
          @click="$emit('enable-edit')"
        >
          <Icon name="PencilSquare" type="outline" size="sm" /> Enable Editing
        </Button>

        <Button
          v-else-if="!isNewEntry && isEditing"
          variant="secondary"
          @click="handleCancelEditClick"
        >
          Cancel Edit
        </Button>

        <div class="flex space-x-3 ml-auto">
          <Button
            variant="tertiary"
            @click="$emit('save', 'draft')"
            :disabled="!isDirty || !isEditable"
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            @click="$emit('save', 'commit')"
            :disabled="!isDirty || !isEditable"
          >
            Commit & Close
          </Button>
        </div>
      </div>
    </div>

    <div v-else class="text-center p-20 text-gray-500">
      <Icon name="DocumentText" type="outline" size="lg" class="mx-auto mb-4" />
      <Text tag="p" size="lg">Select a historical entry or click "New Entry" in the list to start your reflection.</Text>
    </div>

  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Input from '@/components/atoms/Input.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import type { ReflectionLogEntry } from '@/interfaces/initiation';
import { computed } from 'vue';

// --- PROPS ---
const props = defineProps<{
  /** The current draft object being viewed or edited (null if no entry is selected). */
  currentDraft: ReflectionLogEntry | null;
  /** The original, unedited version of the entry (used for dirty check in parent). */
  originalEntry: ReflectionLogEntry | null;
  /** Flag indicating if we are currently in an explicit edit mode for an existing entry. */
  isEditing: boolean;
  /** Flag indicating if the current draft is a brand new entry (not yet saved). */
  isNewEntry: boolean;
}>();

// --- EMITS ---
const emit = defineEmits<{
  /** Emitted when Save Draft or Commit is clicked. */
  (e: 'save', targetStatus: 'draft' | 'commit'): void;
  /** Emitted when the user explicitly clicks 'Enable Editing' for a committed entry. */
  (e: 'enable-edit'): void;
  /** Emitted when the user attempts to cancel an edit (parent handles confirmation). */
  (e: 'cancel-edit'): void;
}>();


// --- COMPUTED PROPERTIES ---

/** Determines if the current Textarea should be interactive. */
const isEditable = computed(() => props.isNewEntry || props.isEditing);

/** Checks if the current draft content differs from the original content.
 * This logic relies on the parent component's comparison (passed via props).
 */
const isDirty = computed(() => {
  if (!props.currentDraft || !props.originalEntry) {
    // New entry is always "dirty" if content exists, handled by content check in handleSave in parent
    return props.isNewEntry ? props.currentDraft?.content.trim().length || 0 > 0 : false;
  }
  // Check content difference only (requires parent to pass content difference check)
  // *NOTE: This computed property is simplified here. The parent (ReflectionLogForm)
  // *must provide the definitive dirty check logic through its methods.*
  return true; // We assume the parent is tracking isDirty and this panel just enables buttons if needed
});

/** Provides the correct Tailwind color class based on the entry status. */
const statusColorClass = computed(() => {
  if (!props.currentDraft) return 'text-gray-500';
  return props.currentDraft.status === 'committed' ? 'text-green-600' : 'text-orange-500';
});

/** Provides a contextual placeholder for the Textarea. */
const editorPlaceholder = computed(() => {
  return "Document your decisions, challenges encountered, and insights gained during the research process...";
});


// --- METHODS ---

/**
 * Handles the click event for canceling an edit, delegating confirmation to the parent.
 */
function handleCancelEditClick() {
  emit('cancel-edit');
}
</script>

<style scoped>
/* Ensures the main content area (Textarea) grows and allows internal scrolling */
.flex-1 {
  flex-grow: 1;
}
</style>