<template>
  <EdgeLabelRenderer>
    <VBox
      v-if="context.isInterceptionActive.value"
      tag="div"
      background="white"
      padding="md"
      rounded="lg"
      border="all"
      class="w-72 shadow-xl animate-in fade-in zoom-in duration-200 nodrag nopan"
      :style="{
        position: 'absolute',
        left: `${context.interceptorPosition.x}px`,
        top: `${context.interceptorPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'all',
        zIndex: 1000,
      }"
    >
      <VStack gap="md">
        <VCluster justify="between" align="center">
          <VTypography size="xs" weight="bold" class="text-slate-500 uppercase tracking-wider">
            Define Relationship
          </VTypography>
          <VButton
            variant="ghost"
            size="xs"
            icon-only
            icon-name="XMark"
            @click="close"
          />
        </VCluster>

        <VStack border="bottom" class="h-0 w-full" />

        <VFormField id="edge-type" label="Relationship Type">
          <VSelect
            v-model="context.localEdgeData.value.type"
            size="sm"
          >
            <option
              v-for="edgeType in edgeTypeOptions"
              :key="edgeType.label"
              :value="edgeType.value"
            >
              {{ edgeType.label }}
            </option>
          </VSelect>
        </VFormField>

        <VFormField id="edge-label" label="Logical Label (Optional)">
          <VInput
            v-model="context.localEdgeData.value.label"
            placeholder="e.g., influences, triggers..."
            size="sm"
          />
        </VFormField>

        <VFormField id="edge-evidence" label="Evidence / Rationale">
          <VTextarea
            v-model="context.localEdgeData.value.evidence"
            placeholder="Cite evidence or reasoning..."
            :rows="2"
            size="sm"
          />
        </VFormField>

        <VCluster justify="end" gap="sm" class="pt-2">

          <VButton
            v-if="context.interceptorAction.value === 'update'"
            variant="danger"
            size="sm"
            @click="handleDelete"
          >
            Delete
          </VButton>
<!--
          <VButton variant="ghost" size="sm" @click="close">
            Cancel
          </VButton>
 -->
          <VButton variant="primary" size="sm" @click="confirmRelation">
            {{ context.interceptorAction.value == 'create' ? 'Create' : 'Update' }} Link
          </VButton>


        </VCluster>
      </VStack>
    </VBox>
  </EdgeLabelRenderer>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { EdgeLabelRenderer } from '@vue-flow/core';
import { useEdgeInterceptor } from '@/composables/useEdgeInterceptor';
import { ConceptualMapContextKey } from '@/constants/injection-keys';

// Atoms & Molecules (Assuming standard naming from your stack)
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VSelect from '@/components/atoms/forms/VSelect.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';

const context = inject(ConceptualMapContextKey);

if (!context) {
  throw new Error(
    '[Architectural Violation] VEdgeFloatingEditor must be rendered within the tree of a <ConceptualMapCanvas>.'
  );
}

/**
 * VEdgeFloatingEditor Molecule
 * Provides a UI overlay to define semantic metadata when a new connection is initiated.
 * Integrated with useEdgeInterceptor for state management.
 */
const {
  confirmRelation,
} = useEdgeInterceptor();

/**
 * Options mapped to EdgeType for the select dropdown.
 * Aligned with Empirical Science standards in conceptual-map.ts.
 */
const edgeTypeOptions = [
  { label: 'Reference (Association)', value: 'REF' },
  { label: 'Validates (Support)', value: 'VALIDATES' },
  { label: 'Constrains (Restriction)', value: 'CONSTRAINS' },
  { label: 'Triggers (Causal)', value: 'TRIGGERS' },
  { label: 'Structural Link', value: 'LINK' },
];

function close() {
  context!.closeInterceptor();
};

function handleDelete() {
  if (confirm('Delete this relationship?')) {
    context!.updateConceptualMapEdge(context!.localEdgeData.value, 'delete');
    context!.closeInterceptor();
  };
};

</script>

<style scoped>
/* Ensure the editor doesn't get clipped by the canvas container */
.v-edge-floating-editor {
  user-select: none;
}

/* Simple animation for appearance */
.animate-in {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
</style>