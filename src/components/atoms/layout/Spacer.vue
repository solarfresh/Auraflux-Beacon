<template>
  <div
    :class="[
      // If flex is true, use grow; otherwise use fixed dimensions
      flex ? 'flex-1' : 'flex-none',
      // Dynamic spacing mapping
      sizeClasses[size],
      // Axis control
      axis === 'vertical' ? 'w-full' : 'h-full'
    ]"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
/**
 * Spacer Atom
 * An invisible layout component used to create space between elements.
 * Use 'flex' mode to push elements apart (flex-grow).
 * Use 'fixed' mode for specific height/width increments.
 */

type SpacerSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
type Axis = 'vertical' | 'horizontal';

interface Props {
  /** The size of the space. 'auto' works only with flex=false for specific logic */
  size?: SpacerSize;
  /** Whether the spacer should grow to fill available space (flex-grow) */
  flex?: boolean;
  /** Direction of the spacer */
  axis?: Axis;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'auto',
  flex: true, // Default to flex-grow to push items apart
  axis: 'vertical',
});

// Mapping for fixed dimensions (when flex is false)
const sizeClasses: Record<SpacerSize, string> = {
  none: 'p-0',
  xs: 'h-1 w-1',   // 4px
  sm: 'h-2 w-2',   // 8px
  md: 'h-4 w-4',   // 16px
  lg: 'h-8 w-8',   // 32px
  xl: 'h-12 w-12', // 48px
  auto: '',        // Used when flex-grow is handling the space
};
</script>