<template>
  <div class="space-y-3">
    <VTypography tag="h3" size="lg" weight="semibold" color="gray-800">
      {{ label }}
    </VTypography>

    <div
      class="bg-gray-100 rounded-full h-2.5 overflow-hidden"
      role="progressbar"
      :aria-valuenow="clampedPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <VProgressSegment
        :width="clampedPercentage"
        :color="color"
      />
    </div>

    <div class="flex items-center space-x-2">
      <VTypography
        tag="span"
        size="sm"
        weight="bold"
        :color="statusColor"
      >
        {{ clarityStatusLabel }}
      </VTypography>

      <VTypography
        tag="span"
        size="sm"
        color="gray-500"
      >
        {{ description }}
      </VTypography>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VProgressSegment from '@/components/atoms/indicators/VProgressSegment.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import { getStabilityContext } from '@/logic/workflow';

/**
 * TopicStatusIndicator Molecule
 * Translates an Agent-provided stability score into a visual status bar
 * and human-readable feedback label.
 */
const props = defineProps({
  /** Score from 1 to 10 (Agent Judgment) */
  stabilityScore: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 10,
  },
  /** Heading for the indicator group */
  label: {
    type: String,
    default: 'Status',
  },
  /** Sub-text to explain the current status */
  description: {
    type: String,
    default: 'status indicator',
  },
  /** Visual theme for the progress bar segment */
  color: {
    type: String as () => 'indigo' | 'green' | 'gray',
    default: 'indigo',
  },
});

/** Maps 1-10 score to 0-100% width */
const clampedPercentage = computed(() => {
  return Math.max(0, Math.min(100, props.stabilityScore * 10));
});

/** Fetches qualitative label based on workflow logic (e.g., 'Ready', 'Focusing') */
const clarityStatusLabel = computed(() => {
  return getStabilityContext(props.stabilityScore);
});

/** * Returns standard color names compatible with Text.vue color prop
 * Based on the calculated percentage.
 */
const statusColor = computed(() => {
  if (clampedPercentage.value >= 80) return 'green-700';
  if (clampedPercentage.value >= 40) return 'indigo-700';
  return 'gray-700';
});
</script>