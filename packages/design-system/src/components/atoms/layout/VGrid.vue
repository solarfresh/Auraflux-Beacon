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
  GapSizeToken,
  SpacingToken,
  TagToken
} from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_ITEM_ALIGN_CLASSES,
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

const GRID_COLS_MAP: Record<string | number, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
  '6': 'grid-cols-6',
  '12': 'grid-cols-12',

  'sm:1': 'sm:grid-cols-1',
  'sm:2': 'sm:grid-cols-2',
  'sm:3': 'sm:grid-cols-3',
  'sm:4': 'sm:grid-cols-4',
  'sm:6': 'sm:grid-cols-6',

  'md:1': 'md:grid-cols-1',
  'md:2': 'md:grid-cols-2',
  'md:3': 'md:grid-cols-3',
  'md:4': 'md:grid-cols-4',
  'md:6': 'md:grid-cols-6',

  'lg:1': 'lg:grid-cols-1',
  'lg:2': 'lg:grid-cols-2',
  'lg:3': 'lg:grid-cols-3',
  'lg:4': 'lg:grid-cols-4',
  'lg:6': 'lg:grid-cols-6',

  'xl:1': 'xl:grid-cols-1',
  'xl:2': 'xl:grid-cols-2',
  'xl:3': 'xl:grid-cols-3',
  'xl:4': 'xl:grid-cols-4',
  'xl:6': 'xl:grid-cols-6',
};

// Dynamic resolver for arbitrary column definitions (e.g., "1 md:2 lg:3 xl:4")
const colsClass = computed(() => {
  const raw = String(props.cols).trim();
  if (!raw) return 'grid-cols-1';

  return raw
    .split(/\s+/)
    .map((part) => GRID_COLS_MAP[part] || '')
    .filter(Boolean)
    .join(' ');
});

const paddingStyles = computed(() => {
  return SHARED_PADDING_CLASSES[props.padding] || SHARED_PADDING_CLASSES.none;
});

const alignStyles = computed(() => {
  return SHARED_ITEM_ALIGN_CLASSES[props.align] || SHARED_ITEM_ALIGN_CLASSES.stretch;
});

const gapStyles = computed(() => {
  return SHARED_GAP_CLASSES[props.gap] || SHARED_GAP_CLASSES.md;
});

const justifyStyles = computed(() => {
  return SHARED_JUSTIFY_CLASSES[props.justify] || SHARED_JUSTIFY_CLASSES.start;
});
</script>