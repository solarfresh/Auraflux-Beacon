<template>
  <section
    class="flex flex-col border-b border-gray-100 last:border-0"
    :class="sectionPhysicsClass"
  >
    <header
      class="px-4 py-2 flex items-center justify-between hover:bg-gray-50/50 transition-colors group cursor-pointer"
      @click="toggleSection"
    >
      <div class="flex items-center gap-2">
        <Icon
          v-if="isCollapsible"
          name="chevron-right"
          size="xs"
          class="transition-transform duration-200 text-gray-400"
          :class="{ 'rotate-90': isExpanded }"
        />
        <Text
          tag="span"
          size="xs"
          weight="bold"
          class="uppercase tracking-widest text-gray-500 group-hover:text-indigo-600"
        >
          {{ title }}
        </Text>
        <Text size="xs" color="gray-300">({{ nodes.length }})</Text>
      </div>

      <Button
        v-if="canAdd"
        variant="tertiary"
        size="sm"
        icon-only
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop="emit('add')"
      >
        <Icon name="plus" size="xs" />
      </Button>
    </header>

    <transition name="section-slide">
      <div v-if="isExpanded" class="px-2 pb-3 space-y-0.5">
        <div v-if="nodes.length === 0" class="py-6 text-center">
          <Text size="xs" color="gray-400" italic>No items in this section</Text>
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
import SidebarNodeItem from '@/components/molecules/SidebarNodeItem.vue';
import type { ID } from '@/interfaces/core';
import type { NodeType, ConceptualNode } from '@/interfaces/conceptual-map';

const props = withDefaults(defineProps<{
  title: string;
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

/**
 * EMITS DEFINITION
 */
const emit = defineEmits<{
  (e: 'select', id: ID): void;
  (e: 'teleport', nodeId: string, canvasId?: string): void;
  (e: 'add'): void;
}>();

/**
 * COMPONENT STATE
 * TOP section is always expanded by default to maintain focus.
 */
const isExpanded = ref(true);

/**
 * UI LOGIC
 */
const toggleSection = () => {
  if (props.isCollapsible) {
    isExpanded.value = !isExpanded.value;
  }
};

/**
 * PHYSICS GRADIENT MAPPING
 * Visual cues for the vertical stability gradient.
 */
const sectionPhysicsClass = computed(() => {
  switch (props.sectionType) {
    case 'TOP': return 'bg-transparent'; // North Star stability
    case 'MIDDLE': return 'bg-gray-50/30'; // Structural skeleton
    case 'BOTTOM': return 'bg-indigo-50/10'; // Fluid/volatile evidence
    default: return '';
  }
});
</script>

<style scoped>
/* Transition for smooth collapse/expand */
.section-slide-enter-active,
.section-slide-leave-active {
  transition: all 0.25s ease-out;
  max-height: 1000px;
  overflow: hidden;
}

.section-slide-enter-from,
.section-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
</style>