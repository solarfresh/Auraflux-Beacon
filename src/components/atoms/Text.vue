<template>
  <component :is="tag" :class="textClasses">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  tag: {
    type: String,
    default: 'p',
    validator: (value: string) => ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'li'].includes(value),
  },
  size: {
    type: String,
    default: 'base', // 'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'
    validator: (value: string) => ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].includes(value),
  },
  weight: {
    type: String,
    default: 'normal', // 'light', 'normal', 'medium', 'semibold', 'bold'
    validator: (value: string) => ['light', 'normal', 'medium', 'semibold', 'bold'].includes(value),
  },
  color: {
    type: String,
    default: 'gray-900', // e.g., 'gray-900', 'blue-500', 'white'
  },
});

const sizeMap: { [key: string]: string } = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
};

const weightMap: { [key: string]: string } = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const textClasses = computed(() => {
  return [
    sizeMap[props.size],
    weightMap[props.weight],
    `text-${props.color}`
  ];
});
</script>

<style scoped>
/* Scoped styles can be added here if needed, but Tailwind handles most of the styling. */
</style>