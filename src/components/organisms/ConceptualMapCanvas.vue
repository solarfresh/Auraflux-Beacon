<template>
  <div class="h-full w-full">
    <VueFlow
      :nodes="vueFlowNodes"
      :edges="vueFlowEdges"
      :fit-view-on-init="true"
      :default-zoom="1"
      :max-zoom="2"
      :min-zoom="0.5"
      @node-drag-stop="handleNodeDragStop"
      @connect="handleEdgeCreate"
      @edge-update="handleEdgeUpdate"
      @node-double-click="handleNodeDoubleClick"
      @drop="handleDrop"
      @drag-over="handleDragOver"
      class="conceptual-map-flow"
      aria-label="Conceptual Map Visualization Canvas"
    >
      <Controls />
      <MiniMap />
      <Background :pattern-gap="12" gap-color="#f5f5f5" />

      <template #node-default="slotProps">
        <div
          :class="getNodeClasses(slotProps.data.node)"
          class="p-2 border rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow relative"
        >
          <div class="font-bold text-sm leading-tight max-w-40 truncate" :title="slotProps.data.node.label">
            {{ slotProps.data.node.label }}
          </div>

          <div
            v-if="slotProps.data.node.data.type === 'RESOURCE'"
            class="text-xs text-gray-500 truncate max-w-40 mt-1"
          >
            Source: {{ slotProps.data.node.data.resource_id.substring(0, 8) }}...
          </div>
          <div
            v-if="slotProps.data.node.data.user_notes"
            class="text-xs text-yellow-700 bg-yellow-100 p-0.5 mt-1 rounded inline-block"
          >
            Note
          </div>

          <button
            @click.stop="startEdit(slotProps.data.node.id)"
            class="absolute top-0 right-0 p-1 text-xs text-blue-500 hover:text-blue-700 opacity-80 hover:opacity-100 transition-opacity"
            title="Edit Label and Notes"
          >
            📝
          </button>
        </div>
      </template>
    </VueFlow>

    <FullScreenModalTemplate
      :is-open="isEditModalOpen"
      max-width-class="max-w-md"
      @close="isEditModalOpen = false"
    >
      <template #header>Edit Node: {{ editingNode?.label }}</template>
      <template #content>
        <div v-if="editingNode">
          <label class="block text-sm font-medium text-gray-700 mt-2">Label/Concept Name</label>
          <input
            v-model="localLabel"
            class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 mt-1"
          />

          <label class="block text-sm font-medium text-gray-700 mt-4">Notes (For Reflection)</label>
          <textarea
            v-model="localNotes"
            rows="4"
            class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 mt-1"
            placeholder="Add personal reflections or detail the connection here..."
          ></textarea>

          <div class="mt-4 flex justify-end">
            <button
              @click="saveEdit"
              class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </template>
    </FullScreenModalTemplate>
  </div>
</template>

<script setup lang="ts">
import {
  VueFlow,
  useVueFlow,
  type EdgeUpdateEvent,
  // Core Functions and Types
  type NodeDragEvent,
} from '@vue-flow/core';
import { computed, ref } from 'vue';
// Fix for type import issues: use aliases for Node and Edge
import type { Edge as FlowEdge, Node as FlowNode } from '@vue-flow/core';

// Helper Components (Ensure they are installed: npm install @vue-flow/controls @vue-flow/minimap @vue-flow/background)
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';

// Application Interfaces
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';
import type { ConceptualEdge, ConceptualNode } from '@/interfaces/conceptual-map';
import type { ResourceItem } from '@/interfaces/knowledge';
import { v4 as uuidv4 } from 'uuid';

// --- PROPS & EMITS ---

const props = defineProps<{
  nodes: ConceptualNode[];
  edges: ConceptualEdge[];
}>();

const emit = defineEmits<{
  // Node updates: move, edit, delete, link
  (e: 'node-update', node: ConceptualNode, action: 'move' | 'edit' | 'delete' | 'link'): void;
  // Edge updates: create, delete, update (reconnect)
  (e: 'edge-update', edge: ConceptualEdge, action: 'create' | 'delete' | 'update'): void;
  // Handle resource drop from ResourceRepository
  (e: 'add-resource', resource: ResourceItem, position: { x: number, y: number }): void;
}>();


// --- COMPUTED VUE FLOW DATA ---

/**
 * Transforms store nodes to Vue Flow format.
 */
const vueFlowNodes = computed(() => transformConceptualNodes(props.nodes));

/**
 * Transforms store edges to Vue Flow format.
 */
const vueFlowEdges = computed(() => transformConceptualEdges(props.edges));


// --- VUE FLOW COMPOSITION API ---
// Initialize useVueFlow using the computed properties
const {
    onNodeDragStop: onNodeDragStopFlow,
    onConnect: onConnectFlow,
    onEdgeUpdate: onEdgeUpdateFlow,
    screenToFlowCoordinate, // Required for converting drop coordinates
} = useVueFlow({
    nodes: vueFlowNodes.value,
    edges: vueFlowEdges.value,
});

// Map Vue Flow event listeners to local handler functions
onNodeDragStopFlow(handleNodeDragStop);
onConnectFlow(handleEdgeCreate);
onEdgeUpdateFlow(handleEdgeUpdate);


// --- LOCAL STATE FOR EDITING ---
const isEditModalOpen = ref(false);
const editingNode = ref<ConceptualNode | null>(null);
const localLabel = ref('');
const localNotes = ref('');

// --- DATA TRANSFORMATION ---

/**
 * Transforms ConceptualNode (Store) to FlowNode (Vue Flow).
 */
function transformConceptualNodes(cNodes: ConceptualNode[]): FlowNode[] {
    return cNodes.map(cNode => ({
        id: cNode.id,
        type: 'default', // Using default type, customized via slot
        position: cNode.position,
        label: cNode.label,
        data: {
            resource_id: cNode?.resource_id,
            ...cNode
        },
        // Set custom class for easier styling based on type
        class: `conceptual-node node-${cNode.type.toLowerCase()}`,
    }));
}

/**
 * Transforms ConceptualEdge (Store) to FlowEdge (Vue Flow).
 */
function transformConceptualEdges(cEdges: ConceptualEdge[]): FlowEdge[] {
    return cEdges.map(cEdge => ({
        id: cEdge.id,
        source: cEdge.source,
        target: cEdge.target,
        label: cEdge.label,
        type: 'default', // Or 'smoothstep' for better routing
        animated: true,
    }));
}


// --- EVENT HANDLERS ---

/**
 * Handles the end of a node drag operation and emits update to store.
 */
function handleNodeDragStop({ node }: NodeDragEvent) {
    const conceptualNode: ConceptualNode = {
        id: node.id,
        label: node.label as string,
        type: node.data.type,
        resource_id: node.data.resource_id,
        user_notes: node.data.user_notes || '',
        x: node.position.x,
        y: node.position.y,
    };
    emit('node-update', conceptualNode, 'move');
}

/**
 * Handles creation of a new edge connection and emits create action to store.
 */
function handleEdgeCreate(connection: any) {
    const newEdge: ConceptualEdge = {
        id: uuidv4(),
        source: connection.source!,
        target: connection.target!,
        label: 'Connected',
    };
    emit('edge-update', newEdge, 'create');
}

/**
 * Handles edge reconnection (re-targeting source/target) and emits update action to store.
 */
function handleEdgeUpdate({ edge, connection }: EdgeUpdateEvent) {
    const updatedEdge: ConceptualEdge = {
        id: edge.id,
        source: connection.source!,
        target: connection.target!,
        label: edge.label as string || '',
    };
    emit('edge-update', updatedEdge, 'update');
}

/**
 * Handles node double-click event (e.g., to open edit modal).
 */
function handleNodeDoubleClick(event: any) {
    // Assuming double click opens the edit modal
    startEdit(event.node.id);
}

// --- DRAG & DROP HANDLERS ---

/**
 * Allows the drop operation.
 */
function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
}

/**
 * Handles resource drop from ResourceRepository onto the canvas.
 */
function handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
        const resourceJson = event.dataTransfer.getData('resource/json');
        if (resourceJson) {
            try {
                const resource: ResourceItem = JSON.parse(resourceJson);
                // Convert screen coordinates to flow coordinates
                const position = screenToFlowCoordinate({ x: event.clientX, y: event.clientY });

                // Emit event to store to add the new node
                emit('add-resource', resource, position);
            } catch (error) {
                console.error("Failed to parse resource data:", error);
            }
        }
    }
}


// --- CUSTOM LOGIC: EDITING NODE ---

/**
 * Opens the edit modal for a specific node.
 */
function startEdit(nodeId: string) {
    const node = props.nodes.find(n => n.id === nodeId);
    if (node) {
        editingNode.value = node;
        localLabel.value = node.label;
        localNotes.value = node.user_notes || '';
        isEditModalOpen.value = true;
    }
}

/**
 * Saves the edited label and notes and emits update to store.
 */
function saveEdit() {
    if (editingNode.value) {
        const updatedNode: ConceptualNode = {
            ...editingNode.value,
            label: localLabel.value.trim(),
            user_notes: localNotes.value.trim(),
        };
        emit('node-update', updatedNode, 'edit');
        isEditModalOpen.value = false;
    }
}


// --- NODE STYLES ---

/**
 * Generates Tailwind classes based on ConceptualNode type for visual distinction.
 */
function getNodeClasses(node: FlowNode): string {
    if (node.data.type === 'RESOURCE') {
        return 'bg-blue-50 border-blue-400';
    }
    if (node.data.type === 'CONCEPT') {
        return 'bg-green-50 border-green-400';
    }
    if (node.data.type === 'QUESTION') {
        return 'bg-yellow-50 border-yellow-400';
    }
    return 'bg-white border-gray-400';
}
</script>

<style scoped>
/* Ensure the Vue Flow container takes up the full parent space */
.conceptual-map-flow {
  width: 100%;
  height: 100%;
}

/* Define minimum width for conceptual nodes */
.conceptual-node {
  min-width: 150px;
}
/* .node-resource, .node-concept, .node-question ... classes are applied dynamically */
</style>