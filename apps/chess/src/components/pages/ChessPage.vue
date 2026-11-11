<template>
  <VBox tag="div" class="h-screen w-screen flex flex-col overflow-hidden" intent="neutral" surface="soft">
    <VBox tag="header" class="h-14 border-b flex items-center px-6 justify-between shrink-0" intent="neutral" border="bottom" surface="soft">
      <VTypography tag="h1" size="lg" weight="bold" intent="brand">Auraflux Chess - Knowledge Graph Canvas</VTypography>
      <VButton variant="primary" size="sm" :disabled="isAdding" @click="addNode">
        Add Node
      </VButton>
    </VBox>
    <VBox tag="div" class="flex-1 w-full flex flex-row overflow-hidden">
      <VBox tag="div" class="flex-1 h-full relative overflow-hidden">
        <VConceptualMapCanvas
          :nodes="nodes"
          :edges="edges"
          :selected-node-id="selectedNodeId"
          :selected-edge-id="selectedEdgeId"
          intent="neutral"
          surface="soft"
          @connect="onConnect"
          @node-click="selectNode"
          @edge-click="selectEdge"
          @pane-click="deselectAllAndClosePanel"
        >
          <template #node-default="{ node }">
            <VConceptualNode
              v-bind="node"
              :isEditing="isEditing && selectedNodeId === node.id"
              @update:isEditing="(val: boolean) => isEditing = val"
              @update:label="(label: string) => updateNodeInContext(node.id, { ...node.data, label })"
            />
          </template>
        </VConceptualMapCanvas>
      </VBox>
      <VInspectorPanel
        v-model:is-expanded="isPanelExpanded"
        intent="neutral"
        surface="soft"
        border="left"
      >
        <VNodeInspectorPanel v-if="selectedNodeId" :node="selectedNode" @update:node="onUpdateNode" />
        <VEdgeInspectorPanel v-else-if="selectedEdgeId" :edge="selectedEdge" @update:edge="onUpdateEdge" />
      </VInspectorPanel>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VConceptualMapCanvas from '@auraflux/design-system/components/organisms/canvases/VConceptualMapCanvas.vue';
import VConceptualNode from '@auraflux/design-system/components/organisms/canvases/VConceptualNode.vue';
import VEdgeInspectorPanel from '@auraflux/design-system/components/organisms/canvases/VEdgeInspectorPanel.vue';
import VNodeInspectorPanel from '@auraflux/design-system/components/organisms/canvases/VNodeInspectorPanel.vue';
import VInspectorPanel from '@auraflux/design-system/components/organisms/layout/VInspectorPanel.vue';
import type { ConceptualEdge, ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { useConceptualMapContext } from '@auraflux/shared-core/composables/useConceptualMapContext';
import { useCanvasKeyboardShortcuts } from '@auraflux/shared-core/composables/useCanvasKeyboardShortcuts';
import type { Connection } from '@vue-flow/core';
import { computed, ref, watch } from 'vue';

const context = useConceptualMapContext();
const {
  selectedNodeId,
  selectedEdgeId,
  selectNode: selectNodeInContext,
  selectEdge: selectEdgeInContext,
  deselectAll,
  instance, addNode: addNodeToContext,
  addEdge: addEdgeToContext,
  updateNode: updateNodeInContext,
  updateEdge: updateEdgeInContext,
  removeNode: removeNodeInContext,
  removeEdge: removeEdgeInContext,
} = context;

const isEditing = ref(false);
const isPanelExpanded = ref(true);

const deselectAllAndClosePanel = () => {
  deselectAll();
  isPanelExpanded.value = false;
};

watch([selectedNodeId, selectedEdgeId], ([newNodeId, newEdgeId]) => {
  if (newNodeId || newEdgeId) {
    isPanelExpanded.value = true;
  }
});

useCanvasKeyboardShortcuts({
  selectedNodeId,
  selectedEdgeId,
  removeNode: removeNodeInContext,
  removeEdge: removeEdgeInContext,
});

const selectNode = (node: { id: ID }) => {
  if (isEditing.value) return;
  selectNodeInContext(node.id);
};

const selectEdge = (edge: { id: ID }) => {
  if (isEditing.value) return;
  selectEdgeInContext(edge.id);
};

const selectedNode = computed(() => {
  return selectedNodeId.value ? instance.conceptualNodes.get(selectedNodeId.value) || null : null;
});

const selectedEdge = computed(() => {
  return selectedEdgeId.value ? instance.conceptualEdges.find(e => e.id === selectedEdgeId.value) || null : null;
});

const nodes = computed(() => Array.from(instance.conceptualNodes.values()));
const edges = computed(() => instance.conceptualEdges);

const isAdding = ref(false);

const addNode = () => {
  if (isAdding.value) return;
  isAdding.value = true;

  try {
    addNodeToContext();
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

const onUpdateNode = (node: ConceptualNode) => {
  updateNodeInContext(node.id, node);
}

const onUpdateEdge = (edge: ConceptualEdge) => {
  updateEdgeInContext(edge.id, edge);
};
</script>
