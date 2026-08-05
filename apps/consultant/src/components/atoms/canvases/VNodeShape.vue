<template>
  <svg
    class="v-node-shape absolute inset-0 w-full h-full pointer-events-none overflow-visible"
    aria-hidden="true"
  >
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      :rx="borderRadius"
      :ry="borderRadius"
      fill="none"
      :class="[
        'transition-all duration-300 stroke-inherit',
        status === 'AI_EXTRACTED' ? 'stroke-dash' : 'stroke-solid'
      ]"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>

<script setup lang="ts">
/**
 * VNodeShape Atom
 * Technical Responsibility: Vector-based border rendering.
 * Principle: Uses non-scaling-stroke to maintain line weight during zoom.
 */

withDefaults(defineProps<{
  /** Entity status to determine dash pattern */
  status?: string;
  /** Pixel value for corner rounding, matching parent container */
  borderRadius?: number;
}>(), {
  status: 'LOCKED',
  borderRadius: 12
});
</script>

<style scoped>
/**
 * CSS Logic:
 * The stroke color is inherited from the parent's 'text-color'
 * via 'stroke: currentColor' to maintain theme synchronization.
 */
.v-node-shape rect {
  stroke: currentColor;
}

.stroke-dash {
  /* High-contrast dash: 8px segment, 5px whitespace */
  stroke-width: 2.5px;
  stroke-dasharray: 8, 5;
}

.stroke-solid {
  stroke-width: 2px;
  stroke-dasharray: none;
}
</style>