<template>
  <VNodeContainer
    :id="props.id"
    :status="props.data.status"
    :selected="props.selected"
    :theme-class="themeClass"
    padding="sm"
  >
    <template #default="{ node }">
      <VStack gap="sm">
        <VCluster justify="between" align="center">
          <VBadge variant="indigo" size="xs" class="uppercase">
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

        <VStack gap="xs">
          <VTypography tag="h4" size="sm" weight="bold" class="leading-tight">
            {{ props.data.label }}
          </VTypography>

          <div
            v-if="props.data.user_notes"
            class="p-2 bg-white/60 rounded border border-indigo-100/50 shadow-inner"
          >
            <VTypography size="xs" class="italic text-indigo-700 line-clamp-2">
              "{{ props.data.user_notes }}"
            </VTypography>
          </div>
        </VStack>
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
 * VInsightNode Organism
 * Represents a synthesis, reflection, or high-level conclusion.
 * Uses Indigo theme tokens to signify complex cognitive processing.
 */
interface Props extends NodeProps<ConceptualNode> {}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
}>()

const store = useExplorationStore() // Hook into the central state

// Theme mapping for Insights (Indigo/Purple spectrum)
const themeClass = 'bg-indigo-50 border-indigo-100 text-indigo-900'
const handleColor = 'bg-indigo-400'
</script>

<style scoped>
/* Interaction Logic: Triggers edit button visibility from the molecule shell hover */
:deep(.v-node-container:hover) .group-hover\:opacity-100 {
  opacity: 1;
}
</style>