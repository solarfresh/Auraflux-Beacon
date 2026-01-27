<template>
  <MasterDetailTemplate>
    <template #master-panel>
      <MasterListPanel
        title="Log Entries"
        :item-count="logEntries.length"
        :disable-new-entry="isEditing"
        :is-empty="logEntries.length === 0"
        class="bg-white border-r border-slate-100 h-full"
        @new-entry="handleNewEntry"
      >
        <template #list-items>
          <VTimelineItem
            v-for="entry in logEntries"
            :key="entry.id"
            :entry="entry"
            :is-active="selectedEntryId === entry.id"
            @click="handleSelectEntry(entry)"
          />
        </template>

        <template #empty-state>
          <VEmptyState
            icon="DocumentPlus"
            title="Start your journey"
          >
            Create your first reflection log to track research insights.
          </VEmptyState>
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
/**
 * ReflectionLogForm
 * Orchestrates the Master-Detail flow using standardized molecules.
 */
import { ref, computed, watch } from 'vue';
import { useInitiativeStore } from '@/stores/initiation';
import type { ReflectionLogEntry } from '@/interfaces/workflow';

// Molecules
import VTimelineItem from '@/components/molecules/navs/VTimelineItem.vue';
import VEmptyState from '@/components/molecules/indicators/VEmptyState.vue';

// Organisms & Templates
import MasterDetailTemplate from '@/components/templates/MasterDetailTemplate.vue';
import MasterListPanel from '@/components/organisms/layout/MasterListPanel.vue';
import ReflectionLogEditorPanel from '@/components/organisms/forms/ReflectionLogEditorPanel.vue';

const props = defineProps<{
  initialEntries: ReflectionLogEntry[];
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const initiativeStore = useInitiativeStore();

// --- State ---
const logEntries = ref<ReflectionLogEntry[]>(props.initialEntries || []);
const selectedEntryId = ref<string | null>(null);
const originalEntry = ref<ReflectionLogEntry | null>(null);
const currentDraft = ref<ReflectionLogEntry | null>(null);
const isEditing = ref(false);

// --- Computed ---
const isNewEntry = computed(() => !selectedEntryId.value && !!currentDraft.value);

const isDirty = computed(() => {
  if (!currentDraft.value || !originalEntry.value) return false;
  return currentDraft.value.content.trim() !== originalEntry.value.content.trim() ||
         currentDraft.value.title.trim() !== originalEntry.value.title.trim();
});

// --- Watchers ---
watch(() => props.initialEntries, (newEntries) => {
  logEntries.value = newEntries;
}, { deep: true });

// --- Selection & Lifecycle Methods ---
function handleSelectEntry(entry: ReflectionLogEntry) {
  if (isEditing.value && isDirty.value && selectedEntryId.value !== entry.id) {
    if (!window.confirm("Discard unsaved changes?")) return;
  }

  selectedEntryId.value = entry.id;
  // Deep clone to isolate draft from original
  originalEntry.value = JSON.parse(JSON.stringify(entry));
  currentDraft.value = JSON.parse(JSON.stringify(entry));
  isEditing.value = false;
}

function handleNewEntry() {
  if (isEditing.value && isDirty.value) {
    if (!window.confirm("Discard changes and start a new entry?")) return;
  }

  selectedEntryId.value = null;
  isEditing.value = true;
  originalEntry.value = null;
  currentDraft.value = {
    id: `new-${Date.now()}`,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    title: '',
    content: '',
    step: 'EXPLORATION',
    associatedResourceIds: [],
    associatedConceptIds: [],
    entryType: 'UNCATEGORIZED_DRAFT',
    status: 'draft',
  };
}

async function handleSave(targetStatus: 'draft' | 'commit') {
  if (!currentDraft.value || !currentDraft.value.content.trim()) return;

  await initiativeStore.createOrUpdateReflection(
    currentDraft.value.id,
    currentDraft.value.title,
    currentDraft.value.content,
    targetStatus === 'commit' ? 'committed' : 'draft',
  );

  if (targetStatus === 'commit') {
    emit('close-modal');
  } else {
    isEditing.value = false;
  }
}

function handleCancelEdit() {
  if (isDirty.value && !window.confirm("Discard changes?")) return;

  if (originalEntry.value) {
    currentDraft.value = JSON.parse(JSON.stringify(originalEntry.value));
    isEditing.value = false;
  } else {
    currentDraft.value = null;
    selectedEntryId.value = null;
  }
}
</script>