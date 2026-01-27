<template>
  <BaseSidebarLayout
    title="Registry"
    class="h-full border-r border-slate-200"
  >
    <template #header-extension>
      <VBox padding="lg" class="pt-0 pb-4 border-b border-slate-50">
        <VBox background="slate-50" padding="xs" rounded="lg" class="flex gap-1">
          <VButton
            size="sm"
            class="flex-1 !py-1 !text-[10px] uppercase tracking-wider"
            :variant="viewMode === 'all' ? 'primary' : 'ghost'"
            @click="viewMode = 'all'"
          >
            All Nodes
          </VButton>
          <VButton
            size="sm"
            class="flex-1 !py-1 !text-[10px] uppercase tracking-wider"
            :variant="viewMode === 'inbox' ? 'primary' : 'ghost'"
            @click="viewMode = 'inbox'"
          >
            Inbox ({{ inboxNodes.length }})
          </VButton>
        </VBox>
      </VBox>
    </template>

    <template #body>
      <VStack gap="none" full-height>
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

    <template #footer>
      <VBox
        background="slate-50"
        padding="md"
        border="top"
        class="flex items-center justify-between"
      >
        <VTypography size="xs" color="slate-500" weight="medium">
          Stability
        </VTypography>

        <VBox padding="none" class="flex items-center gap-2">
          <VBox
            padding="none"
            class="w-2 h-2 rounded-full shadow-sm"
            :background="stabilityScore < 4 ? 'rose-50' : 'emerald-50'"
            :class="stabilityScore < 4 ? 'bg-red-400' : 'bg-emerald-400'"
          />
          <VTypography
            size="xs"
            weight="bold"
            :class="stabilityScore < 4 ? 'text-red-600' : 'text-emerald-600'"
          >
            {{ stabilityScore }}/10
          </VTypography>
        </VBox>
      </VBox>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRegistry } from '@/composables/useRegistry';
import { useExplorationStore } from '@/stores/exploration';
import type { NodeType } from '@/interfaces/conceptual-map';
import type { ID } from '@/interfaces/core';

// Layout Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';

// Layout & UI
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import SidebarRegistrySection from '@/components/organisms/sections/SidebarRegistrySection.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
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