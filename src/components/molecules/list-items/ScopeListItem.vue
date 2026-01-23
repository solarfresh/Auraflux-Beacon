<template>
  <li
    role="button"
    :class="[
      'flex items-center justify-between p-3 border transition duration-150 cursor-pointer',
      'rounded-md', // System standard rounding
      statusClasses.container,
    ]"
    @click="handleEdit"
  >
    <div class="flex items-center space-x-3 w-full min-w-0">
      <Icon
        :name="statusClasses.icon"
        type="outline"
        size="xs"
        :color="statusClasses.iconColor"
        class="flex-shrink-0"
      />

      <div class="flex items-center min-w-0 flex-1 gap-2">
        <Text
          tag="span"
          size="sm"
          weight="bold"
          :color="statusClasses.labelColor"
          class="flex-shrink-0"
        >
          {{ scopeElement.label }}:
        </Text>

        <Text
          tag="span"
          size="sm"
          :color="statusClasses.valueColor"
          class="truncate"
        >
          {{ scopeElement.rationale || 'No rationale provided' }}
        </Text>
      </div>
    </div>

    <Icon
      name="ChevronRight"
      size="sm"
      :color="statusClasses.iconColor"
      class="flex-shrink-0 ml-2 opacity-50 group-hover:opacity-100 transition-opacity"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import type { EntityStatus } from '@/interfaces/core'
import type { ProcessedScope } from '@/interfaces/initiation';

const props = defineProps<{
  scopeElement: ProcessedScope;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'edit-request', payload: { index: number, scope: ProcessedScope }): void;
}>();

/** * Centralized Style Mapping
 * Returns standardized color names compatible with Atom props.
 */
const statusClasses = computed(() => {
  const status: EntityStatus = props.scopeElement.entityStatus;

  switch (status) {
    case 'AI_EXTRACTED':
    case 'USER_DRAFT':
      return {
        container: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100',
        labelColor: 'yellow-800',
        valueColor: 'yellow-700',
        iconColor: 'yellow-600',
        icon: status === 'AI_EXTRACTED' ? 'LightBulb' : 'PencilSquare',
      };
    case 'LOCKED':
      return {
        container: 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
        labelColor: 'indigo-800',
        valueColor: 'indigo-600',
        iconColor: 'indigo-500',
        icon: 'LockClosed',
      };
    case 'ON_HOLD':
      return {
        container: 'border-gray-200 bg-gray-50 opacity-60 grayscale',
        labelColor: 'gray-500',
        valueColor: 'gray-400',
        iconColor: 'gray-400',
        icon: 'ArchiveBox',
      };
    default:
      return {
        container: 'border-gray-200 bg-white hover:bg-gray-50',
        labelColor: 'gray-800',
        valueColor: 'gray-600',
        iconColor: 'gray-500',
        icon: 'InformationCircle',
      };
  }
});

const handleEdit = () => {
  emit('edit-request', {
    index: props.index,
    scope: props.scopeElement,
  });
};
</script>