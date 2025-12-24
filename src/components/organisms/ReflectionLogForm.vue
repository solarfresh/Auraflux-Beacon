<template>
  <MasterDetailTemplate>
    <template #master-panel>
      <MasterListPanel
        title="Log Entries"
        :item-count="logEntries.length"
        :disable-new-entry="isEditing"
        @new-entry="handleNewEntry"
      >
        <template #list-items>
          <div v-if="logEntries.length > 0">
            <div v-for="entry in logEntries" :key="entry.id"
              :class="{
                'bg-indigo-50 border-indigo-300': selectedEntryId === entry.id,
                'hover:bg-gray-100': selectedEntryId !== entry.id
              }"
              class="p-3 mb-2 border border-gray-200 rounded-lg cursor-pointer transition duration-150"
              @click="handleSelectEntry(entry)">

              <Text tag="p" size="sm" weight="medium" :color="selectedEntryId === entry.id ? 'indigo-800' : 'gray-800'">
                {{ new Date(entry.updatedAt).toLocaleDateString() }}
                {{ new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                <span
                  v-if="entry.status === 'draft'"
                  class="ml-2 text-xs font-semibold text-orange-500"
                >
                  (Draft)
                </span>
              </Text>

              <Text tag="p" size="sm" color="gray-600" class="truncate italic mt-1">
                {{ entry.title || entry.content || "Empty Entry" }}
              </Text>
            </div>
          </div>
        </template>

        <template #empty-state>
          <p v-if="logEntries.length === 0" class="text-center text-gray-500 py-10">
            No reflection entries found. Click 'New Entry' to begin.
          </p>
        </template>
      </MasterListPanel>
    </template>

    <template #detail-panel>
      <ReflectionLogEditorPanel
        :current-draft="currentDraft"
        :original-entry="originalEntry"
        :is-editing="isEditing"
        :is-new-entry="isNewEntry"
        @save="handleSave"
        @cancel-edit="handleCancelEdit"
        @enable-edit="isEditing = true"
      />
    </template>
  </MasterDetailTemplate>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
import MasterDetailTemplate from '@/components/templates/MasterDetailTemplate.vue';
import MasterListPanel from '@/components/molecules/MasterListPanel.vue';
import ReflectionLogEditorPanel from '@/components/organisms/ReflectionLogEditorPanel.vue';
import type { ReflectionLogEntry } from '@/interfaces/workflow';
import { useInitiativeStore } from '@/stores/initiation';
import { computed, ref, watch } from 'vue';

const initiativeStore = useInitiativeStore();

// --- PROPS & EMITS ---
const props = defineProps<{
  /** Initial list of log entries loaded from the store/API. */
  initialEntries: ReflectionLogEntry[];
}>();

const emit = defineEmits<{
  /** Event to request the modal closure. */
  (e: 'close-modal'): void;
  /** Event to persist the entry (new or updated) to the backend/store. */
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

// Flag indicating if we are in 'edit' mode for an existing entry (used to control input state)
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


// --- WATCHERS ---

// Watch the prop changes (e.g., if parent component fetches new data)
watch(() => props.initialEntries, (newEntries) => {
    logEntries.value = newEntries;
}, { deep: true });


// --- METHODS (Business Logic) ---

/**
 * Handles selecting an existing entry from the list.
 * @param entry The entry object clicked in the history list.
 */
function handleSelectEntry(entry: ReflectionLogEntry) {
  // Confirmation check before switching entries if changes are pending
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
  // Confirmation check before starting new entry if changes are pending
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
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    title: '',
    content: '',
    entryType: 'UNCATEGORIZED_DRAFT',
    status: 'draft',
  };
}

/** * Handles saving the current draft (either as 'draft' or 'committed').
 * This method is called from the Detail Panel via the 'save' event.
 */
function handleSave(targetStatus: 'draft' | 'commit') {
  if (!currentDraft.value || !currentDraft.value.content.trim()) {
    alert("Reflection content cannot be empty.");
    return;
  }

  initiativeStore.createOrUpdateReflection(
    currentDraft.value.id,
    currentDraft.value.title,
    currentDraft.value.content,
    targetStatus === 'commit' ? 'committed' : 'draft',
  );

  // Close the modal if committed, or stay and reset if just a draft save
  if (targetStatus === 'commit') {
    emit('close-modal');
  } else {
    // Re-select the saved entry and disable editing
    currentDraft.value.updatedAt = new Date().toISOString();
    isEditing.value = false;
  }
}

/** * Handles canceling the edit on an existing entry.
 * This method is called from the Detail Panel via the 'cancel-edit' event.
 */
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

// NOTE: The handleCancel logic for closing the entire modal should ideally be
// placed on the FullScreenModalTemplate or a dedicated close button if needed.
// However, the check is kept here for completeness, assuming a final close step
// might need validation.

// --- LIFECYCLE / INITIALIZATION ---
// (Optional: Implement logic to automatically select the latest entry on mount)
</script>

<style scoped>
/* Scoped styles kept minimal, relying on utility classes in the sub-components. */
</style>