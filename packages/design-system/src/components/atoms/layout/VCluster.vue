<template>
  <component
    :is="tag"
    :class="[
      'flex flex-row',
      wrap ? 'flex-wrap' : 'flex-nowrap',
      alignStyles,
      justifyStyles,
      gapStyles,
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
import { computed } from 'vue';
import type {Alignment, Justification, SizeToken, TagToken} from '@auraflux/design-system/interfaces/theme';
import { SHARED_ALIGN_CLASSES, SHARED_GAP_CLASSES, SHARED_JUSTIFY_CLASSES } from '@auraflux/design-system/constants/theme';

export interface VClusterProps {
  /** HTML element to render */
  tag?: TagToken;
  /** Horizontal gap between children */
  gap?: SizeToken;
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
};

const props = withDefaults(defineProps<VClusterProps>(), {
  tag: 'div',
  gap: 'md',
  align: 'center', // Default to center for horizontal alignment
  justify: 'start',
  wrap: false,
  inline: false,
  fullWidth: false,
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