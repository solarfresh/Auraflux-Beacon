<template>
  <div
    role="separator"
    :aria-orientation="orientation"
    :class="[
      // Base styles - pure lightweight elements
      'shrink-0 select-none bg-slate-200',

      // Vertical Orientation
      orientation === 'vertical' && [
        'inline-block align-middle',
        size === 'sm' && 'h-4 w-px my-auto',
        size === 'md' && 'h-6 w-px my-auto',
        size === 'lg' && 'h-8 w-px my-auto',
        size === 'full' && 'h-full w-px'
      ],

      // Horizontal Orientation
      orientation === 'horizontal' && [
        'block w-full',
        size === 'sm' && 'h-px my-2',
        size === 'md' && 'h-px my-4',
        size === 'lg' && 'h-px my-6',
        size === 'full' && 'h-px my-0'
      ]
    ]"
  />
</template>

<script setup lang="ts">
/**
 * VDivider
 * Pure Atom Indicator Component
 * Renders a lightweight, zero-dependency semantic divider.
 */
withDefaults(defineProps<{
  /** Orientation of the divider */
  orientation?: 'horizontal' | 'vertical';
  /** Length/Height size constraint for the divider */
  size?: 'sm' | 'md' | 'lg' | 'full';
}>(), {
  orientation: 'vertical',
  size: 'sm',
});
</script>