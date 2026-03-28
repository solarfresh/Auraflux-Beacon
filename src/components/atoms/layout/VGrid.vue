<template>
  <component
    :is="tag"
    :class="[
      'grid',
      // 1. Grid Columns Logic
      resolveGridCols(cols),
      // 2. Spacing (Gap)
      gap && gapClasses[gap],
      // 3. Alignment
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

/**
 * Parses the cols prop into Tailwind grid-cols classes.
 * Handles both simple numbers and responsive breakpoint strings.
 * Example: "1 md:2 lg:4" -> "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
 */
const resolveGridCols = (cols: number | string) => {
  if (typeof cols === 'number') {
    return `grid-cols-${cols}`;
  }

  return cols
    .split(' ')
    .map((part) => {
      if (part.includes(':')) {
        const [bp, val] = part.split(':');
        return `${bp}:grid-cols-${val}`;
      }
      return `grid-cols-${part}`;
    })
    .join(' ');
};
</script>