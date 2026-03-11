<template>
  <div
    class="v-node-container relative transition-all duration-300 min-w-[200px] border-2 shadow-sm"
    :class="[
      // Rule: Semantic Signaling (Dashed for Suggested, Solid for Verified)
      props.status === 'AI_EXTRACTED' ? 'border-dashed' : 'border-solid',

      // Interaction states
      props.selected ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-lg' : 'hover:shadow-md hover:-translate-y-0.5',

      // Injected theme and padding
      props.themeClass,
      paddingMap[props.padding],

      // Standardized rounding from Atoms Layer (Level 1 Container)
      'rounded-xl'
    ]"
  >
    <slot />

    <slot name="overlay" />
  </div>
</template>

<script setup lang="ts">
/**
 * VNodeContainer Molecule
 * The physical shell for all canvas nodes.
 * Implements semantic border logic (Solid/Dashed) and hover/selection states.
 */

const props = withDefaults(defineProps<{
  // Entity status from backend (e.g., 'AI_EXTRACTED', 'LOCKED')
  status?: string
  // Selection state provided by Vue Flow
  selected?: boolean
  // Design Token: Semantic theme classes (e.g., 'bg-blue-50 border-blue-500')
  themeClass?: string
  // Accessibility and layout attributes
  padding?: 'none' | 'xs' | 'sm' | 'md'
}>(), {
  status: 'LOCKED',
  selected: false,
  themeClass: 'bg-white border-slate-200',
  padding: 'md'
})

// Padding mapping logic
const paddingMap = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4'
}
</script>

<style scoped>
.v-node-container {
  /* Prevent text selection during node dragging */
  user-select: none;
  /* Maintain consistent box-sizing for layout engines */
  box-sizing: border-box;
}
</style>