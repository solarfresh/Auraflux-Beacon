<template>
  <VAlert
    :variant="variant"
    :border="border"
    padding="md"
    rounded="lg"
  >
    <VStack gap="sm">
      <VCluster gap="sm" align="center">
        <VIcon
          v-if="iconName"
          :name="iconName"
          size="sm"
          type="solid"
        />
        <VTypography tag="strong" size="sm" weight="bold">
          <slot name="title" />
        </VTypography>
      </VCluster>

      <VTypography tag="div" size="xs" class="opacity-90 leading-relaxed">
        <slot />
      </VTypography>
    </VStack>
  </VAlert>
</template>

<script setup lang="ts">
/**
 * VStatusCard Component
 * A layout-driven molecule that wraps VAlert to provide a consistent
 * format for entity statuses and feasibility reports.
 */
import VAlert from '@/components/molecules/indicators/VAlert.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

interface Props {
  /** Bootstrap-based semantic variant passed to VAlert */
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  /** Heroicon name for the status indicator */
  iconName?: string;
  /** Whether to show the container border */
  border?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
  border: true
});
</script>