<template>
  <VStatusCard
    :variant="config.variant"
    :icon-name="config.icon"
  >
    <template #title>
      {{ config.label }}
    </template>

    <slot>
      {{ config.description }}
    </slot>
  </VStatusCard>
</template>

<script setup lang="ts">
/**
 * VReflectionStatus Component
 * Maps reflection log statuses (DRAFT/COMMITTED) to the indicator system.
 */
import { computed } from 'vue';
import VStatusCard from '@/components/molecules/indicators/VStatusCard.vue';

// Define the available statuses for the reflection system
type ReflectionStatus = 'draft' | 'committed';

interface Props {
  /** Current persistence status of the log entry */
  status: ReflectionStatus;
}

const props = defineProps<Props>();

/**
 * Status Configuration Mapping
 * Translates log states into semantic variants and helpful descriptions.
 */
const config = computed(() => {
  const map: Record<ReflectionStatus, { variant: 'warning' | 'success', icon: string, label: string, description: string }> = {
    draft: {
      variant: 'warning',
      icon: 'DocumentText',
      label: 'Draft Mode',
      description: 'Changes are saved locally. Commit the entry to finalize this reflection.'
    },
    committed: {
      variant: 'success',
      icon: 'CheckBadge',
      label: 'Committed Entry',
      description: 'This reflection is verified and part of the permanent log. Enable editing to make changes.'
    }
  };

  return map[props.status];
});
</script>