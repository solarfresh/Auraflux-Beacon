<template>
  <VBox tag="div" class="conceptual-map-canvas h-full w-full" :intent="intent" :surface="surface">
    <VueFlow
      :nodes="mappedNodes"
      :edges="(edges as any)"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      @node-click="onNodeClick"
      @pane-click="emit('pane-click')"
      @connect="onConnect"
    >
      <template v-for="name in nodeSlotNames" :key="name" #[name]="nodeProps">
        <slot
          name="node-default"
          :node="nodeProps"
        />
      </template>
    </VueFlow>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import { edgeTypes, nodeTypes } from '@auraflux/design-system/constants/canvases';
import type { ConceptualEdge, ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';
import type { IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { VueFlow, type Connection, type Node } from '@vue-flow/core';
import { computed } from 'vue';

const props = defineProps<{
  nodes: ConceptualNode[];
  edges: ConceptualEdge[];
  selectedNodeId?: ID | null;
  isEditing?: boolean;
  intent?: IntentToken;
  surface?: SurfaceToken;
}>();

const nodeSlotNames = Object.keys(nodeTypes).map(t => `node-${t}`);

const mappedNodes = computed<Node[]>(() => props.nodes.map(node => ({
  id: node.id,
  type: node.type || 'CONCEPT',
  label: node.label,
  position: node.position || { x: 0, y: 0 },
  selected: node.id === props.selectedNodeId,
  data: node
})));

const emit = defineEmits<{
  (e: 'add-node'): void;
  (e: 'connect', connection: Connection): void;
  (e: 'node-click', node: { id: ID }): void;
  (e: 'pane-click'): void;
  (e: 'update:selectedNodeId', id: ID | null): void;
}>();

const onNodeClick = ({ node }: { node: { id: ID } }) => {
  emit('node-click', node);
  emit('update:selectedNodeId', node.id);
};

const onConnect = (connection: Connection) => {
  if (connection.source !== connection.target) {
    emit('connect', connection);
  }
};
</script>

<style scoped>
.conceptual-map-canvas {
  width: 100%;
  height: 100%;
}
</style>
