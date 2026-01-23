<template>
  <div
    class="group cursor-pointer p-3 rounded-md transition-all border border-transparent hover:border-indigo-100 hover:bg-indigo-50/50"
    @click="$emit('click')"
  >
    <div class="flex justify-between items-start">
      <Text
        tag="span"
        size="xs"
        weight="bold"
        color="indigo-600"
        class="uppercase tracking-wider"
      >
        {{ label }}
      </Text>

      <Icon
        name="PencilSquare"
        size="xs"
        color="indigo-400"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>

    <Text
      tag="p"
      size="sm"
      weight="medium"
      :color="value ? 'gray-800' : 'gray-400'"
      class="mt-1 line-clamp-2 leading-relaxed"
    >
      {{ value || placeholder }}
    </Text>

    <span class="sr-only">Click to edit {{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
import Icon from '@/components/atoms/Icon.vue';

/**
 * FocusItem Molecule
 * Displays a key-value pair of research focus data (e.g., Research Question).
 * Styled to look like a "card-let" within a larger list or panel.
 */
defineProps<{
  /** The attribute name (e.g., "Goal", "Question") */
  label: string;
  /** The current user-provided value */
  value?: string;
  /** Text to show if value is empty */
  placeholder: string;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>