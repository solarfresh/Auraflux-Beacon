<template>
  <li
    role="button"
    :aria-selected="isActive"
    @click="$emit('select')"
    :class="[
      'group flex items-center justify-between p-2.5 transition-all duration-150 cursor-pointer border',
      'rounded-md', // System standard
      isActive
        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
        : 'bg-transparent border-transparent hover:bg-gray-50'
    ]"
  >
    <div class="flex items-center min-w-0 flex-1 space-x-3">
      <Icon
        name="ViewColumns"
        size="sm"
        :color="isActive ? 'indigo-600' : 'gray-400'"
        class="flex-shrink-0"
      />

      <Text
        tag="span"
        size="sm"
        :weight="isActive ? 'bold' : 'medium'"
        :color="isActive ? 'indigo-900' : 'gray-700'"
        class="truncate"
      >
        {{ name }}
      </Text>
    </div>

    <div class="flex items-center">
      <div
        v-if="isActive"
        class="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1"
      ></div>

      <Button
        v-if="!isActive"
        variant="ghost"
        size="xs"
        iconOnly
        iconName="ChevronRight"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  </li>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/data-display/Text.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Button from '@/components/atoms/actions/Button.vue';

/**
 * ViewListItem Molecule
 * Used for switching between different workspace views or perspectives.
 */
defineProps<{
  /** Name of the view (e.g., "Table View", "Grid View") */
  name: string;
  /** Whether this view is currently being displayed */
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select'): void;
}>();
</script>