<template>
  <aside class="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-10">
    <div class="p-4 border-b bg-gray-50/50">
      <div class="flex items-center justify-between mb-2">
        <Text tag="span" size="xs" weight="bold" color="indigo-600" class="uppercase">Research Focus</Text>
        <div :class="['px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors',
          globalStability < 40 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-600']">
          {{ globalStability }}% STABLE
        </div>
      </div>

      <div v-if="focusNode" class="group relative">
        <Text tag="h2" size="md" weight="bold" color="gray-900" class="leading-snug">
          {{ focusNode.label }}
        </Text>
      </div>
    </div>

    <div class="px-4 py-2 bg-white border-b flex items-center justify-between">
      <div class="flex gap-2">
        <button
          @click="viewMode = 'all'"
          :class="['text-xs font-medium px-2 py-1 rounded', viewMode === 'all' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100']"
        >
          All Nodes
        </button>
        <button
          @click="viewMode = 'inbox'"
          :class="['text-xs font-medium px-2 py-1 rounded', viewMode === 'inbox' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100']"
        >
          Inbox ({{ inboxNodes.length }})
        </button>
      </div>
      <Icon name="shield-check" :color="globalStability < 40 ? 'red-500' : 'emerald-500'" size="sm" />
    </div>

    <nav class="flex-grow overflow-y-auto p-2 space-y-1 scrollbar-none">
      <div v-for="type in nodeGroups" :key="type" class="mb-4">
        <div class="px-2 mb-1 flex items-center justify-between">
          <Text tag="span" size="xs" weight="semibold" color="gray-400" class="uppercase tracking-widest">
            {{ type }}
          </Text>
          <div class="h-[1px] flex-grow ml-3 bg-gray-100"></div>
        </div>

        <SidebarNodeItem
          v-for="node in filterNodesByType(type)"
          :key="node.id"
          :node="node"
          :is-active="selectedNodeId === node.id"
          @select="handleNodeSelect"
          @teleport="handleTeleport"
        />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRegistry } from '@/composables/useRegistry';
import Text from '@/components/atoms/Text.vue';
import Icon from '@/components/atoms/Icon.vue';
import SidebarNodeItem from '@/components/molecules/SidebarNodeItem.vue';
import type { ID } from '@/interfaces/core'
import type { NodeType, ConceptualNode } from '@/interfaces/conceptual-map';

const {
  registryNodes,
  selectedNodeId,
  inboxNodes,
  activeCanvasId,
  selectNode
} = useRegistry();

const viewMode = ref<'all' | 'inbox'>('all');

// 7 Node Types Ordering for the Sidebar
const nodeGroups: NodeType[] = ['FOCUS', 'CONCEPT', 'RESOURCE', 'INSIGHT', 'QUERY', 'GROUP', 'NAVIGATION'];

const globalStability = computed(() => {
  if (registryNodes.value.length === 0) return 0;
  const sum = registryNodes.value.reduce((acc, n) => acc + n.stabilityScore, 0);
  return Math.round(sum / registryNodes.value.length);
});

const focusNode = computed(() =>
  registryNodes.value.find(n => n.type === 'FOCUS')
);

const filterNodesByType = (type: NodeType) => {
  const baseList = viewMode.value === 'all' ? registryNodes.value : inboxNodes.value;
  return baseList.filter(n => n.type === type);
};

const handleNodeSelect = (id: ID) => {
  selectNode(id);
};

const handleTeleport = (nodeId: ID, canvasId?: ID) => {
  // Logic to switch activeCanvasViewId and focus the node
  console.log(`Teleporting to Node: ${nodeId} on Canvas: ${canvasId}`);
};
</script>

<style scoped>
</style>