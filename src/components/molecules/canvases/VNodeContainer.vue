<template>
  <VNodeShield
    :theme-class="props.themeClass"
    :selected="props.selected"
    :padding="props.padding"
  >
    <slot />

    <VNodeShape :status="props.status" :border-radius="12" />

    <slot name="overlay" />
  </VNodeShield>
</template>

<script setup lang="ts">
/**
 * VNodeContainer Molecule
 * The physical shell for all canvas nodes.
 * Implements semantic border logic (Solid/Dashed) and hover/selection states.
 */
import VNodeShape from '@/components/atoms/canvases/VNodeShape.vue';
import VNodeShield from '@/components/atoms/canvases/VNodeShield.vue';

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
</style>
