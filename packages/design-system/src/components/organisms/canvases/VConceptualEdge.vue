<template>
  <BaseEdge
    :id="props.id"
    :path="edgePath"
    :style="edgeStyle"
  />
  <EdgeLabelRenderer>
    <VBox
      v-if="props.label || props.data?.type"
      tag="div"
      padding="xs"
      rounded="md"
      border="all"
      intent="neutral"
      surface="solid"
      class="absolute pointer-events-auto shadow-xs font-mono"
      :style="{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }"
    >
      <VTypography size="xs">
        {{ props.label || props.data?.type }}
      </VTypography>
    </VBox>
  </EdgeLabelRenderer>
</template>

<script setup lang="ts">
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import { ConceptualMapContextKey, DEFAULT_CONCEPTUAL_MAP_CONTEXT } from '@auraflux/design-system/constants/injection-keys';
import type { ConceptualEdge } from '@auraflux/design-system/interfaces/conceptual-map';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@vue-flow/core';
import { computed, inject } from 'vue';

const props = defineProps<EdgeProps<ConceptualEdge>>();

const context = inject(ConceptualMapContextKey, DEFAULT_CONCEPTUAL_MAP_CONTEXT);

const pathData = computed(() => {
  return getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });
});

const edgePath = computed(() => pathData.value[0]);
const labelX = computed(() => pathData.value[1]);
const labelY = computed(() => pathData.value[2]);

const edgeStyle = computed(() => ({
  stroke: props.selected ? '#6366f1' : '#94a3b8',
  strokeWidth: props.selected ? 3 : 2,
}));
</script>
