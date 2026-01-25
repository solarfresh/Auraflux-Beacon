<template>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    :class="checkboxClasses"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  /**
   * Used for v-model binding. Represents the checked state.
   */
  modelValue: {
    type: Boolean,
    default: false,
  },
  // Additional props for size, color, or variant could be added here later.
});

const emit = defineEmits(['update:modelValue']);

const checkboxClasses = computed(() => {
  // These classes maintain the established visual style from ScopeSelector.vue
  return [
    'h-4',
    'w-4',
    'text-indigo-600', // Primary color for the checked state
    'border-gray-300', // Border color when unchecked
    'rounded',
    'focus:ring-indigo-500', // Focus ring color
    'focus:ring-2',
    'cursor-pointer'
  ];
});
</script>

<style scoped>
/* Scoped styles can be added here if needed, but Tailwind handles the core styling. */
</style>