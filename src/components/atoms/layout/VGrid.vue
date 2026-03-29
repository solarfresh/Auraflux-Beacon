<template>
  <component
    :is="tag"
    :class="[
      'grid',
      // Grid Columns Logic
      resolveGridCols(cols),
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
import type { Alignment, GapSize, Justification } from '@/interfaces/layout';

const props = withDefaults(defineProps<{
  /** HTML tag to render */
  tag?: string;
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
  cols: 1,
  gap: 'md',
  align: 'stretch',
  justify: 'start'
});
// --- Helper Logic ---

const gridColsMap: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  'md:2': 'md:grid-cols-2',
  'lg:3': 'lg:grid-cols-3',
  'xl:4': 'xl:grid-cols-4',
};

const resolveGridCols = (cols: number | string) => {
  const colsStr = String(cols);
  return colsStr.split(' ').map(part => gridColsMap[part] || '').join(' ');
};
</script>