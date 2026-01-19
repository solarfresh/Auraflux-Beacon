<template>
  <div
    :class="[
      'group relative flex items-start gap-3 p-2 rounded-lg transition-all cursor-pointer border-2',
      isActive ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-50',
      // Anti-hallucination jitter triggered by low health score
      node.groundedness < 4 ? 'animate-jitter' : ''
    ]"
    @click="emit('select', node.id)"
    @mouseenter="emit('hover', node.id)"
    @mouseleave="emit('hover', null)"
  >
    <div class="relative flex-shrink-0 mt-1">
      <div
        :class="[
          'w-3 h-3 rounded-full transition-shadow duration-500',
          solidityClass,
          node.solidity === 'PULSING' ? 'animate-pulse' : ''
        ]"
      ></div>
      <div class="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
        <Icon :name="typeIcon" :color="typeColor" size="xs" />
      </div>
    </div>

    <div class="flex-grow min-w-0">
      <div class="flex items-center justify-between gap-2 mb-0.5">
        <Text
          tag="span"
          size="xs"
          weight="bold"
          :color="isActive ? 'indigo-600' : 'gray-400'"
          class="uppercase tracking-tighter"
        >
          {{ node.type }}
        </Text>

        <div class="flex gap-0.5">
          <Text
            v-for="cId in node.canvases"
            :key="cId"
            tag="span"
            size="xs"
            weight="bold"
            color="gray-500"
            class="px-1 bg-gray-200 rounded hover:bg-indigo-600 hover:text-white transition-colors leading-none py-0.5"
            @click.stop="emit('teleport', node.id, cId)"
          >
            {{ cId }}
          </Text>
          <div v-if="node.canvases.length === 0" class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" title="In Inbox"></div>
        </div>
      </div>

      <Text
        tag="p"
        :size="isActive ? 'base' : 'sm'"
        :weight="isActive ? 'bold' : 'medium'"
        :color="isActive ? 'gray-900' : 'gray-700'"
        class="truncate leading-tight"
      >
        {{ node.label }}
      </Text>
    </div>

    <div class="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="tertiary"
        size="sm"
        icon-only
        @click.stop="emit('teleport', node.id)"
      >
        <Icon name="arrow-right-circle" color="gray-400" size="sm" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SidebarNodeItem.vue
 * Core logic for Anti-Hallucination Jitter and Physical Solidity Lights.
 * Adheres to atomic component standards for Text, Icon, and Button.
 */
import { computed } from 'vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';
import type { NodeType, ConceptualNode } from '@/interfaces/conceptual-map';


const props = defineProps<{
  node: ConceptualNode;
  isActive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'hover', id: string | null): void;
  (e: 'teleport', nodeId: string, canvasId?: string): void;
}>();

// --- PHYSICAL MAPPING: THE 7 NODE TYPES ---
const typeIcon = computed(() => {
  const iconMap: Record<string, string> = {
    focus: 'map-pin',
    concept: 'square-3-stack-3d',
    resource: 'document-duplicate',
    insight: 'light-bulb',
    query: 'magnifying-glass-circle',
    group: 'rectangle-group',
    navigation: 'rocket-launch'
  };
  return iconMap[props.node.type] || 'circle-stack';
});

const typeColor = computed(() => {
  if (props.isActive) return 'indigo-600';
  const colorMap: Record<string, string> = {
    focus: 'indigo-600',
    concept: 'gray-700',
    resource: 'blue-500',
    insight: 'emerald-500',
    query: 'amber-500',
    group: 'purple-500',
    navigation: 'rose-500'
  };
  return colorMap[props.node.type] || 'gray-400';
});

// --- MATERIALITY: SOLIDITY LIGHT LOGIC ---
const solidityClass = computed(() => {
  switch (props.node.solidity) {
    case 'SOLID': // Evidence-backed (High Solidity)
      return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
    case 'PULSING': // Reflection-only (Shadow state)
      return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]';
    case 'DIMMED': // Isolated or placeholder
    default:
      return 'bg-gray-300';
  }
});
</script>

<style scoped>
/* ANTI-HALLUCINATION JITTER: Low frequency to trigger cognitive alarm */
@keyframes jitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-1.5px, 0.5px); }
  50% { transform: translate(1.5px, -0.5px); }
  75% { transform: translate(-1px, -1px); }
  100% { transform: translate(0, 0); }
}

.animate-jitter {
  animation: jitter 0.15s infinite;
  border-color: #ef4444 !important; /* Critical Red */
  background-color: #fef2f2;
}
</style>