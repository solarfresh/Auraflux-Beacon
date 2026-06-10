<template>
  <BaseEdge
    :id="props.id"
    :path="edgePath"
    :marker-end="props.data?.status === 'AI_EXTRACTED' ? undefined : props.markerEnd"
    :style="edgeStyle"
    class="v-conceptual-edge"
    :class="{ 'suggested-glow-animation': props.data?.status === 'AI_EXTRACTED' }"
  />

  <EdgeLabelRenderer>
    <VBox
      tag="div"
      :style="labelContainerStyle"
      class="nodrag nopan flex flex-col items-center justify-center gap-1.5"
      title="Double click to edit details"
      @dblclick.stop="handleLabelDoubleClick"
    >
      <VCluster
        v-if="props.data?.status === 'AI_EXTRACTED' && !shouldRenderActionGroup"
        gap="xs"
        align="center"
        class="v-edge-pill px-2.5 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95 hover:shadow-indigo-100 hover:shadow-md"
      >
        <VIcon name="Sparkles" size="xs" class="text-indigo-600 animate-pulse" />
        <VTypography size="xs" weight="bold" class="tracking-wide">
          Connect?
        </VTypography>
      </VCluster>

      <VCluster
        v-else-if="!shouldRenderActionGroup"
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
          class="max-w-30 truncate"
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

      <VEntityCanvasQuickActions
        v-if="shouldRenderActionGroup"
        :status="props.data?.status"
        class="animate-in fade-in zoom-in duration-150 z-50 shadow-xl"
        @action="handleQuickAction"
      />
    </VBox>
  </EdgeLabelRenderer>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useVueFlow,
  type EdgeProps,
  Position,
} from '@vue-flow/core'
import { ConceptualMapContextKey } from '@/constants/injection-keys'
import type { ConceptualEdge } from '@/interfaces/conceptual-map'
import type { EntityActionType } from '@/interfaces/core'
import { HANDLE_MAP } from '@/constants/canvases'

// Atoms & Shared Components Imports
import VBox from '@/components/atoms/layout/VBox.vue'
import VBadge from '@/components/atoms/indicators/VBadge.vue'
import VTypography from '@/components/atoms/indicators/VTypography.vue'
import VIcon from '@/components/atoms/indicators/VIcon.vue'
import VCluster from '@/components/atoms/layout/VCluster.vue'

// 🟢 Quick Action Micro-Toolbar Import
import VEntityCanvasQuickActions from '@/components/molecules/canvases/VEntityCanvasQuickActions.vue'

interface Props extends EdgeProps<ConceptualEdge> {
  sourceHandle?: string
  targetHandle?: string
}
const props = defineProps<Props>()

const context = inject(ConceptualMapContextKey)
const { viewport } = useVueFlow()

if (!context) {
  throw new Error(
    '[Architectural Violation] VConceptualEdge must be rendered within the tree of a <ConceptualMapCanvas>.'
  );
}

// --- Path & Label Center Coordinates Calculation ---
const pathData = computed(() => {
  const sourcePos = props.sourceHandle ? HANDLE_MAP[props.sourcePosition] : Position.Right
  const targetPos = props.targetHandle ? HANDLE_MAP[props.targetPosition] : Position.Left

  return getBezierPath({
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

// --- 🟢 Dynamic Layout & Scale Compensation Logic ---

/**
 * Bounds checker determining whether shortcut action panels are eligible for display.
 */
const shouldRenderActionGroup = computed(() => {
  const isEditorClosed = !context.isNodeEditActive.value

  return isEditorClosed && props.selected
})

/**
 * Combines spatial position vectors with inverse scaling to fully resolve zoom distortion.
 */
const labelContainerStyle = computed(() => {
  const currentZoom = viewport.value.zoom || 1
  const inverseScale = 1 / currentZoom

  return {
    position: 'absolute' as const,
    // Base placement mapped precisely on edge midpoint
    left: '0px',
    top: '0px',
    // Compound matrix: handles centering offset AND scale neutralization simultaneously
    transform: `translate(-50%, -50%) translate(${labelX.value}px, ${labelY.value}px) scale(${inverseScale})`,
    transformOrigin: 'center center',
    pointerEvents: 'all' as const,
  }
})

/**
 * Intercepts double-click gestures on the label wrapper, bridging current coordinates
 * and edge parameters directly to the useEdgeInterceptor store layer.
 */
const handleLabelDoubleClick = () => {
  if (!props.data) return

  const position = {
    x: labelX.value,
    y: labelY.value
  }

  const edge = context.conceptualEdges.value.find((e: any) => e.id === props.id)
  context.openInterceptor(null, position, edge);
}

// --- 🟢 Reengineered Edge Quick Mutation Handlers ---

const handleQuickAction = async (action: EntityActionType) => {
  const edge = context.conceptualEdges.value.find((e: any) => e.id === props.id)
  if (!edge) return

  switch (action) {
    case 'ACCEPT':
    case 'LOCK':
      edge.status = 'LOCKED'
      await context.updateConceptualMapEdge(edge, 'update')
      break

    case 'REJECT':
      // Drop AI extracted proposals directly from the active viewport map
      await context.updateConceptualMapEdge(edge, 'delete')
      break

    case 'HOLD':
      edge.status = 'ON_HOLD'
      await context.updateConceptualMapEdge(edge, 'update')
      break

    case 'DRAFT':
      edge.status = 'USER_DRAFT'
      await context.updateConceptualMapEdge(edge, 'update')
      break

    case 'DELETE':
      if (confirm('Delete this relationship permanently?')) {
        await context.updateConceptualMapEdge(edge, 'delete')
      }
      break
  }
}

// --- Theme & Visual Logic ---

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

const edgeStyle = computed(() => {
  const baseStyle = { ...props.style }
  const isSuggested = props.data?.status === 'AI_EXTRACTED'
  const isTrigger = props.data?.type === 'TRIGGERS'

  if (isSuggested) {
    return {
      ...baseStyle,
      strokeWidth: 3,
      stroke: '#818cf8', // Indigo 400
      strokeOpacity: 0.6,
      strokeDasharray: '6, 6',
    }
  }

  if (isTrigger) {
    return {
      ...baseStyle,
      strokeWidth: props.selected ? 3 : 2,
      stroke: props.selected ? '#818cf8' : '#d97706', // Amber 600
      strokeDasharray: '5, 5',
    }
  }

  return {
    ...baseStyle,
    strokeWidth: props.selected ? 3 : 2,
    stroke: props.selected ? '#818cf8' : '#94a3b8',
    transition: 'stroke 0.2s, stroke-width 0.2s',
  }
})
</script>

<style scoped>
.v-conceptual-edge {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.05));
}

.v-edge-pill {
  user-select: none;
}

.suggested-glow-animation {
  animation: edgeFlow 25s linear infinite;
  filter: drop-shadow(0 0 4px rgba(129, 140, 248, 0.6));
}

.animate-in {
  animation: fadeIn 0.15s ease-out;
}

@keyframes edgeFlow {
  from {
    stroke-dashoffset: 500;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
</style>