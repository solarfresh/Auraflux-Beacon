<template>
  <textarea
    :id="id"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out',
      sizeClasses,
      disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900',
    ]"
  ></textarea>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  /**
   * Used for v-model binding
   */
  modelValue: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: undefined,
  },
  rows: {
    type: [String, Number],
    default: 3,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
});

// Emit v-model update event
defineEmits(['update:modelValue']);

// --- Tailwind Size Classes ---
const sizeMap: { [key: string]: string } = {
  sm: 'p-2 text-sm',
  md: 'p-3 text-base',
  lg: 'p-4 text-lg',
};

const sizeClasses = computed(() => {
  return sizeMap[props.size];
});
</script>