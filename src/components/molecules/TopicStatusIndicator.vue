<template>
  <div class="space-y-2">
    <Text tag="h3" size="lg" weight="semibold" color="gray-800">
      {{ label }}
    </Text>

    <div class="bg-gray-200 rounded-full h-2.5" role="progressbar"
      :aria-valuenow="clampedPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <BarSegment
        :width="clampedPercentage"
        :color="color"
      />
    </div>

    <Text tag="p" size="sm" :color="textColorClass" class="flex items-center space-x-2">
      <Text tag="span" weight="semibold">{{ clarityStatusLabel }}</Text>
      <Text tag="span" color="gray-500" weight="normal" size="sm">{{ description }}</Text>
    </Text>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Text from '@/components/atoms/Text.vue';
import BarSegment from '@/components/atoms/BarSegment.vue';

// --- Props ---
const props = defineProps({
  /**
   * The Agent-derived Stability Score (1 to 10).
   * Used internally to calculate the visual progress bar width (0-100).
   */
  stabilityScore: {
    type: Number,
    required: true,
    default: 1,
    validator: (value: number) => value >= 1 && value <= 10,
  },
  /**
   * The main label (e.g., "Topic Refinement Status").
   */
  label: {
    type: String,
    default: 'Status',
  },
  /**
   * Optional descriptive text.
   */
  description: {
    type: String,
    default: 'status indicator',
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
 * Calculates the visual percentage (0-100) directly from the 1-10 stability score.
 */
const clampedPercentage = computed(() => {
  // Score 1-10 maps to 10-100% (or 0-100% for safety)
  return Math.max(0, Math.min(100, props.stabilityScore * 10));
});

/**
 * Derives the qualitative status label from the stability score (Agent judgment).
 * 8-10: Ready, 4-7: Focusing, 1-3: Exploring.
 */
const clarityStatusLabel = computed(() => {
  if (props.stabilityScore >= 8) {
    return 'Ready for Selection';
  } else if (props.stabilityScore >= 4) {
    return 'Focusing';
  }
  return 'Exploring';
});

/**
 * Dynamically determines the Tailwind CSS class for the descriptive text color.
 * Text color emphasizes the qualitative status based on percentage.
 */
const textColorClass = computed(() => {
  if (clampedPercentage.value > 80) {
    return 'text-green-700';
  } else if (clampedPercentage.value > 40) {
    return 'text-indigo-700';
  }
  return 'text-gray-700';
});
</script>