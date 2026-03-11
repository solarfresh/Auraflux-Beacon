<template>
  <div
    class="v-node-shield transition-all duration-300 min-w-[200px]"
    :class="[
      // Background and base rounding
      themeClass,
      'rounded-xl',

      // Depth and Elevation logic
      selected
        ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-lg scale-[1.02]'
        : 'shadow-sm hover:shadow-md hover:-translate-y-0.5',

      // Layout Padding (mapped from props)
      paddingMap[padding]
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * VNodeShield Atom
 * Technical Responsibility: Surface elevation, background tokens, and transition states.
 * Logic: Provides the "Plate" upon which the SVG Shape and content are mounted.
 */
const props = withDefaults(defineProps<{
  /** Design Token: Semantic theme classes (e.g., 'bg-emerald-50 text-emerald-900') */
  themeClass?: string
  /** Selection state from Vue Flow */
  selected?: boolean
  /** Standardized padding levels */
  padding?: 'none' | 'xs' | 'sm' | 'md'
}>(), {
  themeClass: 'bg-white text-slate-900',
  selected: false,
  padding: 'md'
})

// Internal padding mapping for Tailwind class generation
const paddingMap = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4'
}
</script>

<style scoped>
/** * Technical Note:
 * We use 'scale-[1.02]' for selected nodes to provide a clear
 * "active" signal that is visible even at low zoom levels.
 */
.v-node-shield {
  /* Prevents text from being selectable while dragging the node */
  user-select: none;
  /* Ensures the container respects the Vue Flow coordinate system */
  will-change: transform, box-shadow;
}
</style>