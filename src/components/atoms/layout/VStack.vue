<template>
  <component
    :is="tag"
    :class="[
      inline ? 'inline-flex' : 'flex',
      'flex-col',
      alignClasses[align],
      justifyClasses[justify],
      gapClasses[gap],
      fullHeight ? 'h-full' : 'h-auto',
      scrollable ? 'overflow-y-auto min-h-0' : 'overflow-visible'
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Stack Atom
 * Manages vertical layout (flex-direction: column).
 * Responsible for consistent spacing (gap) between child elements.
 */
import type {GapSize, Alignment, Justification} from '@/interfaces/layout';

interface Props {
  /** HTML element to render */
  tag?: string;
  /** Vertical gap between children */
  gap?: GapSize;
  /** Horizontal alignment of children */
  align?: Alignment;
  /** Vertical distribution of children */
  justify?: Justification;
  /** Use inline-flex instead of flex */
  inline?: boolean;
  /** Force the stack to take up full available height */
  fullHeight?: boolean;
  scrollable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  gap: 'md',
  align: 'stretch',
  justify: 'start',
  inline: false,
  fullHeight: false,
  scrollable: false,
});

const gapClasses: Record<GapSize, string> = {
  none: 'gap-0',
  xs: 'gap-1',     // 4px
  sm: 'gap-2',     // 8px
  md: 'gap-4',     // 16px
  lg: 'gap-6',     // 24px
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