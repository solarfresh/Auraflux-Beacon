<template>
  <div class="space-y-2">
    <Text tag="h3" size="lg" weight="semibold" color="gray-800">Research Validation</Text>

    <div
      :class="[
        'p-3 rounded-lg border shadow-sm transition flex flex-col',
        statusClasses.container
      ]"
    >
      <div class="flex items-center space-x-2 mb-2">
        <Text tag="span" size="base" weight="bold" :color="statusClasses.text" class="flex items-center">
          <Icon :name="statusClasses.icon" type="solid" size="sm" :color="statusClasses.iconColor" class="mr-1" />
          Feasibility: {{ status }}
        </Text>
      </div>

      <Text tag="p" size="sm" :color="statusClasses.descriptionText">
        {{ description || "Status description is pending." }}
      </Text>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeasibilityStatus as TFeasibilityStatus } from '@/interfaces/core';

import { computed } from 'vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';

// ----------------------------------------------------------------------
// --- Props ---
// ----------------------------------------------------------------------

const props = defineProps<{
  /** The feasibility status of the refined topic (HIGH, MEDIUM, LOW). */
  status: TFeasibilityStatus;
  /** A brief, explanatory description associated with the current status. */
  description: string;
}>();

// ----------------------------------------------------------------------
// --- Computed Status Classes ---
// ----------------------------------------------------------------------

/** Computes the dynamic classes, colors, and icons based on the status. */
const statusClasses = computed(() => {
  switch (props.status) {
    case 'HIGH':
      return {
        container: 'border-green-400 bg-green-50',
        text: 'green-700',
        iconColor: 'green-500',
        icon: 'CheckCircle',
        descriptionText: 'green-600',
      };
    case 'MEDIUM':
      return {
        container: 'border-yellow-400 bg-yellow-50',
        text: 'yellow-700',
        iconColor: 'yellow-500',
        icon: 'QuestionMarkCircle',
        descriptionText: 'yellow-600',
      };
    case 'LOW':
      return {
        container: 'border-red-400 bg-red-50',
        text: 'red-700',
        iconColor: 'red-500',
        icon: 'ExclamationCircle',
        descriptionText: 'red-600',
      };
    default:
      return {
        container: 'border-gray-300 bg-gray-50',
        text: 'gray-700',
        iconColor: 'gray-400',
        icon: 'InformationCircle',
        descriptionText: 'gray-500',
      };
  }
});
</script>