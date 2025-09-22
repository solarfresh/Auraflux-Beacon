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
  },
});

const emit = defineEmits(['update:modelValue']);

const inputClasses = computed(() => {
  const baseClasses = 'block w-full transition duration-150 ease-in-out';
  const variantClasses = <{[key: string]: string}> {
    default: 'shadow-sm focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm border-gray-300 rounded-md py-2 px-3',
    search: 'focus:outline-none focus:ring-2 focus:ring-blue-500 border rounded-full px-4 py-2',
  };
  return `${baseClasses} ${variantClasses[props.variant]}`;
});
</script>