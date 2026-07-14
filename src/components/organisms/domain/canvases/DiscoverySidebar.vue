<template>
  <BaseSidebarLayout
    title="Registry"
    class="h-full border-r border-slate-200"
  >
    <template #header-extension>
      <VBox padding="lg" class="pt-2 pb-2 border-b border-slate-50">
        <VBox background="slate-50" padding="xs" rounded="lg" class="flex gap-1">
          <VButton
            size="sm"
            class="flex-1 py-1! text-[10px]! uppercase tracking-wider"
            :variant="viewMode === 'all' ? 'primary' : 'ghost'"
            @click="viewMode = 'all'"
          >
            All Nodes
          </VButton>
          <VButton
            size="sm"
            class="flex-1 py-1! text-[10px]! uppercase tracking-wider"
            :variant="viewMode === 'inbox' ? 'primary' : 'ghost'"
            @click="viewMode = 'inbox'"
          >
            Inbox ({{ inboxNodes.length }})
          </VButton>
        </VBox>
      </VBox>
    </template>

    <template #body>
      <VStack gap="none" full-height scrollable>
        <SidebarRegistrySection
          title="Framework & Scope"
          section-type="TOP"
          :node-types="['OUTCOME', 'BOUNDARY']"
          :nodes="filterNodesByTypes(['OUTCOME', 'BOUNDARY'])"
          :selected-node-id="selectedNodeId"
          :is-collapsible="true"
          :can-add="true"
          @add="handleAddNewNode('OUTCOME')"
          @select="handleNodeSelect"
          @teleport="handleTeleport"
        />

        <SidebarRegistrySection
          title="Empirical Evidence"
          section-type="MIDDLE"
          :node-types="['EVENT', 'RESOURCE', 'ENTITY']"
          :nodes="filterNodesByTypes(['EVENT', 'RESOURCE', 'ENTITY'])"
          :selected-node-id="selectedNodeId"
          :can-add="true"
          @add="handleAddNewNode('ENTITY')"
          @select="handleNodeSelect"
          @teleport="handleTeleport"
        />

        <SidebarRegistrySection
          title="Synthesis & Gaps"
          section-type="MIDDLE"
          :node-types="['INSIGHT', 'CONCEPT', 'QUERY']"
          :nodes="filterNodesByTypes(['INSIGHT', 'CONCEPT', 'QUERY'])"
          :selected-node-id="selectedNodeId"
          :can-add="true"
          @add="handleAddNewNode('CONCEPT')"
          @select="handleNodeSelect"
          @teleport="handleTeleport"
        />

        <SidebarRegistrySection
          title="Structure & Navigation"
          section-type="BOTTOM"
          :node-types="['GROUP', 'FOCUS', 'NAVIGATION']"
          :nodes="filterNodesByTypes(['GROUP', 'FOCUS', 'NAVIGATION'])"
          :selected-node-id="selectedNodeId"
          :can-add="true"
          @add="handleAddNewNode('FOCUS')"
          @select="handleNodeSelect"
          @teleport="handleTeleport"
        />
      </VStack>

      <Teleport to="body" :disabled="!(isEditorOpen && editingNode)">
        <VBox
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs"
          @click.self="isEditorOpen = false"
        >
          <VNodeFormEditor
            :node="editingNode!"
            :is-new="isNewNode"
            @confirm="handleSave"
            @cancel="isEditorOpen = false"
          />
        </VBox>
      </Teleport>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { ref, computed } from 'vue';
import { useCanvasStore } from '@/stores/canvas';
import { useProjectStore } from '@/stores/project';
import type { NodeType, ConceptualNode } from '@/interfaces/conceptual-map';
import type { ID } from '@/interfaces/core';

import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import SidebarRegistrySection from '@/components/organisms/sections/SidebarRegistrySection.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VNodeFormEditor from '@/components/organisms/forms/VNodeFormEditor.vue';

const canvasStore = useCanvasStore();
const projectStore = useProjectStore();

// --- Local State ---
const isEditorOpen = ref(false);
const isNewNode = ref(false);
const editingNode = ref<ConceptualNode | null>(null);
const selectedNodeId = ref<ID | null>(null);
const viewMode = ref<'all' | 'inbox'>('all');

/**
 * GLOBAL REGISTRY ACCESS
 * Ensures the Sidebar has access to the full manifest of nodes.
 */
const registryNodes = computed(() => {
  return Array.from(projectStore.conceptualNodes.values()).filter(node => node.status !== 'ON_HOLD');
});

/**
 * INBOX VIEW
 * Nodes that are not yet placed on any canvas (DIMMED state).
 */
const inboxNodes = computed(() => {
  const currentCanvas = canvasStore.getGraphCache(projectStore.activeCanvasId as ID);
  const sidebarNodesArray = Array.from(projectStore.conceptualNodes.values()).filter(node => node.status !== 'ON_HOLD');;

  if (!currentCanvas?.nodes) {
    return sidebarNodesArray;
  }

  if (typeof currentCanvas.nodes.has === 'function') {
    return sidebarNodesArray.filter(node => !currentCanvas.nodes.has(node.id));
  }

  return sidebarNodesArray.filter(node => !(node.id in currentCanvas.nodes));
});

// --- Logic ---
const filterNodesByTypes = (types: NodeType[]) => {
  const baseList = viewMode.value === 'all' ? registryNodes.value : inboxNodes.value;
  return baseList.filter(n => types.includes(n.type as NodeType));
};

// --- Handlers ---
const handleAddNewNode = (nodeType: NodeType) => {
  editingNode.value = {
    id: uuidv4(),
    type: nodeType,
    label: '',
    status: 'USER_DRAFT'
  };

  isNewNode.value = true;
  isEditorOpen.value = true;
};

const handleSave = () => {
  isEditorOpen.value = false;
  editingNode.value = null;
};

const handleTeleport = (nodeId: string, canvasId?: string ) => {
  console.log(`Teleporting to node ${nodeId}`);
  // Global canvas navigation logic
};

const handleNodeSelect = (nodeId: ID | null) => {
  if (!nodeId) return;

  selectedNodeId.value = nodeId;

  const targetNode = projectStore.conceptualNodes.get(nodeId);
  if (targetNode) {
    editingNode.value = { ...targetNode };
    isEditorOpen.value = true;
  }
};
</script>