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
          title="Anchors & Portals"
          section-type="TOP"
          :node-types="['FOCUS', 'NAVIGATION']"
          :nodes="filterNodesByTypes(['FOCUS', 'NAVIGATION'])"
          :selected-node-id="selectedNodeId"
          :is-collapsible="false"
          @add="handleAction('create-portal')"
          @select="selectNode"
          @teleport="handleTeleport"
        />

        <SidebarRegistrySection
          title="Structure"
          section-type="MIDDLE"
          :node-types="['GROUP', 'CONCEPT']"
          :nodes="filterNodesByTypes(['GROUP', 'CONCEPT'])"
          :selected-node-id="selectedNodeId"
          @add="handleAction('create-concept')"
          @select="selectNode"
          @teleport="handleTeleport"
        />

        <SidebarRegistrySection
          title="Evidence & Inquiry"
          section-type="BOTTOM"
          :node-types="['RESOURCE', 'INSIGHT', 'QUERY']"
          :nodes="filterNodesByTypes(['RESOURCE', 'INSIGHT', 'QUERY'])"
          :selected-node-id="selectedNodeId"
          @add="handleAction('quick-capture')"
          @select="selectNode"
          @teleport="handleTeleport"
        />
      </VStack>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCanvasStore } from '@/stores/canvas';
import { useProjectStore } from '@/stores/project';
import type { NodeType } from '@/interfaces/conceptual-map';
import type { ID } from '@/interfaces/core';

// Layout Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';

// Layout & UI
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import SidebarRegistrySection from '@/components/organisms/sections/SidebarRegistrySection.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

const canvasStore = useCanvasStore();
const projectStore = useProjectStore();

// --- Local State ---
const selectedNodeId = ref<ID | null>(null);
const viewMode = ref<'all' | 'inbox'>('all');

/**
 * GLOBAL REGISTRY ACCESS
 * Ensures the Sidebar has access to the full manifest of nodes.
 */
const registryNodes = computed(() => {
  return Array.from(projectStore.conceptualNodes.entries()).map(([id, node]) => {
    return node
  })
});

/**
 * INBOX VIEW
 * Nodes that are not yet placed on any canvas (DIMMED state).
 */
const inboxNodes = computed(() => {
  const currentCanvas = canvasStore.getGraphCache(projectStore.activeCanvasId as ID);
  const sidebarNodesArray = Array.from(projectStore.conceptualNodes.values());

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
const handleAction = (actionType: string) => {
  console.log(`Discovery Action: ${actionType}`);
  // Logic for opening specific modals based on actionType
};

const handleTeleport = (nodeId: string, canvasId?: string ) => {
  console.log(`Teleporting to node ${nodeId}`);
  // Global canvas navigation logic
};

const selectNode = (nodeId: ID | null) => {
  selectedNodeId.value = nodeId;
};
</script>