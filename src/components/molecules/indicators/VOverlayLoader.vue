<template>
  <div class="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-8">

    <VIcon
      name="ArrowPath"
      type="solid"
      size="2xl"
      color="indigo-600"
      class="animate-spin mb-6"
    />

    <VTypography tag="p" size="xl" weight="bold" color="gray-900">
      {{ message }}
    </VTypography>

    <VTypography v-if="detail" tag="p" size="sm" color="gray-500" class="mt-2 text-center max-w-xs">
      {{ detail }}
    </VTypography>
  </div>
</template>

<script setup lang="ts">
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

/**
 * FullScreenLoader Molecule
 * Blocks the entire UI during critical data fetching or transition states.
 */
defineProps({
  /** Primary status message */
  message: {
    type: String,
    required: true,
  },
  /** Optional secondary info to keep user informed during long waits */
  detail: {
    type: String,
    required: false,
  },
});
</script>

<style scoped>
/* Ensuring the spin animation is smooth.
  Note: Tailwind's 'animate-spin' is usually sufficient,
  but keeping local keyframes for specific timing control if needed.
*/
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>