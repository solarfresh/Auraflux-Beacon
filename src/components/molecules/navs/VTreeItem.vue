<template>
  <VBox
    padding="xs"
    rounded
    clickable
    v-bind="$attrs"
    :draggable="true"
    :background="isActive ? 'indigo-50' : 'transparent'"
    :class="[
      'relative border-2 transition-all duration-200 group',
      isActive ? 'border-indigo-200 shadow-sm' : 'border-transparent hover:bg-slate-50',
      // Anti-hallucination Jitter logic
      { 'animate-jitter border-red-500 bg-red-50': node.groundedness < 4 }
    ]"
    @click="emit('select', node.id)"
    @mouseenter="emit('hover', node.id)"
    @mouseleave="emit('hover', null)"
    @dragstart="handleDragStart"
  >
    <VCluster align="start" gap="md" full-width>

      <VBox padding="none" class="relative mt-1.5 flex-shrink-0">
        <div
          :class="[
            'w-3 h-3 rounded-full transition-all duration-500',
            solidityStyles.colorClass,
            solidityStyles.shadowClass,
            { 'animate-pulse': node.solidity === 'PULSING' }
          ]"
        />
        <VBox
          padding="none"
          background="white"
          rounded-full
          border="all"
          class="absolute -top-1.5 -right-1.5 p-0.5 shadow-sm"
        >
          <VIcon :name="typeIcon" :color="typeColor" size="xs" />
        </VBox>
      </VBox>

      <VStack gap="none" class="flex-1 min-w-0">
        <VTypography
          tag="span"
          size="xs"
          weight="bold"
          :color="isActive ? 'indigo-600' : 'gray-400'"
          class="uppercase tracking-tighter"
        >
          {{ node.type }}
        </VTypography>

        <VTypography
          tag="p"
          :size="isActive ? 'base' : 'sm'"
          :weight="isActive ? 'bold' : 'medium'"
          :color="isActive ? 'gray-900' : 'gray-700'"
          class="truncate leading-tight"
        >
          {{ node.label }}
        </VTypography>
      </VStack>

      <VBox padding="none" class="self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <VButton
          variant="ghost"
          size="sm"
          icon-only
          icon-name="ArrowRightCircle"
          @click.stop="emit('teleport', node.id)"
        />
      </VBox>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * SidebarNodeItem (Molecule)
 * Represents a node in the Conceptual Map with groundedness indicators.
 * NOTE: inheritAttrs: false ensures $attrs doesn't break the animation Box.
 */
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import { useCanvasDrop } from '@/composables/useCanvasDrop';
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const { onDragStart } = useCanvasDrop();

const props = defineProps<{
  node: ConceptualNode;
  isActive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'hover', id: string | null): void;
  (e: 'teleport', nodeId: string, canvasId?: string): void;
}>();

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
  return colorMap[props.node.type] || 'slate-500';
});

const solidityStyles = computed(() => {
  switch (props.node.solidity) {
    case 'SOLID':
      return {
        colorClass: 'bg-emerald-500',
        shadowClass: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]'
      };
    case 'PULSING':
      return {
        colorClass: 'bg-amber-400',
        shadowClass: 'shadow-[0_0_8px_rgba(251,191,36,0.3)]'
      };
    default:
      return {
        colorClass: 'bg-gray-300',
        shadowClass: ''
      };
  }
});

const handleDragStart = (event: DragEvent) => {
  onDragStart(event, props.node);
}
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