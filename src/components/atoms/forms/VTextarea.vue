<template>
  <textarea
    :id="id"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'block w-full transition duration-150 ease-in-out',
      // Consistent focus and border states
      'border-gray-300 shadow-sm focus:ring-indigo-600 focus:border-indigo-600',
      // Normalized corner radius
      'rounded-md',
      sizeClasses,
      // Unified disabled styling
      disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-900',
    ]"
  ></textarea>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Textarea Atom
 * Used for multi-line text input.
 * Styled to match Input.vue for visual consistency.
 */
const props = defineProps({
  /** Used for v-model binding */
  modelValue: {
    type: String,
    default: '',
  },
  /** Unique identifier for accessibility and label association */
  id: {
    type: String,
    default: undefined,
  },
  /** Number of visible text lines */
  rows: {
    type: [String, Number],
    default: 3,
  },
  /** Input placeholder text */
  placeholder: {
    type: String,
    default: '',
  },
  /** Toggles the disabled state and styling */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Defines vertical padding and font size scale */
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
});

// Define emits for v-model support
defineEmits(['update:modelValue']);

// --- Tailwind Size Mapping ---
// Mirrored from Input.vue to ensure vertical alignment in forms
const sizeMap: Record<string, string> = {
  sm: 'py-1.5 px-2 text-sm',
  md: 'py-2 px-3 text-base',
  lg: 'py-3 px-4 text-lg',
};

const sizeClasses = computed(() => {
  return sizeMap[props.size] || sizeMap.md;
});
</script>

<style scoped>
/* Resizing can be restricted here if design dictates fixed widths */
textarea {
  resize: vertical;
}
</style>