<template>
  <VBox tag="section" full-height class="flex flex-col">
    <VBox padding="xs" class="mb-8">
      <VStack gap="sm">
        <VTypography tag="label" size="sm" weight="bold" color="gray-700">
          Add Research Keyword
        </VTypography>

        <VCluster gap="sm">
          <VInput
            v-model="newKeywordLabel"
            placeholder="e.g., Sustainable Energy, Behavioral Economics..."
            class="flex-1"
            @keyup.enter="addKeyword"
          />
          <VButton
            variant="primary"
            :disabled="!newKeywordLabel.trim()"
            @click="addKeyword"
          >
            Add
          </VButton>
        </VCluster>

        <VTypography size="xs" color="gray-400">
          Keywords help the system narrow down relevant resources and insights.
        </VTypography>
      </VStack>
    </VBox>

    <VBox tag="main" class="flex-1 min-h-0 flex flex-col">
      <VCluster justify="between" align="center" class="px-1 mb-4">
        <VCluster gap="sm" align="center">
          <VTypography tag="h4" size="sm" weight="bold" color="gray-700">
            Current Keywords
          </VTypography>
          <VBadge variant="gray" size="xs">{{ localKeywords.length }}</VBadge>
        </VCluster>
      </VCluster>

      <VEmptyState
        v-if="localKeywords.length === 0"
        icon="Hashtag"
        title="No keywords added"
        description="Your list is empty. Add terms to focus your inquiry."
        class="flex-1 border-2 border-dashed border-gray-100 rounded-2xl"
      />

      <VBox
        v-else
        flex-1
        overflow-y-auto
        class="pr-2 stable-gutter transition-all"
      >
        <VCluster gap="md" wrap class="p-1">
          <VEntityChip
            v-for="(keyword, index) in localKeywords"
            :key="keyword.id"
            :label="keyword.label"
            :icon-name="getStatusIcon(keyword.entityStatus)"
            :icon-class="getStatusColorClass(keyword.entityStatus)"
            removable
            @remove="removeKeyword(index)"
          />
        </VCluster>
      </VBox>
    </VBox>

    <VBox padding="md" border="top" class="mt-6">
      <VCluster justify="end" gap="md">
        <VButton variant="tertiary" @click="$emit('cancel')">
          Cancel
        </VButton>
        <VButton variant="primary" @click="handleSave">
          Save Changes
        </VButton>
      </VCluster>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedKeyword } from '@/interfaces/initiation';

// Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';

// Molecules
import VEntityChip from '@/components/molecules/indicators/VEntityChip.vue';
import VEmptyState from '@/components/molecules/indicators/VEmptyState.vue';

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

// --- CORE LOGIC ---
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

  localKeywords.value.unshift({
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

// --- UI MAPPING (Could be moved to a helper or the Molecule itself) ---
function getStatusIcon(status?: EntityStatus): string {
  const map: Record<string, string> = {
    LOCKED: 'LockClosed',
    ON_HOLD: 'ArchiveBox',
    AI_EXTRACTED: 'Sparkles',
    USER_DRAFT: 'PencilSquare'
  };
  return map[status || 'USER_DRAFT'];
}

function getStatusColorClass(status?: EntityStatus): string {
  const map: Record<string, string> = {
    LOCKED: 'text-indigo-500',
    AI_EXTRACTED: 'text-amber-500',
    ON_HOLD: 'text-gray-400',
    USER_DRAFT: 'text-gray-300'
  };
  return map[status || 'USER_DRAFT'];
}
</script>