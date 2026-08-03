<template>
  <div
    class="h-full rounded-full transition-all duration-700 ease-out"
    :class="colorClass"
    :style="{ width: `${clampedWidth}%` }"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  /**
   * Width of the bar segment (0 to 100).
   */
  width: {
    type: Number,
    required: true,
    default: 0,
  },
  /**
   * Color theme for the segment.
   * Added 'white' option to support ProgressTracker's design.
   */
  color: {
    type: String as () => 'indigo' | 'green' | 'gray' | 'white',
    default: 'indigo',
  },
});

const clampedWidth = computed(() => {
  return Math.max(0, Math.min(100, props.width));
});

const colorClass = computed(() => {
  switch (props.color) {
    case 'green':
      return 'bg-green-600';
    case 'gray':
      return 'bg-slate-500';
    case 'white':
      return 'bg-white';
    case 'indigo':
    default:
      return 'bg-indigo-600';
  }
});
</script>