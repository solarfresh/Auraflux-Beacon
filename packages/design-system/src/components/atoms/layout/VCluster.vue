<template>
  <component
    :is="tag"
    :class="[
      // Base Flex Layout
      inline ? 'inline-flex' : 'flex',
      'flex-row',
      wrap ? 'flex-wrap' : 'flex-nowrap',
      fullWidth ? 'w-full' : 'w-auto',

      // Alignment, Justification & Gap Mapping
      alignStyles,
      justifyStyles,
      gapStyles
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Cluster Atom (The "Layout" layer)
 * Manages horizontal layout (flex-direction: row).
 * Handles grouping elements side-by-side with consistent spacing and alignment.
 */
import { computed } from 'vue';
import type { Alignment, ComponentSizeToken, GapSizeToken, Justification, TagToken } from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_ITEM_ALIGN_CLASSES,
  SHARED_GAP_CLASSES,
  SHARED_JUSTIFY_CLASSES
} from '@auraflux/design-system/constants/theme';

export interface VClusterProps {
  /** HTML element to render */
  tag?: TagToken;
  /** Horizontal gap between children */
  gap?: GapSizeToken;
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

const props = withDefaults(defineProps<VClusterProps>(), {
  tag: 'div',
  gap: 'md',
  align: 'center',
  justify: 'start',
  wrap: false,
  inline: false,
  fullWidth: false,
});

const alignStyles = computed(() => {
  return SHARED_ITEM_ALIGN_CLASSES[props.align] || SHARED_ITEM_ALIGN_CLASSES.center;
});

const gapStyles = computed(() => {
  return SHARED_GAP_CLASSES[props.gap] || SHARED_GAP_CLASSES.md;
});

const justifyStyles = computed(() => {
  return SHARED_JUSTIFY_CLASSES[props.justify] || SHARED_JUSTIFY_CLASSES.start;
});
</script>