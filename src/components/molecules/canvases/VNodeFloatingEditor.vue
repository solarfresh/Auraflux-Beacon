<template>
  <NodeToolbar
    :node-id="context.editingNodeId.value"
    :is-visible="context.isNodeEditActive.value"
    :position="Position.Top"
    class="z-50"
  >
    <VBox
      background="white"
      rounded="xl"
      border="all"
      padding="md"
      class="w-72 shadow-xl animate-in fade-in zoom-in duration-200 nodrag nopan v-node-floating-editor"
    >
      <VStack gap="md">
        <VCluster justify="between" align="center" class="w-full">
          <VCluster gap="xs" align="center">
            <VIcon name="DocumentText" class="text-indigo-600 size-4" />
            <VTypography weight="bold" size="sm">Refine Research Node</VTypography>
          </VCluster>
          <VButton
            variant="ghost"
            size="xs"
            icon-only
            icon-name="XMark"
            @click="cancelNodeEdit"
          />
        </VCluster>

        <VStack border="bottom" class="h-0 w-full" />

        <VFormField id="concept-label" label="Concept / Label" size="sm">
          <VInput
            v-model="context.localNodeData.value.label"
            placeholder="e.g., Socio-economic Resilience"
            size="sm"
          />
        </VFormField>

        <VFormField id="strategic-reflection" label="Strategic Reflection" size="sm">
          <VTextarea
            v-model="context.localNodeData.value.userNotes"
            :rows="3"
            placeholder="Record why this concept is critical..."
          />
        </VFormField>

        <VEntityStatusActionGroup
          entity-type="node"
          :is-locked="isLocked"
          :is-modified="isNodeModified"
          :disabled="!isValid"
          :labels="{
            unlockedHold: 'Save Draft',
            unlockedPrimary: 'Lock Node',
            unlockedPrimaryClass: 'bg-emerald-600! hover:bg-emerald-700!',
            lockedHold: 'Put On Hold',
            lockedPrimary: 'Save'
          }"
          @cancel="cancelNodeEdit"
          @submit="handleStateSubmit"
        />
      </VStack>
    </VBox>
  </NodeToolbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NodeToolbar } from '@vue-flow/node-toolbar';
import { Position } from '@vue-flow/core';
import { useNodeInterceptor } from '@/composables/useNodeInterceptor';

// Atoms Layer Layout & UI Component Imports
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';

// Shared State Machine Action Component
import VEntityStatusActionGroup from '@/components/molecules/domain/VEntityStatusActionGroup.vue';

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
 * Evaluates whether the target concept node state is finalized.
 */
const isLocked = computed(() => currentNode.value?.status === 'LOCKED');

/**
 * Enforces field validations preventing form submission if mandatory criteria are unmet.
 */
const isValid = computed(() => !!context.localNodeData.value.label?.trim());

/**
 * Tracks dirty fields to determine button eligibility states under LOCKED conditions.
 */
const isNodeModified = computed(() => {
  if (!currentNode.value) return false;
  return (
    context.localNodeData.value.label?.trim() !== currentNode.value.label ||
    (context.localNodeData.value.userNotes || '') !== (currentNode.value.userNotes || '')
  );
});

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