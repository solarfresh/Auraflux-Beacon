<template>
  <span
    :class="[
      'inline-flex items-center justify-center font-medium rounded-full transition-colors',
      variantClasses,
      sizeClasses
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Props for Badge atom
 * @property {string} variant - The color theme of the badge
 * @property {string} size - The physical scale of the badge
 */

const props = withDefaults(defineProps<{
  variant?: 'indigo' | 'amber' | 'emerald' | 'red' | 'gray' | 'purple';
  size?: 'xs' | 'sm' | 'md';
}>(), {
  variant: 'gray',
  size: 'sm'
});

/**
 * Maps variant prop to Tailwind CSS classes
 */
const variantClasses = computed(() => {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    red: 'bg-red-50 text-red-700 border border-red-100',
    gray: 'bg-gray-100 text-gray-600 border border-gray-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-100'
  };
  return themes[props.variant];
});

/**
 * Maps size prop to Tailwind CSS classes
 */
const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px] leading-none',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };
  return sizes[props.size];
});
</script>