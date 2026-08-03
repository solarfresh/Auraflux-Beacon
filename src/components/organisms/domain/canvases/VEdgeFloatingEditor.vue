<template>
  <EdgeLabelRenderer>
    <VBox
      v-if="context.isInterceptionActive.value"
      tag="div"
      background="white"
      padding="md"
      rounded="lg"
      border="all"
      class="shadow-xl animate-in fade-in zoom-in duration-200 nodrag nopan v-edge-floating-editor"
      :style="editorStyle"
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
            class="w-full"
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

        <VEntityStatusActionGroup
          :is-new="isNew"
          :is-locked="isLocked"
          :is-modified="isEdgeModified"
          :disabled="false"
          :labels="{
            unlockedDraft: 'Save Draft',
            unlockedHold: 'Put On Hold',
            unlockedPrimary: 'Lock Link',
            unlockedPrimaryClass: 'bg-emerald-600! hover:bg-emerald-700!',
            lockedHold: 'Put On Hold',
            lockedPrimary: 'Save Changes'
          }"
          @cancel="close"
          @submit="handleStateSubmit"
        />

      </VStack>
    </VBox>
  </EdgeLabelRenderer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EdgeLabelRenderer, useVueFlow } from '@vue-flow/core'; // 🟢 Added useVueFlow
import { useEdgeInterceptor } from '@/composables/useEdgeInterceptor';

// Atoms & Molecules Layout Imports
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VSelect from '@/components/atoms/forms/VSelect.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';

// Shared State Machine Action Component
import VEntityStatusActionGroup from '@/components/molecules/domain/VEntityStatusActionGroup.vue';

const {
  context,
  cancelRelation,
  confirmRelation,
} = useEdgeInterceptor();

/**
 * 🟢 Access the active VueFlow context to read reactive zoom levels
 */
const { viewport } = useVueFlow();

const edgeTypeOptions = [
  { label: 'Reference (Association)', value: 'REF' },
  { label: 'Validates (Support)', value: 'VALIDATES' },
  { label: 'Constrains (Restriction)', value: 'CONSTRAINS' },
  { label: 'Triggers (Causal)', value: 'TRIGGERS' },
  { label: 'Structural Link', value: 'LINK' },
];

// --- 🟢 Dynamic Layout Compensation Logic ---

/**
 * Computes exact inline styles applying an inverse viewport transform matrix.
 * This guarantees the editor remains at 100% scale regardless of map coordinates.
 */
const editorStyle = computed(() => {
  const currentZoom = viewport.value.zoom || 1;
  const inverseScale = 1 / currentZoom;

  return {
    position: 'absolute' as const,
    left: `${context.interceptorPosition.x}px`,
    top: `${context.interceptorPosition.y}px`,
    /* Combines alignment mapping with reciprocal viewport scale correction.
      If zoom is 0.5, scale becomes 2.0 (canceling out canvas shrinkage).
    */
    transform: `translate(-50%, -50%) scale(${inverseScale})`,
    transformOrigin: 'center center',
    pointerEvents: 'all' as const,
    zIndex: 1000,
  };
});

const isNew = computed(() => {
  return context.interceptorAction === 'create';
});

// --- Computed State Layers ---
const currentEdge = computed(() => {
  const edgeId = context.intersectingEdgeId?.value;
  if (!edgeId) return null;
  return context.conceptualEdges.value.find((e: any) => e.id === edgeId);
});

const isLocked = computed(() => currentEdge.value?.status === 'LOCKED');

const isEdgeModified = computed(() => {
  if (!currentEdge.value) return false;
  return (
    context.localEdgeData.value.type !== currentEdge.value.type ||
    (context.localEdgeData.value.label || '') !== (currentEdge.value.label || '') ||
    (context.localEdgeData.value.evidence || '') !== (currentEdge.value.evidence || '')
  );
});

// --- Action Delegations ---
function close() {
  cancelRelation();
}

async function handleStateSubmit(targetStatus: 'LOCKED' | 'ON_HOLD' | 'USER_DRAFT') {
  context.localEdgeData.value.status = targetStatus;
  await confirmRelation();
}
</script>

<style scoped>
.v-edge-floating-editor {
  user-select: none;
}

/* Micro-interaction layer animations.
  Note: Removed hardcoded transform definitions here to avoid fighting the inline script matrices.
*/
.animate-in {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>