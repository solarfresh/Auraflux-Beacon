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
          <div
            v-for="entry in logEntries"
            :key="entry.id"
            :class="[
              'p-4 mb-2 rounded-xl border transition-all duration-200 cursor-pointer',
              selectedEntryId === entry.id
                ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
            ]"
            @click="handleSelectEntry(entry)"
          >
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <Text tag="span" size="xs" weight="bold" :color="selectedEntryId === entry.id ? 'indigo-600' : 'gray-400'">
                  {{ formatDate(entry.updatedAt) }}
                </Text>
                <Badge v-if="entry.status === 'draft'" variant="amber" size="xs">Draft</Badge>
              </div>

              <Text
                tag="p"
                size="sm"
                weight="semibold"
                :color="selectedEntryId === entry.id ? 'indigo-900' : 'gray-900'"
                class="truncate"
              >
                {{ entry.title || "Untitled Reflection" }}
              </Text>

              <Text tag="p" size="xs" color="gray-500" class="truncate line-clamp-1 italic">
                {{ entry.content || "No content provided." }}
              </Text>
            </div>
          </div>
        </template>

        <template #empty-state>
          <div class="py-12 px-6 flex flex-col items-center">
            <Icon name="DocumentPlus" size="lg" color="gray-200" class="mb-4" />
            <Text size="sm" color="gray-400">Start your first reflection log to track your research journey.</Text>
          </div>
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
import { ref, computed, watch } from 'vue';
import { useInitiativeStore } from '@/stores/initiation';
import type { ReflectionLogEntry } from '@/interfaces/workflow';

// Components
import Text from '@/components/atoms/Text.vue';
import Icon from '@/components/atoms/Icon.vue';
import Badge from '@/components/atoms/Badge.vue';
import MasterDetailTemplate from '@/components/organisms/layout/MasterDetailTemplate.vue';
import MasterListPanel from '@/components/organisms/layout/MasterListPanel.vue';
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