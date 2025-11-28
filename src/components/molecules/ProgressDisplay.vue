<template>
  <div class="space-y-2">
    <Text tag="h3" size="lg" weight="semibold" color="gray-800">
      {{ label }}
    </Text>

    <div class="bg-gray-200 rounded-full h-2.5">
      <div
        class="h-2.5 rounded-full transition-all duration-700 ease-out"
        :class="progressColorClass"
        :style="{ width: `${clampedPercentage}%` }"
        role="progressbar"
        :aria-valuenow="clampedPercentage"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>

    <Text tag="p" size="sm" :color="textColorClass">
      <span class="font-semibold">{{ clampedPercentage }}%</span> {{ description }}
    </Text>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Text from '@/components/atoms/Text.vue';

// --- Props ---
const props = defineProps({
  /**
   * The current completion percentage (0 to 100).
   */
  percentage: {
    type: Number,
    required: true,
    default: 0,
  },
  /**
   * The main label for the progress tracker (e.g., "Definition Progress").
   */
  label: {
    type: String,
    default: 'Progress',
  },
  /**
   * Optional descriptive text to follow the percentage (e.g., "of key elements locked").
   */
  description: {
    type: String,
    default: 'complete',
  },
  /**
   * Color theme for the progress bar. Options: 'indigo', 'green', 'gray'.
   */
  color: {
    type: String as () => 'indigo' | 'green' | 'gray',
    default: 'indigo',
  },
});

// --- Computed Properties ---

/**
 * Ensures the percentage stays between 0 and 100 for safety.
 */
const clampedPercentage = computed(() => {
  return Math.max(0, Math.min(100, props.percentage));
});

/**
 * Dynamically determines the Tailwind CSS class for the progress bar color.
 */
const progressColorClass = computed(() => {
  switch (props.color) {
    case 'green':
      return 'bg-green-600';
    case 'gray':
      return 'bg-gray-500';
    case 'indigo':
    default:
      return 'bg-indigo-600';
  }
});

/**
 * Dynamically determines the Tailwind CSS class for the descriptive text color.
 */
const textColorClass = computed(() => {
  if (clampedPercentage.value === 100) {
    return 'text-green-600';
  }
  return 'text-gray-600';
});
</script>