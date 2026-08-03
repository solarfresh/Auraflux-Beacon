<template>
  <NodeToolbar
    :node-id="context.editingNodeId.value"
    :is-visible="context.isNodeEditActive.value"
    :position="Position.Bottom"
    class="z-50"
  >
    <VNodeFormEditor
      :node="currentNode"
      @confirm="handleStateSubmit"
      @cancel="cancelNodeEdit"
    />
  </NodeToolbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NodeToolbar } from '@vue-flow/node-toolbar';
import { Position } from '@vue-flow/core';
import { useNodeInterceptor } from '@/composables/useNodeInterceptor';
import VNodeFormEditor from '@/components/organisms/forms/VNodeFormEditor.vue';

/**
 * VNodeFloatingEditor Molecule
 * Rendered contextually on top of active VueFlow node graphs using specialized toolbars.
 * Connects directly to useNodeInterceptor state machines.
 */
const {
  context,
  confirmNodeEdit,
  cancelNodeEdit
} = useNodeInterceptor();

// --- Computed Analytical State Layers ---

/**
 * Resolves the underlying original node object stored inside the state Map context.
 */
const currentNode = computed(() => {
  const nodeId = context.editingNodeId.value;
  return context.conceptualNodes.get(nodeId);
});

/**
 * Enforces field validations preventing form submission if mandatory criteria are unmet.
 */
const isValid = computed(() => !!context.localNodeData.value.label?.trim());

// --- Action Delegations ---

/**
 * Dispatches status updates down to the store layers after binding target states.
 * @param targetStatus Destination status derived from state machine rules.
 */
async function handleStateSubmit(targetStatus: 'LOCKED' | 'ON_HOLD' | 'USER_DRAFT') {
  if (!isValid.value) return;
  context.localNodeData.value.status = targetStatus;
  await confirmNodeEdit();
}
</script>

<style scoped>
.v-node-floating-editor {
  user-select: none;
}

/* Micro-interaction layer animations for seamless popup entry */
.animate-in {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>