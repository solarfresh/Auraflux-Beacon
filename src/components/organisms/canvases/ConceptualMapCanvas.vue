<template>
  <VBox class="h-full w-full relative group overflow-hidden" background="slate-50">
    <VueFlow
      :nodes="vueFlowNodes"
      :edges="vueFlowEdges"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      :fit-view-on-init="true"
      :default-zoom="1.2"
      :max-zoom="4"
      :min-zoom="0.2"
      @node-drag-stop="handleNodeDragStop"
      @connect="startEdgeEdit"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      :edge-updater-radius="20"
      @edge-update="updateRelation"
    >
      <Background :pattern-gap="20" pattern-color="#e2e8f0" />
      <Controls position="bottom-left" class="mb-4 ml-4" />
      <VEdgeFloatingEditor />
      <VNodeFloatingEditor />

    </VueFlow>
  </VBox>
</template>

<script setup lang="ts">
import type { ID } from '@/interfaces/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MarkerType, type NodeDragEvent, VueFlow } from '@vue-flow/core';
import { computed, markRaw, provide, ref, watch } from 'vue';

// Atoms & Molecules
import VBox from '@/components/atoms/layout/VBox.vue';
import VEdgeFloatingEditor from '@/components/molecules/canvases/VEdgeFloatingEditor.vue';
import VNodeFloatingEditor from '@/components/molecules/canvases/VNodeFloatingEditor.vue';
import VConceptualEdge from '@/components/organisms/canvases/VConceptualEdge.vue';
import VConceptualNode from '@/components/organisms/canvases/VConceptualNode.vue';

import { useCanvasDrop } from '@/composables/useCanvasDrop';
import { useConceptualMapContext } from '@/composables/useConceptualMapContext';
import { useEdgeInterceptor } from '@/composables/useEdgeInterceptor';
import { ConceptualMapContextKey } from '@/constants/injection-keys';
import type { ConceptualNode } from '@/interfaces/conceptual-map';

const props = defineProps<{
  projectId: ID;
  canvasId: ID;
  registryCount: number;
}>();

const isLoading = ref(false);

const canvasContext = useConceptualMapContext({
  getCanvasId: () => props.canvasId,
  getProjectId: () => props.projectId,
  getRegistryCount: () => props.registryCount
});
provide(ConceptualMapContextKey, canvasContext);

watch(
  () => props.canvasId,
  async (newId) => {
    if (!newId) return;

    try {
      isLoading.value = true;
      // Context encapsulates its own asynchronous fetching flow
      await canvasContext.fetchGraphData();
    } catch (error) {
      console.error('[Canvas Initialize Error] Fetch failed:', error);
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);

const { onDragOver, onDrop, onDragLeave } = useCanvasDrop(canvasContext);
const { startEdgeEdit, updateRelation } = useEdgeInterceptor(canvasContext);

const edgeTypes = {
  REF: markRaw(VConceptualEdge),
  VALIDATES: markRaw(VConceptualEdge),
  CONSTRAINS: markRaw(VConceptualEdge),
  TRIGGERS: markRaw(VConceptualEdge),
  LINK: markRaw(VConceptualEdge),
};

const nodeTypes = {
  FOCUS: markRaw(VConceptualNode),
  EVENT: markRaw(VConceptualNode),
  OUTCOME: markRaw(VConceptualNode),
  BOUNDARY: markRaw(VConceptualNode),
  ENTITY: markRaw(VConceptualNode),
  CONCEPT: markRaw(VConceptualNode),
  INSIGHT: markRaw(VConceptualNode),
  RESOURCE: markRaw(VConceptualNode),
  QUERY: markRaw(VConceptualNode),
  NAVIGATION: markRaw(VConceptualNode),
  GROUP: markRaw(VConceptualNode),
};

const vueFlowNodes = computed(() => Array.from(canvasContext.conceptualNodes.values()).map(n => ({
  id: n.id,
  position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
  data: { ...n },
  type: n.type,
})));

const vueFlowEdges = computed(() => canvasContext.conceptualEdges.value.map(e => ({
  id: e.id,
  updatable: true,
  source: e.source,
  sourceHandle: e.sourceHandle,
  target: e.target,
  targetHandle: e.targetHandle,
  type: e.type ?? 'REF',
  label: e.label,
  animated: e.type === 'TRIGGERS',
  data: {
    type: e.type,
    status: e.status,
    evidence: e.evidence,
    weight: e.weight
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: e.type === 'TRIGGERS' ? '#d97706' : '#94a3b8',
  },
})));

function handleNodeDragStop({ node }: NodeDragEvent) {
  const updatedNode: ConceptualNode = {
    ...node.data,
    position: { x: node.position.x, y: node.position.y }
  };
  canvasContext.updateConceptualMapNode(updatedNode, 'move');
}
</script>