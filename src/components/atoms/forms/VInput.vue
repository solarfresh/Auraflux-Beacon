<template>
  <input
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'block w-full transition duration-150 ease-in-out',
      'border-gray-300 shadow-sm focus:ring-indigo-600 focus:border-indigo-600',
      sizeClasses,
      variantClasses,
      // Unified disabled styling
      disabled ? 'bg-slate-50 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-900',
    ]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Input Atom
 * The primary text entry component.
 * Variants include 'default' for forms and 'search' for navigation/filtering.
 */
const props = defineProps({
  /** Used for v-model binding (supports strings and numbers) */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  /** HTML placeholder text */
  placeholder: {
    type: String,
    default: undefined,
  },
  /** Native input type (text, password, email, number, etc.) */
  type: {
    type: String,
    default: 'text',
  },
  /** Visual style variant */
  variant: {
    type: String,
    default: 'default', // 'default', 'search'
    validator: (value: string) => ['default', 'search'].includes(value),
  },
  /** Component size scale */
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
  /** Toggles the disabled state */
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emit v-model update event
defineEmits(['update:modelValue']);

// --- Tailwind Size Mapping ---
// Shared values across Input, Select, and Textarea
const sizeMap: Record<string, string> = {
  sm: 'py-1.5 px-2 text-sm',
  md: 'py-2 px-3 text-base',
  lg: 'py-3 px-4 text-lg',
};

// --- Tailwind Variant Mapping ---
const variantMap: Record<string, string> = {
  // Standard form style
  default: 'rounded-md',
  // Search style with pill-shape rounding
  search: 'rounded-full',
};

const sizeClasses = computed(() => sizeMap[props.size] || sizeMap.md);
const variantClasses = computed(() => variantMap[props.variant] || variantMap.default);
</script>