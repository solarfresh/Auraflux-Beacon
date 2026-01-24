<template>
  <section
    class="flex flex-col border-b border-gray-100 last:border-0 transition-colors duration-300"
    :class="sectionPhysicsClass"
  >
    <header
      class="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors group cursor-pointer"
      @click="toggleSection"
    >
      <div class="flex items-center gap-2">
        <Icon
          v-if="isCollapsible"
          name="ChevronRight"
          size="xs"
          class="transition-transform duration-200 text-gray-400"
          :class="{ 'rotate-90': isExpanded }"
        />

        <div class="flex items-baseline gap-1.5">
          <Text
            tag="span"
            size="xs"
            weight="bold"
            class="uppercase tracking-widest text-gray-500 group-hover:text-indigo-600 transition-colors"
          >
            {{ title }}
          </Text>
          <Text size="xs" color="gray-300" weight="medium">
            {{ nodes.length }}
          </Text>
        </div>
      </div>

      <Button
        v-if="canAdd"
        variant="ghost"
        size="xs"
        icon-only
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop="emit('add')"
      >
        <Icon name="Plus" size="xs" color="gray-500" />
      </Button>
    </header>

    <transition name="section-slide">
      <div v-if="isExpanded" class="px-2 pb-3 space-y-0.5">
        <div v-if="nodes.length === 0" class="py-8 text-center flex flex-col items-center gap-1">
          <Text size="xs" color="gray-400" italic>No items available</Text>
        </div>

        <SidebarNodeItem
          v-for="node in nodes"
          :key="node.id"
          :node="node"
          :is-active="selectedNodeId === node.id"
          :allow-jitter="sectionType !== 'TOP'"
          @click="emit('select', node.id)"
          @teleport="data => emit('teleport', data)"
        />
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Text from '@/components/atoms/Text.vue';
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';
import SidebarNodeItem from '@/components/molecules/list-items/SidebarNodeItem.vue';
import type { ID } from '@/interfaces/core';
import type { NodeType, ConceptualNode } from '@/interfaces/conceptual-map';

/**
 * SidebarRegistrySection: Manages groups of conceptual nodes.
 * Used primarily within the Discovery/Exploration sidebar to represent
 * the "Stability Gradient" of the research data.
 */

const props = withDefaults(defineProps<{
  title: string;
  /** Visual mapping of data stability: TOP (Stable) -> BOTTOM (Volatile) */
  sectionType: 'TOP' | 'MIDDLE' | 'BOTTOM';
  nodeTypes: NodeType[];
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
  /** Teleports the canvas view to a specific node */
  (e: 'teleport', nodeId: string, canvasId?: string): void;
  (e: 'add'): void;
}>();

// --- State Management ---
// Defaulting to expanded for the high-priority "TOP" section
const isExpanded = ref(props.sectionType === 'TOP' || !props.isCollapsible);

// --- Logic Handlers ---
const toggleSection = () => {
  if (props.isCollapsible) {
    isExpanded.value = !isExpanded.value;
  }
};

/**
 * Section Physics Logic:
 * Provides background tints to visually represent the stability level.
 */
const sectionPhysicsClass = computed(() => {
  const mapping = {
    TOP: 'bg-transparent',          // Pure, focused stability
    MIDDLE: 'bg-gray-50/40',       // Standard structural layout
    BOTTOM: 'bg-indigo-50/15',     // Fluid, exploration zone
  };
  return mapping[props.sectionType] || '';
});
</script>

<style scoped>
/* Smooth expand/collapse transitions */
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