<template>
  <div
    :class="[
      'group relative flex items-start gap-3 p-2 rounded-md transition-all cursor-pointer border-2',
      isActive
        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
        : 'bg-transparent border-transparent hover:bg-gray-50',
      // Cognitive Alert: Anti-hallucination jitter
      node.groundedness < 4 ? 'animate-jitter border-red-500 bg-red-50' : ''
    ]"
    @click="emit('select', node.id)"
    @mouseenter="emit('hover', node.id)"
    @mouseleave="emit('hover', null)"
  >
    <div class="relative flex-shrink-0 mt-1.5">
      <div
        :class="[
          'w-3 h-3 rounded-full transition-shadow duration-500',
          solidityClass,
          node.solidity === 'PULSING' ? 'animate-pulse' : ''
        ]"
      ></div>
      <div class="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
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
        variant="ghost"
        size="sm"
        iconOnly
        iconName="ArrowRightCircle"
        @click.stop="emit('teleport', node.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Button from '@/components/atoms/actions/Button.vue';
import type { ConceptualNode } from '@/interfaces/conceptual-map';

const props = defineProps<{
  node: ConceptualNode;
  isActive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'hover', id: string | null): void;
  (e: 'teleport', nodeId: string, canvasId?: string): void;
}>();

// --- MAPPING: Consistent PascalCase Icon Names ---
const typeIcon = computed(() => {
  const iconMap: Record<string, string> = {
    focus: 'MapPin',
    concept: 'Square3Stack3D',
    resource: 'DocumentDuplicate',
    insight: 'LightBulb',
    query: 'MagnifyingGlassCircle',
    group: 'RectangleGroup',
    navigation: 'RocketLaunch'
  };
  return iconMap[props.node.type] || 'CircleStack';
});

const typeColor = computed(() => {
  if (props.isActive) return 'indigo-600';
  const colorMap: Record<string, string> = {
    focus: 'indigo-600',
    resource: 'blue-500',
    insight: 'emerald-500',
    query: 'amber-500',
    group: 'purple-500',
    navigation: 'rose-500'
  };
  return colorMap[props.node.type] || 'gray-500';
});

const solidityClass = computed(() => {
  switch (props.node.solidity) {
    case 'SOLID':
      return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
    case 'PULSING':
      return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]';
    default:
      return 'bg-gray-300';
  }
});
</script>

<style scoped>
@keyframes jitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-1px, 0.5px); }
  50% { transform: translate(1px, -0.5px); }
  75% { transform: translate(-1px, -0.5px); }
  100% { transform: translate(0, 0); }
}
.animate-jitter {
  animation: jitter 0.2s infinite;
}
</style>