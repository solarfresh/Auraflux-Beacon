<template>
  <div class="h-full w-full bg-[#f8fafc] relative group overflow-hidden">
    <VueFlow
      :nodes="vueFlowNodes"
      :edges="vueFlowEdges"
      :fit-view-on-init="true"
      :default-zoom="1.2"
      :max-zoom="4"
      :min-zoom="0.2"
      @node-drag-stop="handleNodeDragStop"
      @connect="handleEdgeCreate"
      @edge-update="handleEdgeUpdate"
      @node-double-click="handleNodeDoubleClick"
      @drop="handleDrop"
      @drag-over="handleDragOver"
      class="conceptual-map-flow"
    >
      <Background :pattern-gap="20" pattern-color="#e2e8f0" />
      <Controls position="bottom-left" class="mb-4 ml-4" />
      <MiniMap
        position="bottom-right"
        class="mr-4 mb-4 border border-gray-100 rounded-xl overflow-hidden shadow-xl"
      />

      <template #node-default="{ data }">
        <div
          class="group relative flex flex-col p-4 bg-white border-2 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-w-[180px]"
          :class="nodeUI[data.type as keyof typeof nodeUI]?.borderClass || 'border-gray-200'"
        >
          <div class="flex items-center justify-between mb-2">
            <VBadge
              :variant="nodeUI[data.type as keyof typeof nodeUI]?.badgeVariant || 'gray'"
              size="xs"
              class="uppercase tracking-tighter"
            >
              {{ data.type }}
            </VBadge>

            <VButton
              variant="tertiary"
              size="xs"
              iconOnly
              iconName="PencilSquare"
              class="opacity-0 group-hover:opacity-100 transition-all duration-200"
              @click.stop="startEdit(data.id)"
            />
          </div>

          <div class="space-y-2">
            <VTypography tag="h4" size="sm" weight="bold" color="gray-900" class="leading-snug break-words line-clamp-2">
              {{ data.label }}
            </VTypography>

            <div v-if="data.type === 'RESOURCE'" class="flex items-center gap-1.5 py-1 px-2 bg-blue-50/50 rounded-lg">
              <VIcon name="Link" size="xs" class="text-blue-500" />
              <VTypography tag="span" size="xs" color="blue-600" class="truncate max-w-[120px] font-mono">
                {{ data.resource_id?.substring(0, 8) }}
              </VTypography>
            </div>

            <div v-if="data.user_notes" class="flex gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
              <VIcon name="ChatBubbleBottomCenterText" size="xs" class="text-amber-500 mt-0.5 flex-shrink-0" />
              <VTypography tag="p" size="xs" color="amber-800" class="italic line-clamp-2 leading-tight">
                {{ data.user_notes }}
              </VTypography>
            </div>
          </div>

          <Handle type="target" position="top" class="!w-3 !h-3 !bg-gray-300 border-2 border-white" />
          <Handle type="source" position="bottom" class="!w-3 !h-3 !bg-gray-300 border-2 border-white" />
        </div>
      </template>
    </VueFlow>

    <FullScreenModalTemplate
      :is-open="isEditModalOpen"
      max-width-class="max-w-lg"
      @close="isEditModalOpen = false"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <VIcon name="DocumentText" class="text-indigo-600" />
          <VTypography tag="span" weight="bold">Refine Research Node</VTypography>
        </div>
      </template>

      <template #content>
        <div v-if="editingNode" class="space-y-6 py-4">
          <div class="space-y-2">
            <VTypography tag="label" size="sm" weight="bold" color="gray-700">Concept / Label</VTypography>
            <VInput v-model="localLabel" placeholder="e.g., Socio-economic Resilience" size="lg" />
          </div>

          <div class="space-y-2">
            <VTypography tag="label" size="sm" weight="bold" color="gray-700">Strategic Reflection</VTypography>
            <VTextarea
              v-model="localNotes"
              :rows="5"
              placeholder="Record why this concept is critical to your core research question..."
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <VButton variant="tertiary" size="md" @click="isEditModalOpen = false">Cancel</VButton>
          <VButton variant="primary" size="md" @click="saveEdit">Apply Changes</VButton>
        </div>
      </template>
    </FullScreenModalTemplate>
  </div>
</template>

<script setup lang="ts">
/**
 * ConceptualMapCanvas.vue
 * Core orchestration component for the Knowledge Graph.
 * Implements Vue Flow with strict Atom-based UI components.
 */
import { ref, computed } from 'vue';
import { VueFlow, useVueFlow, Handle, type NodeDragEvent, type EdgeUpdateEvent } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { v4 as uuidv4 } from 'uuid';

// Atoms & Templates
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';

// Interfaces
import type { ConceptualEdge, ConceptualNode } from '@/interfaces/conceptual-map';
import type { ResourceItem } from '@/interfaces/knowledge';

// --- Props & Emits ---
const props = defineProps<{
  nodes: ConceptualNode[];
  edges: ConceptualEdge[];
}>();

const emit = defineEmits<{
  (e: 'node-update', node: ConceptualNode, action: 'move' | 'edit' | 'delete' | 'link'): void;
  (e: 'edge-update', edge: ConceptualEdge, action: 'create' | 'delete' | 'update'): void;
  (e: 'add-resource', resource: ResourceItem, position: { x: number, y: number }): void;
}>();

// --- Vue Flow Context ---
const { screenToFlowCoordinate } = useVueFlow();

// --- Computed Data Transformations ---
const vueFlowNodes = computed(() => props.nodes.map(n => ({
  id: n.id,
  position: { x: n.x, y: n.y },
  data: { ...n },
  type: 'default',
})));

const vueFlowEdges = computed(() => props.edges.map(e => ({
  id: e.id,
  source: e.source,
  target: e.target,
  label: e.label,
  animated: true,
  style: { stroke: '#94a3b8', strokeWidth: 2 },
})));

// --- Node UI Semantic Mapping ---
const nodeUI = {
  RESOURCE: {
    borderClass: 'border-indigo-100 hover:border-indigo-400',
    badgeVariant: 'indigo' as const // Changed from blue to indigo
  },
  CONCEPT: {
    borderClass: 'border-emerald-100 hover:border-emerald-400',
    badgeVariant: 'emerald' as const
  },
  QUESTION: {
    borderClass: 'border-amber-100 hover:border-amber-400',
    badgeVariant: 'amber' as const
  },
  REFLECTION: {
    borderClass: 'border-purple-100 hover:border-purple-400',
    badgeVariant: 'purple' as const // Changed from indigo to purple
  },
};

// --- Local State Management ---
const isEditModalOpen = ref(false);
const editingNode = ref<ConceptualNode | null>(null);
const localLabel = ref('');
const localNotes = ref('');

// --- Event Handlers: Vue Flow Actions ---

function handleNodeDragStop({ node }: NodeDragEvent) {
  emit('node-update', { ...node.data, x: node.position.x, y: node.position.y }, 'move');
}

function handleEdgeCreate(connection: any) {
  emit('edge-update', { id: uuidv4(), source: connection.source, target: connection.target, label: 'connects' }, 'create');
}

function handleEdgeUpdate({ edge, connection }: EdgeUpdateEvent) {
  emit('edge-update', { ...edge.data, source: connection.source, target: connection.target }, 'update');
}

function handleNodeDoubleClick(event: any) {
  startEdit(event.node.id);
}

// --- Drag and Drop Logic ---

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event: DragEvent) {
  const resourceJson = event.dataTransfer?.getData('resource/json');
  if (resourceJson) {
    const resource = JSON.parse(resourceJson);
    const position = screenToFlowCoordinate({ x: event.clientX, y: event.clientY });
    emit('add-resource', resource, position);
  }
}

// --- Internal Refinement Logic ---

function startEdit(nodeId: string) {
  const node = props.nodes.find(n => n.id === nodeId);
  if (node) {
    editingNode.value = node;
    localLabel.value = node.label;
    localNotes.value = node.user_notes || '';
    isEditModalOpen.value = true;
  }
}

function saveEdit() {
  if (editingNode.value) {
    emit('node-update', { ...editingNode.value, label: localLabel.value, user_notes: localNotes.value }, 'edit');
    isEditModalOpen.value = false;
  }
}
</script>

<style scoped>
/* Scoped overrides for Vue Flow base styles */
.conceptual-map-flow {
  background-color: #f8fafc;
}
:deep(.vue-flow__edge-path) {
  transition: stroke 0.3s ease;
}
:deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: #4f46e5;
  stroke-width: 3;
}
/* Ensure the controls look integrated */
:deep(.vue-flow__controls) {
  @apply !border-none !shadow-lg !rounded-xl !overflow-hidden;
}
</style>