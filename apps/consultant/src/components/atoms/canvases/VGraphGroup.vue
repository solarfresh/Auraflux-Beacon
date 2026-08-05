<template>
  <g :class="['v-graph-group', colorClass]">
    <slot />
  </g>
</template>

<script setup lang="ts">
/**
 * VGraphGroup Atom
 * Responsibility: Semantic grouping of graph elements.
 * Prevents "leaky" styling in the molecule.
 */
defineProps<{
  colorClass?: string;
}>();
</script>