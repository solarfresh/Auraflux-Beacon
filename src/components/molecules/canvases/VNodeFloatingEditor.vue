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

        <VCluster justify="end" gap="sm" class="w-full pt-2">
          <VButton variant="ghost" size="sm" @click="cancelNodeEdit">
            Cancel
          </VButton>
          <VButton variant="primary" size="sm" @click="confirmNodeEdit">
            Apply Changes
          </VButton>
        </VCluster>
      </VStack>
    </VBox>
  </NodeToolbar>
</template>

<script setup lang="ts">
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