<template>
  <VBox
    padding="none"
    rounded="md"
    border="all"
    class="px-2 transition-colors inline-block"
  >
    <VCluster inline align="center" gap="xs">
      <!-- 1. Subject / Entity -->
      <VTypography
        tag="span"
        size="xs"
        weight="bold"
        intent="neutral"
        surface="soft"
        border="all"
        class="shrink-0"
      >
        {{ subject }}
      </VTypography>

      <!-- 2. Predicate / Relation -->
      <VTypography
        tag="span"
        size="xs"
        weight="normal"
        intent="neutral"
        surface="solid"
        class="italic shrink-0"
      >
        {{ predicate }}
      </VTypography>

      <!-- 3. Object / Metric Value -->
      <VBadge
        intent="brand"
        surface="soft"
        size="xs"
        border="all"
        class="font-semibold shrink-0"
      >
        {{ object }}
      </VBadge>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VBoundTripleBadge Molecule
 * Binds Entity + Relation + Metric/Object into a single structured triple badge.
 * Designed for Knowledge Graph / Repository Chunk Layer 3 display.
 * Fully refactored using VBox, VCluster, VTypography, and VBadge.
 */
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';

export interface VBoundTripleBadgeProps {
  /** Entity / Subject (e.g., "Third-Party Data Processing") */
  subject: string;
  /** Relation / Predicate (e.g., "must comply with") */
  predicate: string;
  /** Metric / Object Value (e.g., "EU GDPR Art. 28") */
  object: string;
}

defineProps<VBoundTripleBadgeProps>();
</script>