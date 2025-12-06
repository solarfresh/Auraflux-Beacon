<template>
  <input
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :class="inputClasses"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: 'text',
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'search'
    validator: (value: string) => ['default', 'search'].includes(value),
  },
  // --- NEW SIZE PROP ---
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
});

const emit = defineEmits(['update:modelValue']);

// --- Tailwind Size Map ---
const sizeMap: { [key: string]: string } = {
  sm: 'py-1.5 px-2 text-sm',
  md: 'py-2 px-3 text-base',
  lg: 'py-3 px-4 text-lg',
};

// --- Tailwind Variant Map (Simplified Focus) ---
const variantMap: { [key: string]: string } = {
  default: 'shadow-sm border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600',
  // Search variant often includes a leading icon and a rounded shape, adjust p/py as needed
  search: 'border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500',
};

const inputClasses = computed(() => {
  const baseClasses = 'block w-full transition duration-150 ease-in-out';

  // Combine base, size, and variant classes
  return `${baseClasses} ${sizeMap[props.size]} ${variantMap[props.variant]}`;
});
</script>