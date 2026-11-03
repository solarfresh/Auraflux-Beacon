<template>
  <VBox tag="div" class="h-screen w-screen flex flex-col" intent="neutral" surface="soft">
    <VBox tag="header" class="h-14 border-b flex items-center px-6 justify-between" intent="neutral" border="bottom" surface="soft">
      <VTypography tag="h1" size="lg" weight="bold" intent="brand">Auraflux Chess - Knowledge Graph Canvas</VTypography>
      <VButton variant="primary" size="sm" @click="addNode">
        Add Node
      </VButton>
    </VBox>
    <VBox tag="div" class="flex-1 w-full relative">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        @connect="onConnect"
      >
        <Background pattern-color="#aaa" :gap="16" />
        <Controls />
        <MiniMap />
      </VueFlow>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import type { ConceptualEdge, ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow, useVueFlow, type Connection } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { ref } from 'vue';

const { addEdges } = useVueFlow();

const nodes = ref<ConceptualNode[]>([
  { id: '1', type: 'CONCEPT', label: 'Root Node (Chess)', position: { x: 250, y: 100 } },
  { id: '2', type: 'CONCEPT', label: 'Sub Node (Analysis)', position: { x: 100, y: 250 } },
]);

const edges = ref<ConceptualEdge[]>([
  { id: 'e1-2', source: '1', target: '2', type: 'LINK', weight: 1 },
]);

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
      status: 'DRAFT',
    };
    nodes.value.push(newNode);
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
  edges.value.push(newEdge);
  addEdges([connection]);
};
</script>
