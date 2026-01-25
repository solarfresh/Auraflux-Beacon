<template>
  <BaseSidebarLayout
    title="Registry"
    class="bg-white shadow-lg border-r border-gray-200 h-full"
    :use-stable-gutter="true"
  >
    <template #header-extension>
      <div class="px-5 pb-4 border-b border-gray-50">
        <div class="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <Button
            size="sm"
            class="flex-1 !py-1 !text-[10px] uppercase tracking-wider"
            :variant="viewMode === 'all' ? 'primary' : 'ghost'"
            @click="viewMode = 'all'"
          >
            All Nodes
          </Button>
          <Button
            size="sm"
            class="flex-1 !py-1 !text-[10px] uppercase tracking-wider"
            :variant="viewMode === 'inbox' ? 'primary' : 'ghost'"
            @click="viewMode = 'inbox'"
          >
            Inbox ({{ inboxNodes.length }})
          </Button>
        </div>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col">
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
      </div>
    </template>

    <template #footer>
      <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <VTypography size="xs" color="gray-500" weight="medium">Canvas Stability</VTypography>
        <div class="flex items-center gap-2">
           <div
             class="w-2 h-2 rounded-full shadow-sm"
             :class="stabilityScore < 4 ? 'bg-red-400' : 'bg-emerald-400'"
           ></div>
           <VTypography size="xs" weight="bold" :color="stabilityScore < 4 ? 'red-600' : 'emerald-600'">
             {{ stabilityScore }}/10
           </VTypography>
        </div>
      </div>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRegistry } from '@/composables/useRegistry';
import { useExplorationStore } from '@/stores/exploration';
import type { NodeType } from '@/interfaces/conceptual-map';
import type { ID } from '@/interfaces/core';

// Layout & UI
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import SidebarRegistrySection from '@/components/organisms/sections/SidebarRegistrySection.vue';
import Button from '@/components/atoms/actions/Button.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

/**
 * DiscoverySidebar: The control center for the Research Canvas.
 * It manages the visibility and organization of all nodes within the registry,
 * categorized by their functional stability.
 */
const {
  registryNodes,
  selectedNodeId,
  inboxNodes,
  selectNode
} = useRegistry();

const explorationStore = useExplorationStore();

// --- Local State ---
const viewMode = ref<'all' | 'inbox'>('all');
const stabilityScore = computed(() => explorationStore.stabilityScore);

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
</script>