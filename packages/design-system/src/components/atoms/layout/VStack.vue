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
import { alignClasses, gapClasses, justifyClasses } from '@/constants/layout';
import type { Alignment, GapSize, Justification } from '@/interfaces/layout';

const props = withDefaults(defineProps<{
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
}>(), {
  tag: 'div',
  gap: 'md',
  align: 'stretch',
  justify: 'start',
  inline: false,
  fullHeight: false,
  scrollable: false,
});
</script>