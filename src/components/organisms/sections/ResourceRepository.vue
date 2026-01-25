<template>
  <BaseSectionLayout title="Knowledge Repository">
    <template #header-actions>
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          iconOnly
          iconName="ArrowPath"
          title="Refresh Data"
        />
      </div>
    </template>

    <template #stats>
      <div class="flex flex-col gap-3 w-full">
        <Input
          v-model="searchTerm"
          placeholder="Search by title, keywords, or notes..."
          size="sm"
          iconName="MagnifyingGlass"
        />

        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <Checkbox
            v-for="source in SOURCE_TYPES"
            :key="source"
            :model-value="activeSources.includes(source)"
            :value="source"
            :label="formatSourceLabel(source)"
            @update:model-value="(checked) => toggleSource(source, checked)"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div v-if="filteredResources.length === 0" class="flex flex-col items-center justify-center py-12 opacity-40">
        <Icon name="Inbox" size="lg" />
        <Text size="sm" class="mt-2">No research materials found.</Text>
      </div>

      <ul class="flex flex-col gap-3">
        <ResourceListItem
          v-for="resource in filteredResources"
          :key="resource.id"
          :resource="resource"
          @edit="startEdit"
        />
      </ul>
    </template>
  </BaseSectionLayout>

  <FullScreenModalTemplate :is-open="isEditModalOpen" @close="isEditModalOpen = false">
    <template #header>Refine Notes: {{ editingResource?.label }}</template>
    <template #content>
      <div v-if="editingResource" class="flex flex-col gap-6">
        <div class="space-y-2">
          <Text tag="h5" weight="bold" size="sm">AI Distillation</Text>
          <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <Text size="sm" color="gray-700" class="leading-relaxed">
              {{ editingResource.summary }}
            </Text>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Text tag="h5" weight="bold" size="sm">Personal Reflections</Text>
            <Text size="xs" color="gray-400">Supports Markdown</Text>
          </div>
          <Textarea
            v-model="localNotes"
            placeholder="Record connections to other nodes or potential conflicts..."
            :rows="8"
          />
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <Button variant="ghost" @click="isEditModalOpen = false">Cancel</Button>
          <Button @click="saveNotes">Save Reflections</Button>
        </div>
      </div>
    </template>
  </FullScreenModalTemplate>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ResourceItem, ResourceSource } from '@/interfaces/knowledge';

// Atoms, Molecules & Layouts
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Input from '@/components/atoms/Input.vue';
import Checkbox from '@/components/atoms/Checkbox.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import ResourceListItem from '@/components/molecules/list-items/ResourceListItem.vue';
import BaseSectionLayout from '@/components/organisms/sections/BaseSectionLayout.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';

const props = defineProps<{
  resources: ResourceItem[];
}>();

const emit = defineEmits<{
  (e: 'update-resource', resource: ResourceItem): void;
}>();

// --- Constants ---
const SOURCE_TYPES: ResourceSource[] = [
  'ACADEMIC', 'NEWS', 'SOCIAL', 'GOVERNMENT', 'MANUAL', 'AI_GENERATED'
];

// --- UI State ---
const searchTerm = ref('');
const activeSources = ref<ResourceSource[]>([...SOURCE_TYPES]); // Default all checked
const isEditModalOpen = ref(false);
const editingResource = ref<ResourceItem | null>(null);
const localNotes = ref('');

// --- Helper Functions ---
const formatSourceLabel = (source: string) => {
  return source.charAt(0) + source.slice(1).toLowerCase().replace('_', ' ');
};

// --- Filtering Logic ---
const filteredResources = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();

  return props.resources.filter(res => {
    // 1. Source Type Filter
    if (!activeSources.value.includes(res.sourceType)) return false;

    // 2. Search Term Filter (Title, Summary, Keywords, UserNotes)
    if (!term) return true;

    return (
      res.label.toLowerCase().includes(term) ||
      res.summary.toLowerCase().includes(term) ||
      res.userNotes.toLowerCase().includes(term) ||
      res.keywords.some(k => k.toLowerCase().includes(term))
    );
  });
});

// --- Modal Methods ---
function startEdit(resource: ResourceItem) {
  editingResource.value = resource;
  localNotes.value = resource.userNotes;
  isEditModalOpen.value = true;
}

function saveNotes() {
  if (editingResource.value) {
    const updated = {
      ...editingResource.value,
      userNotes: localNotes.value.trim()
    };
    emit('update-resource', updated);
    isEditModalOpen.value = false;
  }
}

/**
 * Manages the array of active sources based on boolean checkbox toggles
 */
function toggleSource(source: ResourceSource, isChecked: boolean) {
  if (isChecked) {
    if (!activeSources.value.includes(source)) {
      activeSources.value.push(source);
    }
  } else {
    activeSources.value = activeSources.value.filter(s => s !== source);
  }
}
</script>