<template>
  <component
    :is="tag"
    :class="[
      'grid',

      // Column Layout Class Map
      colsClass,

      // Spatial Padding
      paddingStyles,

      // Alignment, Distribution & Gap
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
 * Grid Atom (The "Coordinate" layer)
 * A 2D layout engine that manages responsive columns and spatial distribution.
 * Adheres to Design System spacing and alignment tokens.
 *
 * @category Atoms
 * @subcategory Layout
 */
import { computed } from 'vue';
import type {
  Alignment,
  Justification,
  ComponentSizeToken,
  GapSizeToken,
  SpacingToken,
  TagToken
} from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_ALIGN_CLASSES,
  SHARED_GAP_CLASSES,
  SHARED_JUSTIFY_CLASSES,
  SHARED_PADDING_CLASSES
} from '@auraflux/design-system/constants/theme';

export interface VGridProps {
  /** HTML tag to render */
  tag?: TagToken;
  /** Internal container padding token */
  padding?: SpacingToken;
  /**
   * Column configuration.
   * Supports numbers (e.g. 3) or responsive string definitions (e.g. "1 md:2 lg:4").
   */
  cols?: number | string;
  /** Spatial distribution token between cells */
  gap?: GapSizeToken;
  /** Vertical alignment of items (align-items) */
  align?: Alignment;
  /** Horizontal distribution of content (justify-content) */
  justify?: Justification;
}

const props = withDefaults(defineProps<VGridProps>(), {
  tag: 'div',
  padding: 'none',
  cols: 1,
  gap: 'md',
  align: 'stretch',
  justify: 'start',
});

// Dynamic resolver for arbitrary column definitions (e.g., "1 md:2 lg:3 xl:4")
const colsClass = computed(() => {
  const raw = String(props.cols).trim();
  if (!raw) return 'grid-cols-1';

  return raw
    .split(/\s+/)
    .map((part) => {
      if (part.includes(':')) {
        const [breakpoint, num] = part.split(':');
        return `${breakpoint}:grid-cols-${num}`;
      }
      return `grid-cols-${part}`;
    })
    .join(' ');
});

const paddingStyles = computed(() => {
  return SHARED_PADDING_CLASSES[props.padding] || SHARED_PADDING_CLASSES.none;
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