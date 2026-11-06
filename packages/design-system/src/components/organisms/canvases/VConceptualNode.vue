<template>
  <NodeLabelContainer
    :id="props.id"
    :label="props.data.label"
    :type="props.data.type"
    :rationale="props.data.rationale"
    :status="props.data.status"
    :handles="props.data.handles"
    class="v-conceptual-node group transition-all"
    :intent="props.selected ? 'brand' : nodeTheme.intent"
    :surface="nodeTheme.surface"
    rounded="lg"
    border="all"
    padding="sm"
    @update:label="handleLabelUpdate"
  >
    <template #header>
      <VCluster justify="between" align="center">
        <VTypography size="xs" weight="bold" class="uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {{ props.data.type }}
        </VTypography>
      </VCluster>
    </template>

    <VStack gap="xs">
      <VTypography v-if="props.data.content" size="xs" class="text-slate-600 line-clamp-2">
        {{ props.data.content }}
      </VTypography>
    </VStack>
  </NodeLabelContainer>
</template>

<script setup lang="ts">
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import NodeLabelContainer from '@auraflux/design-system/components/molecules/canvases/NodeLabelContainer.vue';
import { ConceptualMapContextKey, DEFAULT_CONCEPTUAL_MAP_CONTEXT } from '@auraflux/design-system/constants/injection-keys';
import { NODE_THEMES } from '@auraflux/design-system/constants/theme';
import type { ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import type { NodeProps } from '@vue-flow/core';
import { inject, computed } from 'vue';

const props = defineProps<NodeProps<ConceptualNode>>();

const context = inject(ConceptualMapContextKey, DEFAULT_CONCEPTUAL_MAP_CONTEXT);

const nodeTheme = computed(() => {
  return NODE_THEMES[props.data.type] || { intent: 'neutral', surface: 'solid' };
});

const handleLabelUpdate = (newLabel: string) => {
  if (context && typeof context.updateNode === 'function') {
    context.updateNode(props.id, {
      ...props.data,
      label: newLabel
    });
  } else if (context && typeof (context as any).addNode === 'function') {
    // Fallback if updateNode is not available
    (context as any).addNode({
      ...props.data,
      label: newLabel
    });
  }
};
</script>
