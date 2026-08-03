<template>
  <line
    :x1="x1" :y1="y1" :x2="x2" :y2="y2"
    class="v-graph-edge transition-all duration-700 stroke-current"
    :class="status === 'AI_EXTRACTED' ? 'stroke-dash' : 'stroke-solid'"
    vector-effect="non-scaling-stroke"
  />
</template>

<script setup lang="ts">
/**
 * VGraphEdge Atom
 * Responsibility: Renders connectivity with Auraflux-standard dash patterns.
 */
withDefaults(defineProps<{
  x1: number | string;
  y1: number | string;
  x2: number | string;
  y2: number | string;
  status?: 'LOCKED' | 'AI_EXTRACTED';
}>(), {
  status: 'LOCKED'
});
</script>

<style scoped>
.stroke-dash {
  stroke-dasharray: 8 5;
  stroke-width: 1.5px;
}
.stroke-solid {
  stroke-width: 2px;
}
</style>