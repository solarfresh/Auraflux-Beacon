<template>
  <component
    :is="tag"
    :class="[
      inline ? 'inline-flex' : 'flex',
      'flex-col',
      alignStyles,
      justifyStyles,
      gapStyles,
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
 * Manages 1D vertical layout (flex-direction: column).
 * Responsible for consistent vertical spacing (gap) between child elements.
 *
 * @category Atoms
 * @subcategory Layout
 */
import { computed } from 'vue';
import type { Alignment, Justification, ComponentSizeToken, TagToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_ALIGN_CLASSES, SHARED_GAP_CLASSES, SHARED_JUSTIFY_CLASSES } from '@auraflux/design-system/constants/theme';

export interface VStackProps {
  /** HTML element to render */
  tag?: TagToken;
  /** Vertical gap between child elements */
  gap?: ComponentSizeToken;
  /** Horizontal alignment of child elements (cross axis) */
  align?: Alignment;
  /** Vertical distribution of child elements (main axis) */
  justify?: Justification;
  /** Use inline-flex instead of block flex */
  inline?: boolean;
  /** Force the stack to occupy full available height */
  fullHeight?: boolean;
  /** Allow vertical scrolling with min-h-0 container constraint */
  scrollable?: boolean;
}

const props = withDefaults(defineProps<VStackProps>(), {
  tag: 'div',
  gap: 'md',
  align: 'stretch',
  justify: 'start',
  inline: false,
  fullHeight: false,
  scrollable: false,
});

const alignStyles = computed(() => {
  return SHARED_ALIGN_CLASSES[props.align] || SHARED_ALIGN_CLASSES.stretch;
});

const gapStyles = computed(() => {
  return SHARED_GAP_CLASSES[props.gap] || SHARED_GAP_CLASSES.md;
});

const justifyStyles = computed(() => {
  return SHARED_JUSTIFY_CLASSES[props.justify] || SHARED_JUSTIFY_CLASSES.start;
});
</script>