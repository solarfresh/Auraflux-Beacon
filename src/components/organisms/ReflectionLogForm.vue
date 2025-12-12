<template>
  <MasterDetailLayout>
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
                {{ new Date(entry.timestamp).toLocaleDateString() }}
                {{ new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                <span
                  v-if="entry.status === 'draft'"
                  class="ml-2 text-xs font-semibold text-orange-500"
                >
                  (Draft)
                </span>
              </Text>

              <Text tag="p" size="sm" color="gray-600" class="truncate italic mt-1">
                {{ entry.content || "Empty Entry" }}
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

  </MasterDetailLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Text from '@/components/atoms/Text.vue';
import MasterDetailLayout from '@/components/layouts/MasterDetailLayout.vue';
import MasterListPanel from '@/components/molecules/MasterListPanel.vue';
import ReflectionLogEditorPanel from '@/components/organisms/ReflectionLogEditorPanel.vue';

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

const mockReflectionLogs: ReflectionLogEntry[] = [
  {
    id: 'ARFL-005',
    timestamp: '2025-12-12T10:00:00Z',
    content: 'Initial planning session completed. Decided to focus on the "Circular Economy" aspect first, as data feasibility seems higher there. Need to re-evaluate the scope after the first search iteration.',
    status: 'committed',
  },
  {
    id: 'ARFL-004',
    timestamp: '2025-12-11T16:30:00Z',
    content: 'Revised the central research question slightly. Changed "impact on global markets" to "impact on European Union policy" to make the scope manageable. This should improve the stability score.',
    status: 'committed',
  },
  {
    id: 'ARFL-003',
    timestamp: '2025-12-10T09:15:00Z',
    content: 'Encountered significant difficulty finding up-to-date data on niche market adoption of technology X. Marking this keyword as high-risk. May need to replace it with a broader term if the next two searches fail.',
    status: 'committed',
  },
  {
    id: 'ARFL-002',
    timestamp: '2025-12-10T14:45:00Z',
    content: 'Quick note: Started drafting the analysis summary for the feasibility check, but I forgot to save the full conclusion. Will finish tomorrow morning.',
    status: 'draft',
  },
  {
    id: 'ARFL-001',
    timestamp: '2025-12-09T11:00:00Z',
    content: 'First session reflection: The initial question is too broad, covering three distinct sectors. The next step is to use the refinement tool to narrow the focus to a single industrial application.',
    status: 'committed',
  },
  {
    id: 'RFL-005',
    timestamp: '2025-12-12T10:00:00Z',
    content: 'Initial planning session completed. Decided to focus on the "Circular Economy" aspect first, as data feasibility seems higher there. Need to re-evaluate the scope after the first search iteration.',
    status: 'committed',
  },
  {
    id: 'RFL-004',
    timestamp: '2025-12-11T16:30:00Z',
    content: 'Revised the central research question slightly. Changed "impact on global markets" to "impact on European Union policy" to make the scope manageable. This should improve the stability score.',
    status: 'committed',
  },
  {
    id: 'RFL-003',
    timestamp: '2025-12-10T09:15:00Z',
    content: 'Encountered significant difficulty finding up-to-date data on niche market adoption of technology X. Marking this keyword as high-risk. May need to replace it with a broader term if the next two searches fail.',
    status: 'committed',
  },
  {
    id: 'RFL-002',
    timestamp: '2025-12-10T14:45:00Z',
    content: 'Quick note: Started drafting the analysis summary for the feasibility check, but I forgot to save the full conclusion. Will finish tomorrow morning.',
    status: 'draft',
  },
  {
    id: 'RFL-001',
    timestamp: '2025-12-09T11:00:00Z',
    content: 'First session reflection: The initial question is too broad, covering three distinct sectors. The next step is to use the refinement tool to narrow the focus to a single industrial application.',
    status: 'committed',
  },
];

// Placeholder Mock Data (removed as per best practice, using initialEntries)
// const mockReflectionLogs: ReflectionLogEntry[] = [...];

// Log entries are stored in a reactive variable, initialized from props
// const logEntries = ref<ReflectionLogEntry[]>(props.initialEntries || []);
const logEntries = ref<ReflectionLogEntry[]>(mockReflectionLogs);

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
    timestamp: new Date().toISOString(),
    content: '',
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

  // 1. Update the status and timestamp
  const finalEntry: ReflectionLogEntry = {
    ...currentDraft.value,
    timestamp: new Date().toISOString(), // Update timestamp on save
    status: targetStatus === 'commit' ? 'committed' : 'draft',
    content: currentDraft.value.content.trim(),
  };

  // 2. Emit the event to the parent/store/API
  emit('save-log', finalEntry);

  // 3. Update local state (optimistic update/new entry handling)
  if (isNewEntry.value) {
    // Note: In a real app, you might wait for API response before adding to logEntries
    logEntries.value.unshift(finalEntry);
  } else {
    // Replace the updated entry in the list
    const index = logEntries.value.findIndex(e => e.id === finalEntry.id);
    if (index !== -1) {
      logEntries.value[index] = finalEntry;
    }
  }

  // 4. Close the modal if committed, or stay and reset if just a draft save
  if (targetStatus === 'commit') {
    emit('close-modal');
  } else {
    // Re-select the saved entry and disable editing
    selectedEntryId.value = finalEntry.id;
    originalEntry.value = JSON.parse(JSON.stringify(finalEntry)); // Update original for future dirty checks
    currentDraft.value = finalEntry;
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