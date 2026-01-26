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
import type {GapSize, Alignment, Justification} from '@/interfaces/layout';

interface Props {
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
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  gap: 'md',
  align: 'center', // Default to center for horizontal alignment
  justify: 'start',
  wrap: false,
  inline: false,
  fullWidth: false,
});

const gapClasses: Record<GapSize, string> = {
  none: 'gap-0',
  xs: 'gap-1', // 4px
  sm: 'gap-2', // 8px
  md: 'gap-4', // 16px
  lg: 'gap-6', // 24px
  xl: 'gap-8',     // 32px
};

const alignClasses: Record<Alignment, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

const justifyClasses: Record<Justification, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};
</script>