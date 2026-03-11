<template>
  <VBox class="h-full w-full relative group overflow-hidden" background="slate-50">
    <VueFlow
      :nodes="vueFlowNodes"
      :edges="vueFlowEdges"
      :node-types="nodeTypes"
      :fit-view-on-init="true"
      :default-zoom="1.2"
      :max-zoom="4"
      :min-zoom="0.2"
      @node-drag-stop="handleNodeDragStop"
      @connect="handleEdgeCreate"
      @edge-update="handleEdgeUpdate"
      @node-double-click="handleNodeDoubleClick"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <Background :pattern-gap="20" pattern-color="#e2e8f0" />
      <Controls position="bottom-left" class="mb-4 ml-4" />

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
import { markRaw, computed, ref } from 'vue';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow, type EdgeUpdateEvent, type NodeDragEvent } from '@vue-flow/core';
import { v4 as uuidv4 } from 'uuid';

// Atoms & Molecules
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VButtonToolbar from '@/components/molecules/forms/VButtonToolbar.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VModal from '@/components/molecules/indicators/VModal.vue';

import VConceptNode from '@/components/organisms/canvases/VConceptNode.vue';
import VInsightNode from '@/components/organisms/canvases/VInsightNode.vue';

import { useCanvasDrop } from '@/composables/useCanvasDrop';
import type { ConceptualEdge, ConceptualNode } from '@/interfaces/conceptual-map';

const props = defineProps<{
  nodes: ConceptualNode[];
  edges: ConceptualEdge[];
}>();

const emit = defineEmits<{
  (e: 'node-update', node: ConceptualNode, action: 'move' | 'edit' | 'delete' | 'link'): void;
  (e: 'edge-update', edge: ConceptualEdge, action: 'create' | 'delete' | 'update'): void;
}>();

const { onDragOver, onDrop, onDragLeave } = useCanvasDrop();

const nodeTypes = {
  CONCEPT: markRaw(VConceptNode),
  INSIGHT: markRaw(VInsightNode),
  // RESOURCE: markRaw(VConceptNode),
  // QUESTION: markRaw(VConceptNode),
};

const vueFlowNodes = computed(() => props.nodes.map(n => ({
  id: n.id,
  position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
  data: { ...n },
  type: n.type,
})));

const vueFlowEdges = computed(() => props.edges.map(e => ({
  id: e.id,
  source: e.source,
  sourceHandle: e?.sourceHandle,
  target: e.target,
  targetHandle: e?.targetHandle,
  animated: true,
  style: { stroke: '#94a3b8', strokeWidth: 2 },
})));

const isEditModalOpen = ref(false);
const editingNode = ref<ConceptualNode | null>(null);
const localLabel = ref('');
const localNotes = ref('');

function handleNodeDragStop({ node }: NodeDragEvent) {
  emit('node-update', { ...node.data, x: node.position.x, y: node.position.y }, 'move');
}

function handleEdgeCreate(connection: any) {
  emit('edge-update', { id: uuidv4(), source: connection.source, target: connection.target, weight: connection.weight }, 'create');
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
    localNotes.value = node.user_notes ?? '';
    isEditModalOpen.value = true;
  }
}

function saveEdit() {
  if (editingNode.value) {
    emit('node-update', { ...editingNode.value, label: localLabel.value }, 'edit');
    isEditModalOpen.value = false;
  }
}
</script>