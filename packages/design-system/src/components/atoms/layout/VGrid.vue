<template>
  <component
    :is="tag"
    :class="[
      'grid',
      // Grid Columns Logic
      resolveGridCols(cols),
      padding && paddingMap[padding],
      // Spacing (Gap)
      gap && gapClasses[gap],
      // Alignment
      alignClasses[align],
      justifyClasses[justify]
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Grid Atom (The "Coordinate" layer)
 * A 2D layout engine that manages responsive columns and spatial distribution.
 * Adheres to the 8px grid system via GapSize tokens.
 * * @category Atoms
 * @subcategory Layout
 */
import { alignClasses, gapClasses, justifyClasses } from '@/constants/layout';
import type { Alignment, GapSize, SpacingToken, Justification } from '@/interfaces/layout';

const props = withDefaults(defineProps<{
  /** HTML tag to render */
  tag?: string;

  padding?: SpacingToken;
  /** * Column configuration.
   * Supports static numbers "3" or responsive strings "1 md:2 lg:3".
   */
  cols?: number | string;
  /** Spatial distribution token between cells */
  gap?: GapSize;
  /** Vertical alignment of items (align-items) */
  align?: Alignment;
  /** Horizontal distribution of content (justify-content) */
  justify?: Justification;
}>(), {
  tag: 'div',
  padding: 'none',
  cols: 1,
  gap: 'md',
  align: 'stretch',
  justify: 'start'
});
// --- Helper Logic ---
const paddingMap: Record<SpacingToken, string> = {
  none: 'p-0',
  xs: 'p-2',          // 8px
  sm: 'px-4 py-3',    // 16px horizontal, 12px vertical
  md: 'px-6 py-4',    // 24px horizontal, 16px vertical
  lg: 'px-8 py-6',    // 32px horizontal, 24px vertical
  xl: 'px-12 py-10'   // 48px horizontal, 40px vertical
};

const gridColsMap: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '12': 'grid-cols-12',
  'md:2': 'md:grid-cols-2',
  'lg:3': 'lg:grid-cols-3',
  'xl:4': 'xl:grid-cols-4',
};

const resolveGridCols = (cols: number | string) => {
  const colsStr = String(cols);
  return colsStr.split(' ').map(part => gridColsMap[part] || '').join(' ');
};
</script>