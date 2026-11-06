<template>
  <VBox tag="div" class="h-screen w-screen flex flex-col" intent="neutral" surface="soft">
    <VBox tag="header" class="h-14 border-b flex items-center px-6 justify-between" intent="neutral" border="bottom" surface="soft">
      <VTypography tag="h1" size="lg" weight="bold" intent="brand">Auraflux Chess - Knowledge Graph Canvas</VTypography>
      <VButton variant="primary" size="sm" :disabled="isAdding" @click="addNode">
        Add Node
      </VButton>
    </VBox>
    <VBox tag="div" class="flex-1 w-full relative">
      <VConceptualMapCanvas
        :nodes="nodes"
        :edges="edges"
        intent="neutral"
        surface="soft"
        @connect="onConnect"
      >
        <template #node-default="{ node }">
          <component :is="node.type === 'CONCEPT' ? VConceptualNode : 'div'" v-bind="node" />
        </template>
      </VConceptualMapCanvas>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VConceptualNode from '@auraflux/design-system/components/organisms/canvases/VConceptualNode.vue';
import VConceptualMapCanvas from '@auraflux/design-system/components/organisms/canvases/VConceptualMapCanvas.vue';
import type { ConceptualEdge, ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import { useConceptualMapContext } from '@auraflux/shared-core/composables/useConceptualMapContext';
import type { Connection } from '@vue-flow/core';
import { ref, computed } from 'vue';

const { instance, addNode: addNodeToContext, addEdge: addEdgeToContext } = useConceptualMapContext();

const nodes = computed(() => Array.from(instance.conceptualNodes.values()).map(node => ({
  ...node,
  position: node.position || { x: 0, y: 0 }
})));
const edges = computed(() => instance.conceptualEdges);

const isAdding = ref(false);

const addNode = () => {
  if (isAdding.value) return;
  isAdding.value = true;

  try {
    const timestamp = Date.now();
    const id = `node-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    const newNode: ConceptualNode = {
      id,
      label: `New Concept`,
      type: 'CONCEPT',
      position: {
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
      },
    };
    addNodeToContext(newNode);
  } catch (error) {
    console.error('NodeCreationError:', error);
  } finally {
    isAdding.value = false;
  }
};

const onConnect = (connection: Connection) => {
  if (connection.source === connection.target) {
    console.warn('Reject self-loop connection');
    return;
  }
  const newEdge: ConceptualEdge = {
    id: `e-${connection.source}-${connection.target}-${Date.now()}`,
    source: connection.source,
    target: connection.target,
    type: 'LINK',
    weight: 1,
  };
  addEdgeToContext(newEdge);
};
</script>
