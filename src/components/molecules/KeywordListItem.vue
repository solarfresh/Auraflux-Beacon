<template>
  <li
    :class="[
      'flex items-center justify-between p-3 border rounded-lg transition duration-150 cursor-pointer',
      styles.classes // Apply class based on status (LOCKED, AI_EXTRACTED, etc.)
    ]"
    @click="handleEditRequest"
  >
    <div class="flex items-start space-x-3">
      <Icon
        :name="styles.icon"
        type="outline"
        size="sm"
        :color="styles.iconColor"
        class="mt-1 flex-shrink-0"
      />

      <div class="flex flex-col">
        <Text tag="span" size="base" weight="medium" :color="styles.iconColor">
          {{ keyword.label }}
        </Text>
        <Text tag="span" size="xs" :color="styles.iconColor" class="opacity-80">
          {{ styles.secondaryText }}
        </Text>
      </div>
    </div>

    <Icon
      :name="styles.actionIcon!"
      type="outline"
      size="md"
      :color="styles.iconColor"
    />
  </li>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import type { ProcessedKeyword, TopicKeywordStyle } from '@/interfaces/initiation';
import type { EntityStatus } from '@/interfaces/workflow';
import { computed } from 'vue';

// ----------------------------------------------------------------------
// --- Props & Emits ---
// ----------------------------------------------------------------------

const props = defineProps<{
  /** The single keyword data object. */
  keyword: ProcessedKeyword;

  /** The index of the keyword in the main list (used for emitting the event). */
  index: number;
}>();

const emit = defineEmits<{
  /** Emitted when the list item is clicked, requesting the parent (SidebarContent) to open the modal. */
  (e: 'edit-request', payload: { index: number, keyword: ProcessedKeyword }): void;
}>();


// ----------------------------------------------------------------------
// --- Internal Logic ---
// ----------------------------------------------------------------------

/** * Computes the necessary styling and icon choices based on the keyword's status.
 * This logic is encapsulated here, adhering to the Molecule's SRP.
 */
const styles = computed<TopicKeywordStyle>(() => {
  switch (props.keyword.EntityStatus as EntityStatus) {
    case 'LOCKED':
      return {
          classes: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
          icon: 'LockClosed',
          iconColor: 'indigo-600',
          secondaryText: 'LOCKED (Committed)',
          actionIcon: 'ChevronRight', // Indicate entering a view
      };
    case 'AI_EXTRACTED':
      return {
          classes: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
          icon: 'Sparkles',
          iconColor: 'yellow-600',
          secondaryText: 'AI Capture (Needs Review)',
          actionIcon: 'ExclamationCircle', // Indicate action needed
      };
    case 'ON_HOLD':
      return {
          classes: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
          icon: 'ArchiveBox',
          iconColor: 'gray-500',
          secondaryText: 'ON HOLD (Excluded)',
          actionIcon: 'ArrowPath', // Indicate it can be reactivated
      };
    case 'USER_DRAFT':
    default:
      return {
          classes: 'bg-white border-gray-200 hover:bg-gray-50',
          icon: 'ClipboardDocumentList',
          iconColor: 'gray-600',
          secondaryText: 'User Draft (Pending Lock)',
          actionIcon: 'PencilSquare', // Indicate edit action
      };
  }
});

/**
 * Handles the click event and emits the request to the parent component
 * to open the refinement modal.
 */
function handleEditRequest() {
    emit('edit-request', {
        index: props.index,
        keyword: props.keyword,
    });
}
</script>