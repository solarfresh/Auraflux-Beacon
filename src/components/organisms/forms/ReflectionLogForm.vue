<template>
  <MasterDetailTemplate>
    <template #master-panel>
      <MasterListPanel
        title="Log Entries"
        :item-count="logEntries.length"
        :disable-new-entry="isEditing"
        :is-empty="logEntries.length === 0"
        class="bg-white border-r border-gray-100 h-full"
        @new-entry="handleNewEntry"
      >
        <template #list-items>
          <ReflectionLogListItem
            v-for="entry in logEntries"
            :key="entry.id"
            :entry="entry"
            :is-active="selectedEntryId === entry.id"
            @click="handleSelectEntry(entry)"
          />
        </template>

        <template #empty-state>
          <Stack align="center" gap="md" class="py-12 px-6 text-center">
            <Icon name="DocumentPlus" size="lg" color="gray-200" />
            <Text size="sm" color="gray-400">
              Start your first reflection log to track your research journey.
            </Text>
          </Stack>
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
 * ReflectionLogForm (Page-level Organism / Template Controller)
 * Orchestrates the Master-Detail flow for research reflections.
 */
import { ref, computed, watch } from 'vue';
import { useInitiativeStore } from '@/stores/initiation';
import type { ReflectionLogEntry } from '@/interfaces/workflow';

// Atoms & Layout
import Text from '@/components/atoms/data-display/Text.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Stack from '@/components/atoms/layout/Stack.vue';

// Molecules & Organisms
import MasterDetailTemplate from '@/components/templates/MasterDetailTemplate.vue';
import MasterListPanel from '@/components/organisms/layout/MasterListPanel.vue';
import ReflectionLogListItem from '@/components/molecules/list-items/ReflectionLogListItem.vue';
import ReflectionLogEditorPanel from '@/components/organisms/forms/ReflectionLogEditorPanel.vue';

const initiativeStore = useInitiativeStore();

const props = defineProps<{
  initialEntries: ReflectionLogEntry[];
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

// --- State Management ---
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

// --- Helpers ---
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// --- Watchers ---
watch(() => props.initialEntries, (newEntries) => {
    logEntries.value = newEntries;
}, { deep: true });

// --- Methods ---
function handleSelectEntry(entry: ReflectionLogEntry) {
  if (isEditing.value && isDirty.value && selectedEntryId.value !== entry.id) {
    if (!window.confirm("Discard unsaved changes?")) return;
  }

  selectedEntryId.value = entry.id;
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