<template>
  <select
    :id="id"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    :disabled="disabled"
    :class="[
      // Base Tailwind classes for border, shadow, and focus states
      'block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out',
      // Dynamic size classes (padding and font size)
      sizeClasses,
      // Dynamic state classes (disabled vs. normal)
      disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900',
    ]"
  >
    <slot></slot>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  /**
   * Used for v-model binding: the currently selected value.
   */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  /**
   * Optional ID for accessibility (linking to a <Text tag="label">).
   */
  id: {
    type: String,
    default: undefined,
  },
  /**
   * Disables the select element.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Defines the size of the select input.
   */
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
});

// Emit v-model update event
defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

// --- Tailwind Size Classes Map ---
const sizeMap: { [key: string]: string } = {
  sm: 'px-2 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const sizeClasses = computed(() => {
  return sizeMap[props.size];
});
</script>