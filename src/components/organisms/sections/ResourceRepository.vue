<template>
  <BaseSectionLayout title="Knowledge Repository">
    <template #header-actions>
      <div class="flex items-center gap-1">
        <VButton
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
        <VInput
          v-model="searchTerm"
          placeholder="Search by title, keywords, or notes..."
          size="sm"
          iconName="MagnifyingGlass"
        />
      </div>
    </template>

  </BaseSectionLayout>

  <FullScreenModalTemplate :is-open="isEditModalOpen" @close="isEditModalOpen = false">
    <template #header>Refine Notes: {{ editingResource?.label }}</template>
    <template #content>
      <div v-if="editingResource" class="flex flex-col gap-6">
        <div class="space-y-2">
          <VTypography tag="h5" weight="bold" size="sm">AI Distillation</VTypography>
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <VTypography size="sm" color="slate-700" class="leading-relaxed">
              {{ editingResource.summary }}
            </VTypography>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <VTypography tag="h5" weight="bold" size="sm">Personal Reflections</VTypography>
            <VTypography size="xs" color="slate-400">Supports Markdown</VTypography>
          </div>
          <VTextarea
            v-model="localNotes"
            placeholder="Record connections to other nodes or potential conflicts..."
            :rows="8"
          />
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <VButton variant="ghost" @click="isEditModalOpen = false">Cancel</VButton>
          <VButton @click="saveNotes">Save Reflections</VButton>
        </div>
      </div>
    </template>
  </FullScreenModalTemplate>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ResourceItem, ResourceSource } from '@/interfaces/knowledge';

// Atoms, Molecules & Layouts
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VCheckbox from '@/components/atoms/forms/VCheckbox.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VMetaListItem from '@/components/molecules/navs/VMetaListItem.vue';
import BaseSectionLayout from '@/components/organisms/sections/BaseSectionLayout.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';

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