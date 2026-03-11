<template>
  <Handle
    :id="props.id"
    :type="props.type"
    :position="props.position"
    :is-connectable="props.isConnectable"
    class="node-handle-atom"
    :class="[
      props.colorClass,
      // Shared visual properties
      '!w-3 !h-3 border-2 border-white rounded-full',
      'transition-transform duration-200 hover:scale-125',
      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'
    ]"
  />
</template>

<script setup lang="ts">
import { Handle, type Position } from '@vue-flow/core'

/**
 * NodeHandle Atom
 * Standardized connection port for Vue Flow nodes.
 */

const props = withDefaults(defineProps<{
  id: string
  type: 'source' | 'target'
  position: Position
  // Tailwind background class (e.g., 'bg-blue-500')
  colorClass?: string
  // Controls connectability based on business logic
  isConnectable?: boolean
}>(), {
  colorClass: 'bg-slate-300',
  isConnectable: true,
})
</script>

<style scoped>
/* Ensure handles are above the node container but below modals */
.node-handle-atom {
  z-index: 1;
}
</style>