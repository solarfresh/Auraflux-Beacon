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
      @connect="handleConnect"
      @edge-update="handleEdgeUpdate"
      @node-double-click="handleNodeDoubleClick"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @edit="startEdit"
    >
      <Background :pattern-gap="20" pattern-color="#e2e8f0" />
      <Controls position="bottom-left" class="mb-4 ml-4" />
      <VEdgeFloatingEditor />

    </VueFlow>

    <VModal
      :is-open="isEditModalOpen"
      title="Refine Research Node"
      size="md"
    >
      <template #header-icon>
        <VIcon name="DocumentText" class="text-indigo-600" />
      </template>

      <VStack gap="lg" class="py-4">
        <VFormField id="concept-label" label="Concept / Label">
          <VInput
            v-model="localLabel"
            placeholder="e.g., Socio-economic Resilience"
            size="lg"
          />
        </VFormField>

        <VFormField id="strategic-reflection" label="Strategic Reflection">
          <VTextarea
            v-model="localNotes"
            :rows="5"
            placeholder="Record why this concept is critical..."
          />
        </VFormField>
      </VStack>

      <template #footer>
        <VButtonToolbar :is-proceed-ready="false">
          <VButton variant="ghost" @click="isEditModalOpen = false">Cancel</VButton>
          <VButton variant="primary" @click="saveEdit">Apply Changes</VButton>
        </VButtonToolbar>
      </template>
    </VModal>
  </VBox>
</template>

<script setup lang="ts">
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow, type EdgeUpdateEvent, type NodeDragEvent } from '@vue-flow/core';
import { computed, markRaw, ref } from 'vue';

// Atoms & Molecules
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VEdgeFloatingEditor from '@/components/molecules/canvases/VEdgeFloatingEditor.vue';
import VModal from '@/components/molecules/feedback/VModal.vue';
import VButtonToolbar from '@/components/molecules/forms/VButtonToolbar.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VConceptualEdge from '@/components/organisms/canvases/VConceptualEdge.vue';
import VConceptualNode from '@/components/organisms/canvases/VConceptualNode.vue';

import { useCanvasDrop } from '@/composables/useCanvasDrop';
import { useEdgeInterceptor } from '@/composables/useEdgeInterceptor';
import type { ConceptualEdge, ConceptualNode } from '@/interfaces/conceptual-map';
import { useCanvasStore } from '@/stores/canvas';

const props = defineProps<{
  nodes: ConceptualNode[];
  edges: ConceptualEdge[];
}>();

const emit = defineEmits<{
  (e: 'node-update', node: ConceptualNode, action: 'move' | 'edit' | 'delete' | 'link'): void;
  (e: 'edge-update', edge: ConceptualEdge, action: 'create' | 'delete' | 'update'): void;
}>();

const canvasStore = useCanvasStore();
const { onDragOver, onDrop, onDragLeave } = useCanvasDrop();
const { startInterception } = useEdgeInterceptor();

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

const vueFlowNodes = computed(() => props.nodes.map(n => ({
  id: n.id,
  position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
  data: { ...n },
  type: n.type,
  dragHandle: '.v-node-container',
})));

const vueFlowEdges = computed(() => props.edges.map(e => ({
  id: e.id,
  source: e.source,
  sourceHandle: e.sourceHandle,
  target: e.target,
  targetHandle: e.targetHandle,
  type: e.type ?? 'REF',
  label: e.label,
  animated: e.type === 'TRIGGERS',
  data: {
    type: e.type,
    evidence: e.evidence,
    weight: e.weight
  },
})));

const isEditModalOpen = ref(false);
const editingNode = ref<ConceptualNode | null>(null);
const localLabel = ref('');
const localNotes = ref('');

function handleConnect(connection: any) {
  startInterception(connection, canvasStore.conceptualNodes);
}

function handleNodeDragStop({ node }: NodeDragEvent) {
  const updatedNode: ConceptualNode = {
    ...node.data,
    position: { x: node.position.x, y: node.position.y }
  };
  emit('node-update', updatedNode, 'move');
}

function handleEdgeUpdate({ edge, connection }: EdgeUpdateEvent) {
  emit('edge-update', { ...edge.data, source: connection.source, target: connection.target }, 'update');
}

function handleNodeDoubleClick(event: any) {
  startEdit(event.node.id);
}

function startEdit(nodeId: string) {
  const node = props.nodes.find(n => n.id === nodeId);
  if (node) {
    editingNode.value = node;
    localLabel.value = node.label;
    localNotes.value = node.userNotes ?? '';
    isEditModalOpen.value = true;
  }
}

function saveEdit() {
  if (editingNode.value) {
    const updatedNode: ConceptualNode = {
      ...editingNode.value,
      label: localLabel.value,
      userNotes: localNotes.value
    };

    emit('node-update', updatedNode, 'edit');
    isEditModalOpen.value = false;
  }
}
</script>