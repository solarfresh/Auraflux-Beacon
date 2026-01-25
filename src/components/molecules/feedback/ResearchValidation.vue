<template>
  <div class="flex flex-col gap-2">
    <VTypography v-if="title" tag="h3" size="sm" weight="bold" color="gray-500" class="uppercase tracking-wider px-1">
      {{ title }}
    </VTypography>

    <div
      :class="[
        'p-4 rounded-md border transition-all duration-300 flex flex-col gap-2',
        statusClasses.container
      ]"
    >
      <div class="flex items-center gap-2">
        <VIcon
          :name="statusClasses.icon"
          type="solid"
          size="sm"
          :color="statusClasses.color"
        />

        <VTypography tag="span" size="base" weight="bold" :color="statusClasses.color">
          Feasibility: {{ status }}
        </VTypography>
      </div>

      <VTypography tag="p" size="sm" :color="statusClasses.color" class="opacity-90 leading-relaxed">
        {{ description || "Status evaluation pending system analysis." }}
      </VTypography>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FeasibilityStatus } from '@/interfaces/core';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

const props = defineProps<{
  /** Optional header text (e.g., "Research Validation") */
  title?: string;
  /** The feasibility status (HIGH, MEDIUM, LOW) */
  status: FeasibilityStatus;
  /** Detailed rationale behind the status */
  description: string;
}>();

/** * Refined Status Mapping:
 * Using 'emerald' and 'amber' for a more modern scientific UI palette.
 */
const statusClasses = computed(() => {
  switch (props.status) {
    case 'HIGH':
      return {
        container: 'border-emerald-200 bg-emerald-50 shadow-sm',
        color: 'emerald-700',
        icon: 'CheckCircle',
      };
    case 'MEDIUM':
      return {
        container: 'border-amber-200 bg-amber-50 shadow-sm',
        color: 'amber-700',
        icon: 'QuestionMarkCircle',
      };
    case 'LOW':
      return {
        container: 'border-red-200 bg-red-50 shadow-sm',
        color: 'red-700',
        icon: 'ExclamationCircle',
      };
    default:
      return {
        container: 'border-gray-200 bg-gray-50',
        color: 'gray-600',
        icon: 'InformationCircle',
      };
  }
});
</script>