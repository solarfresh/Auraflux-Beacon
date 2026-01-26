<template>
  <VBox
    tag="section"
    border="bottom"
    :background="sectionBackground"
    class="transition-colors duration-300"
  >
    <VBox
      padding="md"
      class="cursor-pointer group hover:bg-slate-50/80 transition-colors"
      @click="toggleSection"
    >
      <VCluster justify="between" align="center">
        <VCluster gap="xs" align="center">
          <VIcon
            v-if="isCollapsible"
            name="ChevronRight"
            size="4"
            class="transition-transform duration-200 text-slate-400"
            :class="{ 'rotate-90': isExpanded }"
          />

          <VCluster gap="xs" align="baseline">
            <VTypography
              tag="span"
              size="xs"
              weight="bold"
              class="uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors"
            >
              {{ title }}
            </VTypography>
            <VTypography size="xs" class="text-slate-300" weight="medium">
              {{ nodes.length }}
            </VTypography>
          </VCluster>
        </VCluster>

        <VButton
          v-if="canAdd"
          variant="ghost"
          size="xs"
          icon-only
          class="opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="emit('add')"
        >
          <VIcon name="Plus" size="4" />
        </VButton>
      </VCluster>
    </VBox>

    <transition name="section-slide">
      <VBox v-if="isExpanded" padding="sm" class="pt-0">
        <VStack gap="1">
          <VEmptyState
            v-if="nodes.length === 0"
            title="No items available"
            class="py-8"
          >
            <template #description>
              <VTypography size="xs" class="text-slate-400" italic>
                Ready for exploration
              </VTypography>
            </template>
          </VEmptyState>

          <VTreeItem
            v-for="node in nodes"
            :key="node.id"
            :node="node"
            :is-active="selectedNodeId === node.id"
            :allow-jitter="sectionType !== 'TOP'"
            @click="emit('select', node.id)"
            @teleport="data => emit('teleport', data)"
          />
        </VStack>
      </VBox>
    </transition>
  </VBox>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// Atomic Imports
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
// Molecule Imports
import VTreeItem from '@/components/molecules/navs/VTreeItem.vue';
import VEmptyState from '@/components/molecules/indicators/VEmptyState.vue';

import type { ID } from '@/interfaces/core';
import type { NodeType, ConceptualNode } from '@/interfaces/conceptual-map';

/**
 * VStabilitySection: Represents a gradient of data stability in ISP.
 * Aligns with "Molecules: Navs" (VNavGroup pattern).
 */
const props = withDefaults(defineProps<{
  title: string;
  sectionType: 'TOP' | 'MIDDLE' | 'BOTTOM';
  nodes: ConceptualNode[];
  selectedNodeId: ID | null;
  isCollapsible?: boolean;
  canAdd?: boolean;
}>(), {
  isCollapsible: true,
  canAdd: true
});

const emit = defineEmits<{
  (e: 'select', id: ID): void;
  (e: 'teleport', data: any): void;
  (e: 'add'): void;
}>();

// --- State ---
const isExpanded = ref(props.sectionType === 'TOP' || !props.isCollapsible);

const toggleSection = () => {
  if (props.isCollapsible) isExpanded.value = !isExpanded.value;
};

// --- Architectural Layout Logic ---
const sectionBackground = computed(() => {
  const mapping = {
    TOP: 'white',           // Stable foundation
    MIDDLE: 'slate-50',     // Transitioning
    BOTTOM: 'indigo-50',    // High-volatility exploration
  };
  return mapping[props.sectionType] || 'white';
});
</script>

<style scoped>
/* Motion tokens for expanding/collapsing content */
.section-slide-enter-active,
.section-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1200px;
  overflow: hidden;
}
.section-slide-enter-from,
.section-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
</style>