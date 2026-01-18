<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <Text tag="label" size="sm" weight="semibold" color="gray-700">
        Add New Keyword
      </Text>
      <div class="flex gap-2">
        <Input
          v-model="newKeywordLabel"
          placeholder="e.g., Sustainable Energy"
          size="sm"
          @keyup.enter="addKeyword"
        />
        <Button variant="primary" size="sm" @click="addKeyword">
          Add
        </Button>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex justify-between items-center px-1">
        <Text tag="h4" size="sm" weight="semibold" color="gray-700">
          Current Keywords
        </Text>
        <Text tag="span" size="xs" color="gray-400">
          {{ localKeywords.length }} items
        </Text>
      </div>

      <div
        v-if="localKeywords.length === 0"
        class="py-10 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center bg-gray-50/30"
      >
        <Icon name="Hashtag" size="md" color="gray-300" class="mb-2" />
        <Text tag="span" size="xs" color="gray-400 italic text-center">
          Your keyword list is currently empty.<br/>Add terms to focus your research.
        </Text>
      </div>

      <div v-else class="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1 scrollbar-none">
        <div
          v-for="(keyword, index) in localKeywords"
          :key="keyword.label + index"
          class="flex items-center bg-white border border-gray-200 pl-3 pr-2 py-1.5 rounded-lg group hover:border-indigo-300 hover:shadow-sm transition-all"
        >
          <Icon
            :name="getStatusIcon(keyword.entityStatus)"
            size="xs"
            :color="getStatusColor(keyword.entityStatus)"
            class="mr-2"
          />

          <Text tag="span" size="sm" color="gray-800" class="mr-2">
            {{ keyword.label }}
          </Text>

          <IconButton
              variant="danger"
              size="xs"
              icon-name="XMark"
              class="opacity-0 group-hover:opacity-100"
              @click="removeKeyword(index)"
            />
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-100">
      <Button variant="secondary" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button variant="primary" @click="handleSave">
        Save Changes
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EntityStatus } from '@/interfaces/core'
import type { ProcessedKeyword } from '@/interfaces/workflow';
import { ref } from 'vue';

// Atoms
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import IconButton from '@/components/atoms/IconButton.vue';
import Input from '@/components/atoms/Input.vue';
import Text from '@/components/atoms/Text.vue';

/**
 * English Documentation:
 * This organism manages the collection of keywords (ProcessedKeyword[]).
 * It uses the Input atom for new entries and handles list persistence.
 */
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

/** Adds a new keyword object to the local array */
function addKeyword() {
  const label = newKeywordLabel.value.trim();
  if (!label) return;

  // Prevent duplicates
  const isDuplicate = localKeywords.value.some(
    k => k.label.toLowerCase() === label.toLowerCase()
  );
  if (isDuplicate) {
    newKeywordLabel.value = '';
    return;
  }

  localKeywords.value.push({
    id: '',
    label,
    entityStatus: 'USER_DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  newKeywordLabel.value = '';
}

/** Removes a keyword from the local temporary state */
function removeKeyword(index: number) {
  localKeywords.value.splice(index, 1);
}

/** Returns the final list to the parent (RefinementModal) */
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

function getStatusColor(status?: EntityStatus): string {
  switch (status) {
    case 'LOCKED': return 'indigo-500';
    case 'AI_EXTRACTED': return 'yellow-500';
    case 'ON_HOLD': return 'gray-400';
    default: return 'gray-300';
  }
}
</script>
