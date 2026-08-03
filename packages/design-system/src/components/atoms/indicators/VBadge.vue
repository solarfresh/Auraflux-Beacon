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
import type { BadgeColor } from '@/interfaces/indicators';

/**
 * Props for Badge atom
 * @property {string} variant - The color theme of the badge
 * @property {string} size - The physical scale of the badge
 */

const props = withDefaults(defineProps<{
  variant?: BadgeColor;
  size?: 'xs' | 'sm' | 'md';
}>(), {
  variant: 'gray',
  size: 'sm'
});

/**
 * Maps variant prop to Tailwind CSS classes
 */
const variantClasses = computed(() => {
const themes: Record<BadgeColor, string> = {
    indigo:  'bg-indigo-50 text-indigo-700 border-indigo-100',
    amber:   'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red:     'bg-red-50 text-red-700 border-red-100',
    gray:    'bg-slate-100 text-slate-600 border-slate-200',
    purple:  'bg-purple-50 text-purple-700 border-purple-100',
    blue:    'bg-blue-50 text-blue-700 border-blue-100',
    slate:   'bg-slate-100 text-slate-700 border-slate-200'
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