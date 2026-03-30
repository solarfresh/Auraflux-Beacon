<template>
  <VBox
    tag="div"
    rounded="md"
    class="v-dropdown-menu absolute right-0 z-50 min-w-50 py-1 bg-white border border-slate-200 shadow-lg"
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
}
</style>