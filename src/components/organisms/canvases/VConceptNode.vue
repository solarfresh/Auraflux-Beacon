<template>
  <VNodeContainer
    :id="props.id"
    :status="props.data.status"
    :selected="props.selected"
    :theme-class="themeClass"
    padding="sm"
  >
    <template #default="{ node }">
      <VStack gap="xs">
        <VCluster justify="between" align="center">
          <VBadge variant="emerald" size="xs" class="uppercase">
            {{ props.data.type }}
          </VBadge>

          <VButton
            variant="ghost"
            size="xs"
            icon-only
            icon-name="PencilSquare"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="emit('edit', props.data.id)"
          />
        </VCluster>

        <VTypography tag="h4" size="sm" weight="bold" class="leading-snug line-clamp-2">
          {{ props.data.label }}
        </VTypography>
      </VStack>
    </template>

    <template #overlay>
      <VNodeHandle
        id="n"
        type="target"
        :position="Position.Top"
        :color-class="handleColor"
      />
      <VNodeHandle
        id="s"
        type="source"
        :position="Position.Bottom"
        :color-class="handleColor"
      />
      <VNodeHandle
        id="e"
        type="source"
        :position="Position.Right"
        :color-class="handleColor"
      />
      <VNodeHandle
        id="w"
        type="target"
        :position="Position.Left"
        :color-class="handleColor"
      />
    </template>
  </VNodeContainer>
</template>

<script setup lang="ts">
import VButton from '@/components/atoms/buttons/VButton.vue'
import VNodeHandle from '@/components/atoms/canvases/VNodeHandle.vue'
import VBadge from '@/components/atoms/indicators/VBadge.vue'
import VTypography from '@/components/atoms/indicators/VTypography.vue'
import VCluster from '@/components/atoms/layout/VCluster.vue'
import VStack from '@/components/atoms/layout/VStack.vue'
import VNodeContainer from '@/components/organisms/canvases/VNodeContainer.vue'
import { Position, type NodeProps } from '@vue-flow/core'
import { useExplorationStore } from '@/stores/exploration'

import type { ConceptualNode } from '@/interfaces/conceptual-map'

/**
 * VConceptNode Organism
 * Represents a discrete research entity or keyword.
 * Uses Emerald theme tokens to signify foundational knowledge.
 */
interface Props extends NodeProps<ConceptualNode> {}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
}>()

const store = useExplorationStore() // Hook into the central state

// Theme mapping for Concepts
const themeClass = 'bg-emerald-50 border-emerald-100 text-emerald-900'
const handleColor = 'bg-emerald-400'
</script>

<style scoped>
/* Ensure the edit button is visible when the parent container is hovered */
:deep(.v-node-container:hover) .group-hover\:opacity-100 {
  opacity: 1;
}
</style>