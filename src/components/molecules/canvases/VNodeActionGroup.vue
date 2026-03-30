<template>
  <VBox
    class="v-node-action-group absolute -top-12 left-1/2 -translate-x-1/2 shadow-xl"
    background="white"
    padding="xs"
    rounded="lg"
    border="all"
    @click.stop
  >
    <VCluster gap="xs" align="center">
      <VButton
        variant="primary"
        size="xs"
        class="bg-emerald-600! hover:bg-emerald-700!"
        @click="emit('accept')"
      >
        ACCEPT
      </VButton>

      <VButton
        variant="ghost"
        size="xs"
        class="hover:!bg-rose-50 hover:!text-rose-600"
        @click="emit('reject')"
      >
        REJECT
      </VButton>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VNodeActionGroup Molecule
 * Technical Responsibility: Orchestrating the decision interface for AI_EXTRACTED nodes.
 * Adherence: Follows Rule 1 (No Bare Divs) and Rule 4 (Zero Margin Bleed) of Layout Atoms.
 */
import VBox from '@/components/atoms/layout/VBox.vue'
import VCluster from '@/components/atoms/layout/VCluster.vue'
import VButton from '@/components/atoms/buttons/VButton.vue'

const emit = defineEmits<{
  /** Transitions node status to LOCKED */
  (e: 'accept'): void
  /** Removes the node from the exploration state */
  (e: 'reject'): void
}>()
</script>

<style scoped>
.v-node-action-group {
  /* High z-index to ensure visibility above VNodeShape vector borders
     and adjacent edges in the Vue Flow viewport.
  */
  z-index: 50;
  /* Glassmorphism adjustment for white background token */
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.9);
}
</style>