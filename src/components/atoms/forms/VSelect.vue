<template>
  <select
    :id="id"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    :disabled="disabled"
    :class="[
      // Base styles: consistent transition and layout
      'block w-full transition duration-150 ease-in-out',
      // Border and Focus: standardized to indigo-600 and rounded-md
      'border-slate-300 shadow-sm focus:ring-indigo-600 focus:border-indigo-600 rounded-md',
      sizeClasses,
      // State styling: unified disabled look
      disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-white text-slate-900',
    ]"
  >
    <slot></slot>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Select Atom
 * A styled wrapper for the native HTML select element.
 * Aligned with Input.vue and Textarea.vue for form consistency.
 */
const props = defineProps({
  /** Currently selected value (v-model) */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  /** Accessibility ID to associate with a label */
  id: {
    type: String,
    default: undefined,
  },
  /** Toggles the disabled state */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Size variants matching the global form scale */
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
});

/** Define emits for v-model support with specific types */
defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

// --- Tailwind Size Mapping ---
// Matches Input.vue padding and font sizes exactly
const sizeMap: Record<string, string> = {
  sm: 'px-2 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const sizeClasses = computed(() => {
  return sizeMap[props.size] || sizeMap.md;
});
</script>

<style scoped>
/* Standard select styling to ensure the arrow icon looks consistent across browsers */
select {
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>