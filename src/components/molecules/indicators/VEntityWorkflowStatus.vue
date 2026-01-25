<template>
  <VStatusCard
    :variant="config.variant"
    :icon-name="config.icon"
  >
    <template #title>
      {{ config.label }}
    </template>

    <VTypography tag="p" size="xs">
      <slot>
        {{ config.description }}
      </slot>
    </VTypography>
  </VStatusCard>
</template>

<script setup lang="ts">
/**
 * VEntityWorkflowStatus Component
 * Manages the lifecycle and permission state of an entity.
 * Maps backend workflow states to UI themes.
 */
import { computed } from 'vue';
import VStatusCard from '@/components/molecules/indicators/VStatusCard.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

// Define the expected entity statuses based on the system's core interfaces
type EntityStatus = 'LOCKED' | 'AI_EXTRACTED' | 'ON_HOLD' | 'USER_DRAFT';

interface Props {
  /** The current workflow state of the entity */
  status: EntityStatus;
}

const props = defineProps<Props>();

/**
 * Workflow Mapping
 * Maps administrative states to semantic variants and Heroicons.
 */
const config = computed(() => {
  const map = {
    LOCKED: {
      variant: 'info' as const,
      icon: 'LockClosed',
      label: 'Locked',
      description: 'This item is verified and locked. Editing is restricted.'
    },
    AI_EXTRACTED: {
      variant: 'warning' as const,
      icon: 'Sparkles',
      label: 'AI Extracted',
      description: 'Extracted by AI. Review and modify to stabilize.'
    },
    ON_HOLD: {
      variant: 'secondary' as const,
      icon: 'ArchiveBox',
      label: 'On Hold',
      description: 'Temporarily sidelined. This item will not be used in active research.'
    },
    USER_DRAFT: {
      variant: 'secondary' as const,
      icon: 'PencilSquare',
      label: 'Draft',
      description: 'Local changes detected. Save to update system state.'
    }
  };

  return map[props.status] || map.USER_DRAFT;
});
</script>