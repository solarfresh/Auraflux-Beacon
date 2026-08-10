<template>
  <VBox
    v-if="boundaries && boundaries.length > 0"
    intent="danger"
    surface="soft"
    padding="sm"
    rounded="md"
    border="all"
    class="w-full"
  >
    <VStack gap="xs" align="stretch">
      <!-- Header: Title & Count Badge using VCluster -->
      <VCluster justify="between" align="center" fullWidth>
        <VCluster gap="xs" align="center">
          <VIcon
            :name="icon"
            size="xs"
            type="solid"
            class="shrink-0"
          />
          <VTypography
            tag="span"
            size="xs"
            weight="bold"
            class="uppercase tracking-wider"
          >
            {{ title }}
          </VTypography>
          <VBadge
            v-if="boundaries.length > 1"
            intent="danger"
            surface="solid"
            size="xs"
            class="font-mono"
          >
            {{ boundaries.length }}
          </VBadge>
        </VCluster>

        <!-- Collapse Toggle -->
        <VButton
          v-if="boundaries.length > maxVisible"
          size="xs"
          intent="danger"
          surface="base"
          class="p-0 h-auto"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? 'Collapse ▲' : `+${boundaries.length - maxVisible} more...` }}
        </VButton>
      </VCluster>

      <!-- Boundaries Grid Container using VGrid -->
      <VGrid
        :cols="gridColsConfig"
        gap="xs"
        align="stretch"
      >
        <VCluster
          v-for="(rule, index) in displayedBoundaries"
          :key="index"
          gap="xs"
          align="start"
          fullWidth
          class="p-1.5 rounded text-xs"
        >
          <VTypography tag="span" size="xs" weight="medium" class="font-bold shrink-0">•</VTypography>
          <VTypography
            tag="span"
            size="xs"
            weight="medium"
            class="leading-tight wrap-break-words flex-1"
          >
            {{ rule }}
          </VTypography>
        </VCluster>
      </VGrid>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VBoundaryBadge Molecule
 * Displays Layer 1 ChunkScope.boundaries (prohibited boundaries / hard constraints).
 * Fully refactored using VBox, VStack, VCluster, and VGrid Layout Atoms.
 */
import { ref, computed } from 'vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VGrid from '@auraflux/design-system/components/atoms/layout/VGrid.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';

export interface VBoundaryBadgeProps {
  /** Icon representation */
  icon?: string;
  /** Label header title */
  title?: string;
  /** List of boundary constraints from ChunkScope.boundaries */
  boundaries?: string[];
  /** Maximum visible items before collapse */
  maxVisible?: number;
}

const props = withDefaults(defineProps<VBoundaryBadgeProps>(), {
  icon: 'NoSymbol',
  title: 'Non-negotiable Boundaries',
  boundaries: () => [],
  maxVisible: 2,
});

const isExpanded = ref(false);

const displayedBoundaries = computed(() => {
  if (isExpanded.value || props.boundaries.length <= props.maxVisible) {
    return props.boundaries;
  }
  return props.boundaries.slice(0, props.maxVisible);
});

// Dynamic grid configuration mapping for VGrid
const gridColsConfig = computed<number | string>(() => {
  return displayedBoundaries.value.length === 2 ? '1 sm:2' : 1;
});
</script>