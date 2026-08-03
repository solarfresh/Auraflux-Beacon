<template>
  <component
    :is="tag"
    :class="[
      'flex flex-row',
      wrap ? 'flex-wrap' : 'flex-nowrap',
      alignClasses[align],
      justifyClasses[justify],
      gapClasses[gap],
      inline ? 'inline-flex' : 'flex',
      fullWidth ? 'w-full' : 'w-auto'
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Cluster Atom
 * Manages horizontal layout (flex-direction: row).
 * Used for grouping elements side-by-side with consistent spacing.
 */
import { alignClasses, gapClasses, justifyClasses } from '@/constants/layout';
import type { Alignment, GapSize, Justification } from '@/interfaces/layout';

const props = withDefaults(defineProps<{
  /** HTML element to render */
  tag?: string;
  /** Horizontal gap between children */
  gap?: GapSize;
  /** Vertical alignment of children */
  align?: Alignment;
  /** Horizontal distribution of children */
  justify?: Justification;
  /** Allow items to wrap to the next line */
  wrap?: boolean;
  /** Use inline-flex instead of flex */
  inline?: boolean;
  /** Force the cluster to take up full available width */
  fullWidth?: boolean;
}>(), {
  tag: 'div',
  gap: 'md',
  align: 'center', // Default to center for horizontal alignment
  justify: 'start',
  wrap: false,
  inline: false,
  fullWidth: false,
});
</script>