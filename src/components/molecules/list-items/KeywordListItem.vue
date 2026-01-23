<template>
  <li
    :class="[
      'flex items-center justify-between p-3 border transition duration-150 cursor-pointer',
      'rounded-md', // Corrected from rounded-lg to match system standard
      styles.classes
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

    <Button
      variant="ghost"
      iconOnly
      :iconName="styles.actionIcon"
      size="sm"
      :aria-label="`Edit keyword ${keyword.label}`"
      class="flex-shrink-0"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue'; // Added Button dependency
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedKeyword, TopicKeywordStyle } from '@/interfaces/initiation';

const props = defineProps<{
  keyword: ProcessedKeyword;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'edit-request', payload: { index: number, keyword: ProcessedKeyword }): void;
}>();

/** * Computes styling tokens based on entity status.
 * All colors are aligned with the Tailwind palette provided by Atoms.
 */
const styles = computed<TopicKeywordStyle>(() => {
  switch (props.keyword.entityStatus as EntityStatus) {
    case 'LOCKED':
      return {
          classes: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
          icon: 'LockClosed',
          iconColor: 'indigo-600',
          secondaryText: 'LOCKED (Committed)',
          actionIcon: 'ChevronRight',
      };
    case 'AI_EXTRACTED':
      return {
          classes: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
          icon: 'Sparkles',
          iconColor: 'yellow-600',
          secondaryText: 'AI Capture (Needs Review)',
          actionIcon: 'ExclamationCircle',
      };
    case 'ON_HOLD':
      return {
          classes: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
          icon: 'ArchiveBox',
          iconColor: 'gray-500',
          secondaryText: 'ON HOLD (Excluded)',
          actionIcon: 'ArrowPath',
      };
    case 'USER_DRAFT':
    default:
      return {
          classes: 'bg-white border-gray-200 hover:bg-gray-50',
          icon: 'ClipboardDocumentList',
          iconColor: 'gray-600',
          secondaryText: 'User Draft (Pending Lock)',
          actionIcon: 'PencilSquare',
      };
  }
});

function handleEditRequest() {
  emit('edit-request', {
    index: props.index,
    keyword: props.keyword,
  });
}
</script>