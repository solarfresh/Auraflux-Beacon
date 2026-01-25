<template>
  <div class="flex flex-col h-full space-y-6">
    <div class="space-y-3 p-1">
      <VTypography tag="label" size="sm" weight="bold" color="gray-700">
        Add Research Keyword
      </VTypography>
      <div class="flex gap-2">
        <VInput
          v-model="newKeywordLabel"
          placeholder="e.g., Sustainable Energy, Behavioral Economics..."
          size="md"
          class="flex-1"
          @keyup.enter="addKeyword"
        />
        <VButton variant="primary" size="md" @click="addKeyword">
          Add
        </VButton>
      </div>
      <VTypography tag="p" size="xs" color="gray-400">
        Keywords help the system narrow down relevant resources and insights.
      </VTypography>
    </div>

    <div class="flex-1 flex flex-col min-h-0 space-y-3">
      <div class="flex justify-between items-center px-1">
        <div class="flex items-center gap-2">
          <VTypography tag="h4" size="sm" weight="bold" color="gray-700">
            Current Keywords
          </VTypography>
          <VBadge variant="gray" size="xs">{{ localKeywords.length }}</VBadge>
        </div>
      </div>

      <div
        v-if="localKeywords.length === 0"
        class="flex-1 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50/30 transition-colors"
      >
        <div class="p-3 bg-white rounded-xl shadow-sm mb-3">
          <VIcon name="Hashtag" size="md" color="gray-300" />
        </div>
        <VTypography tag="span" size="sm" color="gray-400" class="text-center italic">
          Your list is empty. <br/> Add terms to focus your inquiry.
        </VTypography>
      </div>

      <div
        v-else
        class="flex-1 overflow-y-auto pr-2 stable-gutter transition-all"
      >
        <div class="flex flex-wrap gap-3 p-1">
          <div
            v-for="(keyword, index) in localKeywords"
            :key="keyword.label + index"
            class="flex items-center bg-white border border-gray-200 pl-3 pr-1.5 py-1.5 rounded-xl group hover:border-indigo-300 hover:shadow-sm transition-all animate-in fade-in zoom-in duration-200"
          >
            <VIcon
              :name="getStatusIcon(keyword.entityStatus)"
              size="xs"
              :class="getStatusColorClass(keyword.entityStatus)"
              class="mr-2"
            />

            <VTypography tag="span" size="sm" weight="medium" color="gray-700" class="mr-3">
              {{ keyword.label }}
            </VTypography>

            <VIconButton
              variant="danger"
              size="xs"
              icon-name="XMark"
              class="opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 rounded-lg"
              @click="removeKeyword(index)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end items-center space-x-3 pt-6 border-t border-gray-100">
      <VButton variant="tertiary" size="md" @click="$emit('cancel')">
        Cancel
      </VButton>
      <VButton variant="primary" size="md" @click="handleSave">
        Save Changes
      </VButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedKeyword } from '@/interfaces/initiation';

// Atoms
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VIconButton from '@/components/atoms/IconButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';

const props = defineProps<{
  initialValue: ProcessedKeyword[];
}>();

const emit = defineEmits<{
  (e: 'save', value: ProcessedKeyword[]): void;
  (e: 'cancel'): void;
}>();

// --- STATE ---
const localKeywords = ref<ProcessedKeyword[]>([...props.initialValue]);
const newKeywordLabel = ref('');

// --- LOGIC ---

function addKeyword() {
  const label = newKeywordLabel.value.trim();
  if (!label) return;

  const isDuplicate = localKeywords.value.some(
    k => k.label.toLowerCase() === label.toLowerCase()
  );

  if (isDuplicate) {
    newKeywordLabel.value = '';
    return;
  }

  localKeywords.value.unshift({ // Add to top for better visibility
    id: `temp-${Date.now()}`,
    label,
    entityStatus: 'USER_DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  newKeywordLabel.value = '';
}

function removeKeyword(index: number) {
  localKeywords.value.splice(index, 1);
}

function handleSave() {
  emit('save', localKeywords.value);
}

// --- UI HELPERS ---

function getStatusIcon(status?: EntityStatus): string {
  switch (status) {
    case 'LOCKED': return 'LockClosed';
    case 'ON_HOLD': return 'ArchiveBox';
    case 'AI_EXTRACTED': return 'Sparkles';
    default: return 'PencilSquare';
  }
}

/** * Returns Tailwind text color classes instead of raw hex/color names
 * for better integration with the template.
 */
function getStatusColorClass(status?: EntityStatus): string {
  switch (status) {
    case 'LOCKED': return 'text-indigo-500';
    case 'AI_EXTRACTED': return 'text-amber-500';
    case 'ON_HOLD': return 'text-gray-400';
    default: return 'text-gray-300';
  }
}
</script>

<style scoped>
/* Scoped styles are minimal, relying on global stable-gutter */
</style>