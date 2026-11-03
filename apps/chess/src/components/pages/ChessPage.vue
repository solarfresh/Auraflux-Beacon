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
import { ref } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

const { addEdges } = useVueFlow();

const nodes = ref([
  { id: '1', type: 'input', label: 'Root Node (Chess)', position: { x: 250, y: 100 } },
  { id: '2', type: 'default', label: 'Sub Node (Analysis)', position: { x: 100, y: 250 } },
]);

const edges = ref([
  { id: 'e1-2', source: '1', target: '2', animated: true },
]);

const addNode = () => {
  const id = `${nodes.value.length + 1}`;
  const newNode = {
    id,
    label: `New Node ${id}`,
    position: {
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
    },
  };
  nodes.value.push(newNode);
};

const onConnect = (connection: any) => {
  if (connection.source === connection.target) {
    console.warn('Reject self-loop connection');
    return;
  }
  addEdges([connection]);
};
</script>
