<template>
  <div class="flex h-full min-h-[700px]">

    <slot name="master-panel"></slot>

    <slot name="detail-panel"></slot>
  </div>
</template>

<script setup lang="ts">
/**
 * MasterDetailLayout.vue
 * * This component provides a clean, responsive layout structure for two primary
 * vertical panels: a narrow Master list on the left and a wider Detail view/editor
 * on the right.
 * * It functions purely as a structural container (Organism level) and passes
 * control of content, logic, and specific panel sizing to the parent
 * component via named slots.
 */
</script>

<style scoped>
/* No specific scoped styles needed, as Tailwind utilities handle the flex layout. */
</style>