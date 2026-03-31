<template>
  <VBox
    tag="div"
    rounded="md"
    background="white"
    :class="[
      // Positioning & Z-Index (Z-60 to sit above Floating Controls)
      'absolute! top-full -right-1 z-60',

      // Layout & Sizing
      'min-w-40 py-1 flex flex-col',

      // Visual Surface (Level 3 Elevation)
      'border border-slate-200 shadow-lg',

      // Flow Independence: Ensures it doesn't shift adjacent elements
      'pointer-events-auto'
    ]"
  >
    <slot />
  </VBox>
</template>

<script setup lang="ts">
/**
 * VDropdownMenu Molecule
 * * A structural orchestrator that manages the spatial zone for menu items.
 * Following the Layout Principles, it utilizes Level 3 Elevation (shadow-lg)
 * and maintains Flow Independence through absolute positioning.
 */
import VBox from '@/components/atoms/layout/VBox.vue';

 // Props can be expanded here for 'placement' logic (e.g., left, right, bottom)
</script>

<style scoped>
/**
 * Flow Independence:
 * The absolute positioning ensures it doesn't break the parent's document flow.
 * Transition logic can be added here or via Transition component for 'duration-300'.
 */
.v-dropdown-menu {
  /* Using standard system transitions for 'State-Driven Geometry' if needed */
  transform-origin: top right;
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>