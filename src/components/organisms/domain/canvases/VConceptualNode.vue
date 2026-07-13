<template>
  <VNodeContainer
    :id="props.id"
    :status="props.data.status"
    :selected="props.selected"
    :theme-class="theme.container"
    padding="sm"
  >
    <template #default>
      <VStack gap="sm">
        <VCluster justify="between" align="center">
          <VBadge :variant="theme.badge" size="xs" class="uppercase">
            {{ props.data.type }}
          </VBadge>

          <VButton
            variant="ghost"
            size="xs"
            icon-only
            icon-name="PencilSquare"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="context.openNodeEditor(props.id, props.data)"
          />
        </VCluster>

        <VStack gap="xs">
          <VTypography tag="h4" size="sm" weight="bold" class="leading-tight">
            {{ props.data.label }}
          </VTypography>

          <VBox
            v-if="props.data.type === 'INSIGHT' && props.data.rationale"
            background="white"
            padding="xs"
            rounded="sm"
            border="all"
            class="bg-opacity-60 shadow-inner"
          >
            <VTypography size="xs" class="italic opacity-80 line-clamp-2">
              "{{ props.data.rationale }}"
            </VTypography>
          </VBox>

          </VStack>
      </VStack>
    </template>

    <template #overlay>
      <VNodeHandle
        id="source-top"
        type="source"
        style="z-index: 20 !important; pointer-events: auto !important;"
        :position="Position.Top"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="source-bottom"
        type="source"
        style="z-index: 20 !important; pointer-events: auto !important;"
        :position="Position.Bottom"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="source-right"
        type="source"
        style="z-index: 20 !important; pointer-events: auto !important;"
        :position="Position.Right"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="source-left"
        type="source"
        style="z-index: 20 !important; pointer-events: auto !important;"
        :position="Position.Left"
        :color-class="theme.handle"
      />

      <VNodeHandle
        id="target-top"
        type="target"
        style="z-index: 10 !important; pointer-events: auto !important;"
        :position="Position.Top"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="target-bottom"
        type="target"
        style="z-index: 10 !important; pointer-events: auto !important;"
        :position="Position.Bottom"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="target-right"
        type="target"
        style="z-index: 10 !important; pointer-events: auto !important;"
        :position="Position.Right"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="target-left"
        type="target"
        style="z-index: 10 !important; pointer-events: auto !important;"
        :position="Position.Left"
        :color-class="theme.handle"
      />
    </template>
  </VNodeContainer>
</template>

<script setup lang="ts">
import { NODE_THEMES } from '@/constants/canvases';
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import { Position, type NodeProps } from '@vue-flow/core';
import { computed, inject } from 'vue';

// Components
import VButton from '@/components/atoms/buttons/VButton.vue';
import VNodeHandle from '@/components/atoms/canvases/VNodeHandle.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VNodeContainer from '@/components/organisms/domain/canvases/VNodeContainer.vue';
import { ConceptualMapContextKey } from '@/constants/injection-keys';

const context = inject(ConceptualMapContextKey);

if (!context) {
  throw new Error(
    '[Architectural Violation] VConceptualNode must be rendered within the tree of a <ConceptualMapCanvas>.'
  );
}


/**
 * VConceptualNode Organism
 * Unified node component that handles all NodeTypes via theme configuration.
 * Aligned with Empirical Science standards and Issue #100.
 */
interface Props extends NodeProps<ConceptualNode> {}
const props = defineProps<Props>()

// Computed theme based on the NodeType defined in constants/canvases.ts
const theme = computed(() => {
  return NODE_THEMES[props.data.type] || NODE_THEMES.CONCEPT
})
</script>

<style scoped>
/* Interaction Logic: Triggers edit button visibility from the VNodeContainer hover state */
:deep(.v-node-container:hover) .group-hover\:opacity-100 {
  opacity: 1;
}
</style>