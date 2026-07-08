<template>
  <VBox
    tag="section"
    border="bottom"
    :background="sectionBackground as BackgroundToken"
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
            size="sm"
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
          icon-name="Plus"
          class="opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="emit('add')"
        />
      </VCluster>
    </VBox>

    <transition name="section-slide">
      <VBox v-if="isExpanded" padding="sm" class="pt-0">
        <VStack gap="sm">
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
            @select="(id: ID) => emit('select', id)"
            @hover="(id: ID | null) => emit('hover', id)"
            @teleport="(nodeId: ID) => emit('teleport', nodeId)"
          />
        </VStack>
      </VBox>
    </transition>
  </VBox>
</template>

<script setup lang="ts">
/**
 * SidebarRegistrySection.vue
 * Renders structured stability sub-lists inside the Knowledge Registry Sidebar.
 * Refactored to drop legacy jitter parameters and ensure streamlined custom event bubbling.
 */
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VEmptyState from '@/components/molecules/feedback/VEmptyState.vue';
import VTreeItem from '@/components/organisms/canvases/VTreeItem.vue';
import { computed, ref } from 'vue';

import type { ConceptualNode } from '@/interfaces/conceptual-map';
import type { ID } from '@/interfaces/core';
import type { BackgroundToken } from '@/interfaces/layout';

const props = withDefaults(defineProps<{
  title: string;
  sectionType: 'TOP' | 'MIDDLE' | 'BOTTOM';
  nodes: ConceptualNode[];
  selectedNodeId: ID | null;
  isCollapsible?: boolean;
  canAdd?: boolean;
}>(), {
  isCollapsible: true,
  canAdd: false
});

const emit = defineEmits<{
  (e: 'select', id: ID): void;
  (e: 'hover', id: ID | null): void;
  (e: 'teleport', nodeId: ID): void;
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
    TOP: 'white',
    MIDDLE: 'slate-50',
    BOTTOM: 'indigo-50',
  };
  return mapping[props.sectionType] || 'white';
});
</script>

<style scoped>
/* Motion tokens for expanding/collapsing content drawer safely */
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