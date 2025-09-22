<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[baseClass, variantClass, sizeClass]"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ButtonProps } from '@/interfaces/button';

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  variant: 'primary',
  size: 'md',
});

const baseClass = computed(() => {
  if (props.iconOnly) {
    return 'flex items-center justify-center rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  } else {
    return 'flex items-center justify-center rounded-md px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  }
});

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
    case 'secondary':
      return 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500';
    case 'destructive':
      return 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
    case 'outline':
      return 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500';
    case 'danger-outline':
      return 'border-gray-300 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 focus:ring-red-500'
    default:
      return '';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-1 text-sm';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default: // md
      return '';
  }
});
</script>