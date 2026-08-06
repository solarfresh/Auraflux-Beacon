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
 * Manages vertical layout (flex-direction: column).
 * Responsible for consistent spacing (gap) between child elements.
 */
import { computed } from 'vue';
import type {Alignment, Justification, SizeToken, TagToken} from '@auraflux/design-system/interfaces/theme';
import { SHARED_ALIGN_CLASSES, SHARED_GAP_CLASSES, SHARED_JUSTIFY_CLASSES } from '@auraflux/design-system/constants/theme';

export interface VStackProps {
  /** HTML element to render */
  tag?: TagToken;
  /** Horizontal gap between children */
  gap?: SizeToken;
  /** Vertical alignment of children */
  align?: Alignment;
  /** Horizontal distribution of children */
  justify?: Justification;
  /** Use inline-flex instead of flex */
  inline?: boolean;
  /** Force the cluster to take up full available width */
  fullHeight?: boolean;
  scrollable?: boolean;
};

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
  return SHARED_ALIGN_CLASSES[props.align] || SHARED_ALIGN_CLASSES.center;
});

const gapStyles = computed(() => {
  return SHARED_GAP_CLASSES[props.gap] || SHARED_GAP_CLASSES.md;
});

const justifyStyles = computed(() => {
  return SHARED_JUSTIFY_CLASSES[props.justify] || SHARED_JUSTIFY_CLASSES.start;
});
</script>