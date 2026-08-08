<template>
  <VBox
    tag="nav"
    :intent="intent"
    :surface="surface"
    :border="border"
    :padding="padding"
    :class="[
      'w-full z-20',
      sticky ? 'sticky top-0' : 'relative'
    ]"
  >
    <VCluster justify="between" align="center" gap="md">
      <!-- Start area: For primary controls, titles, or VSegmentedControl -->
      <VCluster gap="sm" align="center">
        <slot name="start" />
      </VCluster>

      <!-- Center area (optional): For search inputs or centered page titles -->
      <template if="$slots.center">
        <VCluster gap="sm" align="center">
          <slot name="center" />
        </VCluster>
      </template>

      <!-- End area: For secondary controls (e.g., VSelect, VDivider, VButton) -->
      <VCluster gap="md" align="center">
        <slot name="end" />
      </VCluster>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VToolbar
 * Organism Layout Component
 * Provides a standardized navigation/toolbar shell with flexible slot regions.
 */
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import type {
  AttentionToken,
  BorderToken,
  IntentToken,
  RoundedToken,
  SpacingToken,
  SurfaceToken,
} from '@auraflux/design-system/interfaces/theme';

export interface VToolbarProps {
  padding?: SpacingToken;
  rounded?: RoundedToken;
  border?: BorderToken;
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  /** Whether the toolbar should stick to the top of the viewport */
  sticky?: boolean;
};

withDefaults(defineProps<VToolbarProps>(), {
  intent: 'neutral',
  surface: 'base',
  padding: 'none',
  border: 'none',
  sticky: true,
});
</script>