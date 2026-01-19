<template>
  <aside class="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-10">
    <div class="p-4 border-b bg-gray-50/50">
      <TopicStatusIndicator
        :stability-score="stabilityScore"
        label="Topic Refinement Status"
        description="current clarity level"
        color="indigo"
      />
    </div>

    <div class="px-4 py-2 bg-white border-b flex items-center justify-between">
      <div class="flex gap-1 bg-gray-100 p-1 rounded-md">
        <Button
          size="sm"
          :variant="viewMode === 'all' ? 'primary' : 'tertiary'"
          @click="viewMode = 'all'"
          class="!py-0.5 !px-3 !text-[10px]"
        >
          All Nodes
        </Button>
        <Button
          size="sm"
          :variant="viewMode === 'inbox' ? 'primary' : 'tertiary'"
          @click="viewMode = 'inbox'"
          class="!py-0.5 !px-3 !text-[10px]"
        >
          Inbox ({{ inboxNodes.length }})
        </Button>
      </div>
      <Icon name="shield-check" :color="stabilityScore < 4 ? 'red-400' : 'emerald-400'" size="sm" />
    </div>

    <nav class="flex-grow overflow-y-auto p-2 space-y-1 scrollbar-none">
      <SidebarRegistrySection
        title="Anchors & Portals"
        section-type="TOP"
        :node-types="['FOCUS', 'NAVIGATION']"
        :nodes="filterNodesByTypes(['FOCUS', 'NAVIGATION'])"
        :selected-node-id="selectedNodeId"
        :is-collapsible="false"
        @add="handleCreateNavigator"
        @select="selectNode"
        @teleport="handleTeleport"
      />

      <SidebarRegistrySection
        title="Structure"
        section-type="MIDDLE"
        :node-types="['GROUP', 'CONCEPT']"
        :nodes="filterNodesByTypes(['GROUP', 'CONCEPT'])"
        :selected-node-id="selectedNodeId"
        @add="handleCreateConcept"
        @select="selectNode"
        @teleport="handleTeleport"
      />

      <SidebarRegistrySection
        class="flex-grow"
        title="Evidence & Inquiry"
        section-type="BOTTOM"
        :node-types="['RESOURCE', 'INSIGHT', 'QUERY']"
        :nodes="filterNodesByTypes(['RESOURCE', 'INSIGHT', 'QUERY'])"
        :selected-node-id="selectedNodeId"
        @add="handleQuickCapture"
        @select="selectNode"
        @teleport="handleTeleport"
      />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import TopicStatusIndicator from '@/components/molecules/TopicStatusIndicator.vue';
import SidebarRegistrySection from '@/components/organisms/SidebarRegistrySection.vue';
import { useRegistry } from '@/composables/useRegistry';
import type { NodeType } from '@/interfaces/conceptual-map';
import type { ID } from '@/interfaces/core';
import { useExplorationStore } from '@/stores/exploration';
import { computed, ref } from 'vue';

const {
  registryNodes,
  selectedNodeId,
  inboxNodes,
  activeCanvasId,
  selectNode
} = useRegistry();

const explorationStore = useExplorationStore();

const viewMode = ref<'all' | 'inbox'>('all');

const stabilityScore = computed(() => explorationStore.stabilityScore);

const filterNodesByTypes = (types: NodeType[]) => {
  const baseList = viewMode.value === 'all' ? registryNodes.value : inboxNodes.value;
  return baseList.filter(n => types.includes(n.type as NodeType));
};

/**
 * ACTION HANDLERS
 */
const handleCreateNavigator = () => {
  // Logic to open a modal for new canvas creation
  console.log('Action: Create New Navigation Portal');
};

const handleCreateConcept = () => {
  console.log('Action: Add New Concept or Group');
};

const handleQuickCapture = () => {
  console.log('Action: Open Quick Capture for Insights/Resources');
};

const handleTeleport = (nodeId: ID, canvasId?: ID) => {
  // Logic to switch activeCanvasViewId and focus the node
  console.log(`Teleporting to Node: ${nodeId} on Canvas: ${canvasId}`);
};
</script>

<style scoped>
</style>