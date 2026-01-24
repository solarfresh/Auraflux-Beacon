<template>
  <div class="flex h-full w-full overflow-hidden bg-white">
    <div class="flex-shrink-0 w-80 md:w-96 border-r border-gray-100">
      <slot name="master-panel" />
    </div>

    <main class="flex-1 min-w-0 h-full overflow-hidden bg-white">
      <slot name="detail-panel" />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * MasterDetailTemplate: A structural organism for dual-panel interfaces.
 * * Features:
 * - Fixed-width Master panel on the left (w-80 to w-96).
 * - Fluid Detail panel on the right (flex-1).
 * - Prevents layout overflow with overflow-hidden on the parent.
 */
</script>

<style scoped>
/* Ensures that child panels that use 'h-full' actually
  fill the 100% height of this flex container.
*/
</style>