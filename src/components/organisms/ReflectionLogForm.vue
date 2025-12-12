<template>
  <div class="flex h-full min-h-[700px]">

    <div class="w-1/3 max-w-sm border-r border-gray-200 p-4 bg-gray-50 flex flex-col overflow-y-auto">

      <div class="flex justify-between items-center mb-4 sticky top-0 bg-gray-50 pt-1 pb-3 z-10 border-b border-gray-100">
        <Text tag="h2" size="xl" weight="bold" color="gray-900">Log Entries ({{ logEntries.length }})</Text>
        <Button variant="primary" size="sm" @click="handleNewEntry" :disabled="isEditing">
          <Icon name="Plus" type="outline" size="sm" /> New Entry
        </Button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-for="entry in logEntries" :key="entry.id"
              :class="{
                'bg-indigo-50 border-indigo-300': selectedEntryId === entry.id,
                'hover:bg-gray-100': selectedEntryId !== entry.id
              }"
              class="p-3 mb-2 border border-gray-200 rounded-lg cursor-pointer transition duration-150"
              @click="handleSelectEntry(entry)">

          <Text tag="p" size="sm" weight="medium" :color="selectedEntryId === entry.id ? 'indigo-800' : 'gray-800'">
            {{ new Date(entry.timestamp).toLocaleDateString() }} {{ new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </Text>

          <Text tag="p" size="sm" color="gray-600" class="truncate italic mt-1">
            {{ entry.content || "Empty Entry" }}
          </Text>
        </div>
        <p v-if="!logEntries.length" class="text-center text-gray-500 py-10">
          No reflection entries found. Start a new one!
        </p>
      </div>
    </div>

    <div class="w-2/3 p-6 overflow-y-auto bg-white">

      <div v-if="currentDraft" class="flex flex-col h-full">
        <Text tag="h2" size="2xl" weight="bold" color="gray-900" class="mb-6">
          {{ isNewEntry ? 'Create New Reflection' : 'Edit Reflection' }}
        </Text>

        <div class="flex justify-between items-center text-sm text-gray-500 mb-4 pb-2 border-b border-gray-100">
          <Text tag="span" weight="medium">
            Entry Status: <span class="font-semibold text-green-600">Committed</span>
          </Text>
          <Text tag="span" weight="medium">
            Last Updated: {{ new Date(currentDraft.timestamp).toLocaleString() }}
          </Text>
        </div>

        <Textarea
          v-model="currentDraft.content"
          :rows="15"
          :placeholder="editorPlaceholder"
          :disabled="!isEditing && !isNewEntry"
          class="mb-6 flex-1 min-h-[300px]"
        />

        <div class="flex justify-between items-center border-t border-gray-200 pt-4 mt-auto">

          <Button v-if="!isNewEntry && !isEditing" variant="secondary" @click="isEditing = true">
              <Icon name="PencilSquare" type="outline" size="sm" /> Enable Editing
          </Button>

          <Button v-else-if="!isNewEntry && isEditing" variant="secondary" @click="handleCancelEdit">
              Cancel Edit
          </Button>

          <div class="flex space-x-3 ml-auto">
              <Button variant="tertiary" @click="handleSave('draft')" :disabled="!isDirty">
                  Save Draft
              </Button>
              <Button variant="primary" @click="handleSave('commit')" :disabled="!isDirty">
                  Commit & Close
              </Button>
          </div>
        </div>
      </div>

      <div v-else class="text-center p-20 text-gray-500">
        <Icon name="DocumentText" type="outline" size="lg" class="mx-auto mb-4" />
        <Text tag="p" size="lg">Select a historical entry or click "New Entry" to start your reflection.</Text>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue'; // Assuming Textarea component exists

// --- INTERFACE DEFINITION ---
/** Defines the structure for a single Reflection Log entry. */
interface ReflectionLogEntry {
  id: string;
  timestamp: string; // ISO string date
  content: string;
  status: 'draft' | 'committed';
}

// --- PROPS & EMITS ---
const props = defineProps<{
  // Placeholder: Pass existing log entries from the store
  initialEntries: ReflectionLogEntry[];
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
  // Placeholder: Event to save or commit the new/updated entry to the store/API
  (e: 'save-log', entry: ReflectionLogEntry): void;
}>();


// --- STATE MANAGEMENT ---

// Log entries are stored in a reactive variable, initialized from props
const logEntries = ref<ReflectionLogEntry[]>(props.initialEntries || []);

// ID of the currently selected entry in the list
const selectedEntryId = ref<string | null>(null);

// Original entry data, used for comparison to check for 'dirty' state and for canceling edits
const originalEntry = ref<ReflectionLogEntry | null>(null);

// The draft object being actively edited/created in the right panel
const currentDraft = ref<ReflectionLogEntry | null>(null);

// Flag indicating if we are in 'edit' mode for an existing entry
const isEditing = ref(false);


// --- COMPUTED PROPERTIES ---

/** Determines if the current view is for creating a brand new entry. */
const isNewEntry = computed(() => !selectedEntryId.value && !!currentDraft.value);

/** Checks if the current draft content is different from the original content. */
const isDirty = computed(() => {
  if (!currentDraft.value || !originalEntry.value) return false;
  // Check content difference only
  return currentDraft.value.content.trim() !== originalEntry.value.content.trim();
});

/** Provides a contextual placeholder for the Textarea. */
const editorPlaceholder = computed(() => {
  return "Document your decisions, challenges encountered, and insights gained during the research process...";
});

// --- WATCHERS ---

// Watch the prop changes (e.g., if parent component fetches new data)
watch(() => props.initialEntries, (newEntries) => {
    logEntries.value = newEntries;
}, { deep: true });


// --- METHODS ---

/**
 * Handles selecting an existing entry from the list.
 * @param entry The entry object clicked in the history list.
 */
function handleSelectEntry(entry: ReflectionLogEntry) {
  // If user is editing a different entry, confirm before switching
  if (isEditing.value && isDirty.value && selectedEntryId.value !== entry.id) {
    if (!window.confirm("You have unsaved changes. Discard and switch entry?")) {
      return;
    }
  }

  selectedEntryId.value = entry.id;
  // Deep copy the selected entry for draft editing
  originalEntry.value = JSON.parse(JSON.stringify(entry));
  currentDraft.value = JSON.parse(JSON.stringify(entry));
  isEditing.value = false; // Start in read-only mode for existing entries
}

/** Handles switching the view to create a new, blank entry. */
function handleNewEntry() {
  if (isEditing.value && isDirty.value) {
    if (!window.confirm("You have unsaved changes. Discard and start a new entry?")) {
      return;
    }
  }

  // Reset state and set up a new draft object
  selectedEntryId.value = null;
  isEditing.value = true;
  originalEntry.value = null;
  currentDraft.value = {
    id: `new-${Date.now()}`, // Temporary ID
    timestamp: new Date().toISOString(),
    content: '',
    status: 'draft',
  };
}

/** Handles saving the current draft (either as 'draft' or 'committed'). */
function handleSave(targetStatus: 'draft' | 'commit') {
  if (!currentDraft.value || !currentDraft.value.content.trim()) {
    alert("Reflection content cannot be empty.");
    return;
  }

  // 1. Update the status and timestamp
  const finalEntry: ReflectionLogEntry = {
    ...currentDraft.value,
    timestamp: new Date().toISOString(), // Update timestamp on save
    status: targetStatus === 'commit' ? 'committed' : 'draft',
    content: currentDraft.value.content.trim(),
  };

  // 2. Emit the event to the parent/store/API
  emit('save-log', finalEntry);

  // 3. Update local state if it was a new entry (optional: API should handle ID)
  if (isNewEntry.value) {
    logEntries.value.unshift(finalEntry); // Add to local list (optimistic update)
  }

  // 4. Close the modal if committed, or stay and reset if just a draft save
  if (targetStatus === 'commit') {
    emit('close-modal');
  } else {
    // Re-select the saved entry and disable editing
    selectedEntryId.value = finalEntry.id;
    originalEntry.value = finalEntry;
    currentDraft.value = finalEntry;
    isEditing.value = false;
  }
}

/** Handles canceling the edit on an existing entry. */
function handleCancelEdit() {
  if (isDirty.value) {
    if (window.confirm("Discard changes to the current entry?")) {
      // Revert the draft back to the original saved state
      currentDraft.value = JSON.parse(JSON.stringify(originalEntry.value));
      isEditing.value = false;
    }
  } else {
    isEditing.value = false;
  }
}

/** Handles general cancellation (closing the modal). */
function handleCancel() {
  if (isEditing.value && isDirty.value) {
    if (!window.confirm("You have unsaved changes. Are you sure you want to exit and discard them?")) {
      return;
    }
  }
  emit('close-modal');
}


// --- LIFECYCLE / INITIALIZATION ---
// On component mount, handle potential initial selection (e.g., if parent passed an ID)
// For simplicity, we initialize with no selection, waiting for user interaction.
</script>

<style scoped>
/* Scoped styles can be added here if needed, but Tailwind is generally preferred. */
/* Ensures the main content area grows and allows internal scrolling */
.flex-1 {
  flex-grow: 1;
}
</style>