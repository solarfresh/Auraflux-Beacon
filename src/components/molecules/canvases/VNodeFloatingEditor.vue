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
      class="w-72 shadow-xl animate-in fade-in zoom-in duration-200 nodrag nopan"
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

        <VCluster justify="end" gap="xs" class="w-full">
          <VButton variant="ghost" size="xs" @click="cancelNodeEdit">
            Cancel
          </VButton>

          <template v-if="isUnverified">
            <VButton
              variant="secondary"
              size="xs"
              :disabled="!isValid"
              @click="handleStateSubmit('USER_DRAFT')"
            >
              Save Draft
            </VButton>
            <VButton
              variant="primary"
              size="xs"
              class="bg-emerald-600! hover:bg-emerald-700!"
              icon-name="LockClosed"
              :disabled="!isValid"
              @click="handleStateSubmit('LOCKED')"
            >
              Lock Node
            </VButton>
          </template>

          <template v-else>
            <VButton
              variant="secondary"
              size="xs"
              icon-name="ArchiveBox"
              @click="handleStateSubmit('ON_HOLD')"
            >
              Put On Hold
            </VButton>
            <VButton
              variant="primary"
              size="xs"
              icon-name="DocumentCheck"
              :disabled="!isValid"
              @click="handleStateSubmit('LOCKED')"
            >
              Save
            </VButton>
          </template>
        </VCluster>
      </VStack>
    </VBox>
  </NodeToolbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NodeToolbar } from '@vue-flow/node-toolbar';
import { Position } from '@vue-flow/core';
import { useNodeInterceptor } from '@/composables/useNodeInterceptor';

// Atoms Layer Imports
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';

const {
  context,
  confirmNodeEdit,
  cancelNodeEdit
} = useNodeInterceptor();

const currentNode = computed(() => {
  const nodeId = context.editingNodeId.value;
  return context.conceptualNodes.get(nodeId);
});

const isValid = computed(() => !!context.localNodeData.value.label?.trim());
const isUnverified = computed(() => {
  const status = currentNode.value?.status;
  return status === 'USER_DRAFT' || status === 'AI_EXTRACTED';
});

async function handleStateSubmit(targetStatus: string) {
  if (!isValid.value) return;
  context.localNodeData.value.status = targetStatus;
  await confirmNodeEdit();
}
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.15s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>