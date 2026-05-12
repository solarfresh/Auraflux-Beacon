<template>
  <BaseEdge
    :id="props.id"
    :path="edgePath"
    :marker-end="props.markerEnd"
    :style="edgeStyle"
    class="v-conceptual-edge"
  />

  <EdgeLabelRenderer>
    <div
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
        pointerEvents: 'all',
      }"
      class="nodrag nopan"
    >
      <VCluster
        gap="xs"
        align="center"
        class="v-edge-pill px-2 py-1 rounded-full border shadow-sm transition-all group hover:shadow-md"
        :class="themeClasses"
      >
        <VBadge :variant="badgeVariant" size="xs" class="font-mono scale-90">
          {{ props.data?.type || 'REF' }}
        </VBadge>

        <VTypography
          v-if="props.label"
          size="xs"
          weight="bold"
          class="max-w-[120px] truncate"
        >
          {{ props.label }}
        </VTypography>

        <VIcon
          v-if="props.data?.evidence"
          name="DocumentCheck"
          size="xs"
          class="text-slate-400 group-hover:text-indigo-500"
        />
      </VCluster>
    </div>
  </EdgeLabelRenderer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
  Position,
} from '@vue-flow/core'
import type { ConceptualEdge } from '@/interfaces/conceptual-map';
import { HANDLE_MAP } from '@/constants/canvases';

// Components
import VBadge from '@/components/atoms/indicators/VBadge.vue'
import VTypography from '@/components/atoms/indicators/VTypography.vue'
import VIcon from '@/components/atoms/indicators/VIcon.vue'
import VCluster from '@/components/atoms/layout/VCluster.vue'

/**
 * VConceptualEdge Organism
 * Implements a semantic relationship link between research nodes.
 * Supports EdgeType visualization and evidence grounding indicators.
 */
interface Props extends EdgeProps<ConceptualEdge> {
  // Explicitly add these properties to resolve the TypeScript error
  sourceHandle?: string
  targetHandle?: string
}
const props = defineProps<Props>()

// --- Path Calculation ---

const pathData = computed(() => {
  const sourcePos = props.sourceHandle ? HANDLE_MAP[props.sourcePosition] : Position.Right
  const targetPos = props.targetHandle ? HANDLE_MAP[props.targetPosition] : Position.Left

  return   getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: sourcePos,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: targetPos,
  })
})

const edgePath = computed(() => pathData.value[0])
const labelX = computed(() => pathData.value[1])
const labelY = computed(() => pathData.value[2])
// --- Theme & Visual Logic ---

/**
 * Determine Badge variant based on EdgeType.
 * VALIDATES -> emerald (support), CONSTRAINS -> red (limit), TRIGGERS -> amber (causal).
 */
const badgeVariant = computed(() => {
  const type = props.data?.type
  switch (type) {
    case 'VALIDATES': return 'emerald'
    case 'CONSTRAINS': return 'red'
    case 'TRIGGERS': return 'amber'
    case 'LINK': return 'purple'
    default: return 'slate'
  }
})

const themeClasses = computed(() => {
  if (props.selected) return 'bg-white border-indigo-400 ring-2 ring-indigo-100'
  return 'bg-white border-slate-200 text-slate-700'
})

const edgeStyle = computed(() => ({
  ...props.style,
  strokeWidth: props.selected ? 3 : 2,
  stroke: props.selected ? '#818cf8' : '#94a3b8',
  transition: 'stroke 0.2s, stroke-width 0.2s',
}))
</script>

<style scoped>
.v-conceptual-edge {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.05));
}

.v-edge-pill {
  /* Ensure the label doesn't interfere with canvas panning unless interacted with */
  user-select: none;
}
</style>