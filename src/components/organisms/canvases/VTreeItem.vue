<template>
  <VBox
    padding="none"
    background="transparent"
    :draggable="true"
    class="w-full transition-transform duration-100 select-none cursor-grab active:cursor-grabbing"
    :class="{ 'opacity-50 scale-95': isDragging }"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <VEntityCard
      :node="node"
      :is-active="isActive"
      padding="xs"
      :show-content="false"
      @click="emit('select', node.id)"
      @mouseenter="emit('hover', node.id)"
      @mouseleave="emit('hover', null)"
    >
      <template #actions>
        <VButton
          variant="ghost"
          size="sm"
          icon-only
          icon-name="ArrowRightCircle"
          @click.stop="emit('teleport', node.id)"
        />
      </template>
    </VEntityCard>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VTreeItem.vue
 * High-cohesion semantic component responsible for tree nodes.
 * Replaced native div with the atomic VBox component to enforce token uniformity.
 */
import { ref } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VEntityCard from '@/components/molecules/resources/VEntityCard.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import type { ConceptualNode } from '@/interfaces/conceptual-map';

const props = defineProps<{
  node: ConceptualNode;
  isActive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'hover', id: string | null): void;
  (e: 'teleport', nodeId: string): void;
}>();

const isDragging = ref(false);

/**
 * Handles HTML5 drag stream initiation.
 * Serializes the structural model payload into the 'application/vueflow' pipeline.
 */
const handleDragStart = (event: DragEvent) => {
  isDragging.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify(props.node));
    event.dataTransfer.effectAllowed = 'move';
  }
};

/**
 * Resets contextual transition flags upon interaction termination.
 */
const handleDragEnd = () => {
  isDragging.value = false;
};
</script>