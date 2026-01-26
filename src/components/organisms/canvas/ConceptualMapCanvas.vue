<template>
  <VBox class="h-full w-full relative group overflow-hidden" background="slate-50">
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
    >
      <Background :pattern-gap="20" pattern-color="#e2e8f0" />
      <Controls position="bottom-left" class="mb-4 ml-4" />

      <MiniMap
        position="bottom-right"
        class="mr-4 mb-4 border border-slate-100 rounded-xl overflow-hidden shadow-xl"
      />

      <template #node-default="{ data }">
        <VBox
          tag="article"
          background="white"
          padding="md"
          rounded="xl"
          class="group relative transition-all duration-300 min-w-[200px] border-2 shadow-sm hover:shadow-xl hover:-translate-y-1"
          :class="nodeUI[data.type as keyof typeof nodeUI]?.borderClass || 'border-slate-200'"
        >
          <VStack gap="xs">
            <VCluster justify="between" align="center">
              <VBadge
                :variant="nodeUI[data.type as keyof typeof nodeUI]?.badgeVariant || 'gray'"
                size="xs"
                class="uppercase"
              >
                {{ data.type }}
              </VBadge>

              <VButton
                variant="ghost"
                size="xs"
                iconOnly
                iconName="PencilSquare"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
                @click.stop="startEdit(data.id)"
              />
            </VCluster>

            <VStack gap="xs">
              <VTypography tag="h4" size="sm" weight="bold" class="text-slate-900 leading-snug line-clamp-2">
                {{ data.label }}
              </VTypography>

              <VBox
                v-if="data.type === 'RESOURCE'"
                background="indigo-50"
                padding="xs"
                rounded="md"
              >
                <VCluster gap="xs" align="center">
                  <VIcon name="Link" size="4" class="text-indigo-500" />
                  <VTypography size="xs" class="text-indigo-600 truncate font-mono">
                    {{ data.resource_id?.substring(0, 8) }}
                  </VTypography>
                </VCluster>
              </VBox>

              <VAlert
                v-if="data.user_notes"
                variant="warning"
                padding="xs"
                rounded="md"
                class="border border-amber-100"
              >
                <VCluster gap="xs" align="start">
                  <VIcon name="ChatBubbleBottomCenterText" size="4" class="mt-0.5" />
                  <VTypography size="xs" italic class="line-clamp-2 leading-tight">
                    {{ data.user_notes }}
                  </VTypography>
                </VCluster>
              </VAlert>
            </VStack>
          </VStack>

          <Handle type="target" :position="'top' as Position" class="!w-3 !h-3 !bg-slate-300 border-2 border-white" />
          <Handle type="source" :position="'bottom' as Position" class="!w-3 !h-3 !bg-slate-300 border-2 border-white" />
        </VBox>
      </template>
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
import { ref, computed } from 'vue';
import { VueFlow, useVueFlow, Handle, type NodeDragEvent, type EdgeUpdateEvent, type Position } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { v4 as uuidv4 } from 'uuid';

// Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';

// Molecules
import VModal from '@/components/molecules/indicators/VModal.vue';
import VAlert from '@/components/molecules/indicators/VAlert.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VButtonToolbar from '@/components/molecules/forms/VButtonToolbar.vue';

import type { ConceptualEdge, ConceptualNode } from '@/interfaces/conceptual-map';
import type { ResourceItem } from '@/interfaces/knowledge';

const props = defineProps<{
  nodes: ConceptualNode[];
  edges: ConceptualEdge[];
}>();

const emit = defineEmits<{
  (e: 'node-update', node: ConceptualNode, action: 'move' | 'edit' | 'delete' | 'link'): void;
  (e: 'edge-update', edge: ConceptualEdge, action: 'create' | 'delete' | 'update'): void;
  (e: 'add-resource', resource: ResourceItem, position: { x: number, y: number }): void;
}>();

const { screenToFlowCoordinate } = useVueFlow();

// --- Data Transformations ---
const vueFlowNodes = computed(() => props.nodes.map(n => ({
  id: n.id,
  // position: { x: n.x, y: n.y },
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

// --- UI Semantic Mapping (Aligning with Indicators Rule 2) ---
const nodeUI = {
  RESOURCE: {
    borderClass: 'border-indigo-100 hover:border-indigo-400',
    badgeVariant: 'indigo' as const
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
    badgeVariant: 'purple' as const
  },
};

const isEditModalOpen = ref(false);
const editingNode = ref<ConceptualNode | null>(null);
const localLabel = ref('');
const localNotes = ref('');

// --- Handlers ---
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

function startEdit(nodeId: string) {
  const node = props.nodes.find(n => n.id === nodeId);
  if (node) {
    editingNode.value = node;
    localLabel.value = node.label;
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