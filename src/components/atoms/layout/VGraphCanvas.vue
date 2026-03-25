<template>
  <svg
    :viewBox="viewBox"
    :preserveAspectRatio="aspectRatio"
    class="v-graph-canvas absolute inset-0 w-full h-full pointer-events-none select-none"
    aria-hidden="true"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
/**
 * VGraphCanvas Atom
 * Responsibility: Provides a standardized SVG viewport for static graphs.
 */
withDefaults(defineProps<{
  viewBox?: string;
  aspectRatio?: string;
}>(), {
  viewBox: '0 0 1440 800',
  aspectRatio: 'xMidYMid slice'
});
</script>