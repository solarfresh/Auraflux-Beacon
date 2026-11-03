<template>
  <svg
    class="v-node-shape absolute inset-0 w-full h-full pointer-events-none overflow-visible"
    aria-hidden="true"
  >
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      :rx="roundedValue"
      :ry="roundedValue"
      fill="none"
      :class="[
        'transition-all duration-300 stroke-inherit',
        status === 'REVIEW' || status === 'PENDING' ? 'stroke-dash' : 'stroke-solid'
      ]"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RoundedToken } from '@auraflux/design-system/interfaces/theme';
import type { EntityStatus } from '@auraflux/design-system/interfaces/core';
import { SHARED_ROUNDED_PIXEL_MAP } from '@auraflux/design-system/constants/theme';

/**
 * VNodeShape Atom
 * Technical Responsibility: Vector-based border rendering.
 * Principle: Uses non-scaling-stroke to maintain line weight during zoom.
 */

interface Props {
  /** Entity status to determine dash pattern */
  status?: EntityStatus;
  /** Rounded token for corner rounding */
  rounded?: RoundedToken;
}

const props = withDefaults(defineProps<Props>(), {
  status: 'LOCKED',
  rounded: 'md'
});

const roundedValue = computed(() => SHARED_ROUNDED_PIXEL_MAP[props.rounded ?? 'md'] ?? 12);
</script>

<style scoped>
.v-node-shape rect {
  stroke: currentColor;
}

.stroke-dash {
  stroke-width: 2.5px;
  stroke-dasharray: 8, 5;
}

.stroke-solid {
  stroke-width: 2px;
  stroke-dasharray: none;
}
</style>


