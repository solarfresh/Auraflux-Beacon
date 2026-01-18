<template>
  <li
    :class="[
      'flex items-center justify-between p-2 rounded-md transition cursor-pointer',
      statusClasses.container,
    ]"
    @click="handleEdit"
  >
    <div class="flex items-center space-x-2 w-full min-w-0">

      <Icon
        :name="statusClasses.icon"
        type="outline"
        size="xs"
        :color="statusClasses.iconColor"
        class="flex-shrink-0"
      />

      <div class="flex items-baseline min-w-0">
        <Text tag="span" size="sm" weight="semibold" :color="statusClasses.labelColor" class="flex-shrink-0 mr-1">
          {{ scopeElement.label }}:
        </Text>

        <Text tag="span" size="sm" weight="normal" :color="statusClasses.valueColor" class="truncate min-w-0 flex-grow">
          {{ scopeElement.rationale || 'N/A' }}
        </Text>
      </div>

    </div>

    <Icon
      name="ChevronRight"
      type="outline"
      size="sm"
      :color="statusClasses.iconColor"
      class="flex-shrink-0 ml-2"
    />
  </li>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import type { EntityStatus } from '@/interfaces/core'
import type { ProcessedScope } from '@/interfaces/workflow';
import { computed } from 'vue';

// ----------------------------------------------------------------------
// --- Props & Emits ---
// ----------------------------------------------------------------------

const props = defineProps<{
  /** The single scope element data object. */
  scopeElement: ProcessedScope;
  /** The index of the element in the list, used for event payload. */
  index: number;
}>();

const emit = defineEmits<{
  /** Emitted when the item is clicked, requesting the parent to open the refinement modal. */
  (e: 'edit-request', payload: { index: number, scope: ProcessedScope }): void;
}>();


// ----------------------------------------------------------------------
// --- Computed Status Classes ---
// ----------------------------------------------------------------------

/** Computes the dynamic classes, colors, and icons based on the scope status. */
const statusClasses = computed(() => {
  const status: EntityStatus = props.scopeElement.entityStatus;

  const reviewStatuses = new Set(['USER_DRAFT', 'AI_EXTRACTED']);

  if (reviewStatuses.has(status)) {
    // === NEW/UPDATED: USER_DRAFT and AI_EXTRACTED ===
    return {
      container: 'border border-yellow-200 bg-yellow-50 hover:bg-yellow-100',
      labelColor: 'yellow-800',
      valueColor: 'yellow-700',
      iconColor: 'yellow-600',
      icon: status === 'AI_EXTRACTED' ? 'LightBulb' : 'PencilSquare',
    };
  }

  switch (status) {
    case 'LOCKED':
      return {
        container: 'border border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
        labelColor: 'indigo-800',
        valueColor: 'indigo-600',
        iconColor: 'indigo-500',
        icon: 'LockClosed',
      };
    case 'ON_HOLD':
      // === NEW/UPDATED: ON_HOLD replaces DISCARDED ===
      return {
        container: 'border border-gray-200 bg-gray-50 hover:bg-gray-100 opacity-70',
        labelColor: 'gray-500',
        valueColor: 'gray-400',
        iconColor: 'gray-400',
        icon: 'ArchiveBoxXMark', // Archive/Discard Icon
      };
    default:
      // Fallback for unexpected status
      return {
        container: 'border border-gray-200 bg-white hover:bg-gray-50',
        labelColor: 'gray-800',
        valueColor: 'gray-600',
        iconColor: 'gray-500',
        icon: 'InformationCircle',
      };
  }
});

// ----------------------------------------------------------------------
// --- Methods ---
// ----------------------------------------------------------------------

/** Emits the edit-request event with necessary payload when the item is clicked. */
const handleEdit = () => {
  emit('edit-request', {
    index: props.index,
    scope: props.scopeElement,
  });
};
</script>