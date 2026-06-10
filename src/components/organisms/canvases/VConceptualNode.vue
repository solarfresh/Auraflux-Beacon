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

          <div
            v-if="props.data.type === 'INSIGHT' && props.data.userNotes"
            class="p-2 bg-white/60 rounded border border-white/50 shadow-inner"
          >
            <VTypography size="xs" class="italic opacity-80 line-clamp-2">
              "{{ props.data.userNotes }}"
            </VTypography>
          </div>

          </VStack>
      </VStack>
    </template>

    <template #overlay>
      <VNodeHandle
        id="top"
        type="target"
        :position="Position.Top"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="bottom"
        type="source"
        :position="Position.Bottom"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="right"
        type="source"
        :position="Position.Right"
        :color-class="theme.handle"
      />
      <VNodeHandle
        id="left"
        type="target"
        :position="Position.Left"
        :color-class="theme.handle"
      />
    </template>
  </VNodeContainer>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Position, type NodeProps } from '@vue-flow/core'
import type { ConceptualNode } from '@/interfaces/conceptual-map'
import { NODE_THEMES } from '@/constants/canvases'

// Components
import VButton from '@/components/atoms/buttons/VButton.vue'
import VNodeHandle from '@/components/atoms/canvases/VNodeHandle.vue'
import VBadge from '@/components/atoms/indicators/VBadge.vue'
import VTypography from '@/components/atoms/indicators/VTypography.vue'
import VCluster from '@/components/atoms/layout/VCluster.vue'
import VStack from '@/components/atoms/layout/VStack.vue'
import VNodeContainer from '@/components/organisms/canvases/VNodeContainer.vue'
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