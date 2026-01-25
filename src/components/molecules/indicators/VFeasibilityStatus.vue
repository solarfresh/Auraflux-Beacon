<template>
  <VStatusCard
    :variant="config.variant"
    :icon-name="config.icon"
    :title="title"
  >
    <template #title>
      Feasibility: {{ status }}
    </template>

    {{ description || "Pending AI grounding analysis..." }}
  </VStatusCard>
</template>

<script setup lang="ts">
/**
 * VFeasibilityStatus Component
 * Business-logic wrapper for feasibility analysis.
 * Maps HIGH/MEDIUM/LOW statuses to success/warning/danger themes.
 */
import { computed } from 'vue';
import type { FeasibilityStatus } from '@/interfaces/core';
import VStatusCard from '@/components/molecules/indicators/VStatusCard.vue';

interface Props {
  /** The feasibility enum value from the backend (HIGH, MEDIUM, LOW) */
  status: FeasibilityStatus;
  /** The rationale or evidence provided by the AI */
  description?: string;
  /** Optional secondary title for the card header */
  title?: string;
}

const props = defineProps<Props>();

/**
 * Business Logic Mapping
 * Translates domain status to Bootstrap-based UI variants and Heroicons.
 */
const config = computed(() => {
  const map: Record<FeasibilityStatus, { variant: 'success' | 'warning' | 'danger', icon: string }> = {
    HIGH: {
      variant: 'success',
      icon: 'CheckCircle'
    },
    MEDIUM: {
      variant: 'warning',
      icon: 'QuestionMarkCircle'
    },
    LOW: {
      variant: 'danger',
      icon: 'ExclamationCircle'
    }
  };

  // Fallback to warning if status is unknown
  return map[props.status] || { variant: 'warning', icon: 'InformationCircle' };
});
</script>