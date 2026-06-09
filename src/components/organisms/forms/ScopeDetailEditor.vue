<template>
  <VBox tag="section" background="white" class="flex flex-col h-full overflow-hidden">
    <VBox padding="lg" border="bottom" class="shrink-0">
      <VCluster justify="between" align="center">
        <VCluster gap="md" align="center">
          <VBox
            padding="sm"
            rounded="xl"
            class="shadow-sm"
            :background="boundaryConfig.bg"
            :class="boundaryConfig.text"
          >
            <VIcon :name="boundaryConfig.icon" size="md" />
          </VBox>
          <VStack gap="none">
            <VTypography tag="h2" size="xl" weight="bold" color="slate-900">
              Refine Scope: {{ props.initialScopeElement.label }}
            </VTypography>
            <VBadge :variant="boundaryConfig.badgeColor" size="xs">
              {{ props.initialScopeElement.boundaryType }} CRITERIA
            </VBadge>
          </VStack>
        </VCluster>
      </VCluster>
    </VBox>

    <VBox tag="main" padding="lg" class="flex-1 overflow-y-auto stable-gutter">
      <VStack gap="xl">
        <VFormField id="scope-value-input" label="Boundary Specification">
          <template #hint>
            <VBadge v-if="isValueModified" variant="amber" size="xs" class="animate-pulse">
              Unsaved Changes
            </VBadge>
          </template>

          <template #default="{ id }">
            <VStack gap="xs">
              <VTextarea
                :id="id"
                v-model="draftValue"
                :rows="3"
                :placeholder="`Describe parameters for ${props.initialScopeElement.label}...`"
                class="w-full text-md font-medium leading-relaxed p-4"
                :class="{ 'border-red-500 ring-red-100': !isValid }"
              />

              <VCluster v-if="!isValid" gap="xs" align="center" class="text-red-500">
                <VIcon name="ExclamationCircle" size="xs" />
                <VTypography size="xs">Specification cannot be empty.</VTypography>
              </VCluster>
            </VStack>
          </template>
        </VFormField>

        <VStack gap="sm">
          <VEntityProjectStatus :status="props.initialScopeElement.entityStatus" />

          <VFeasibilityStatus
            :status="props.feasibilityStatus"
            :title="`Strategic Impact: ${props.initialScopeElement.label}`"
          >
            Precisely defining this scope will directly influence the volume and quality of resources the system retrieves.
          </VFeasibilityStatus>
        </VStack>
      </VStack>
    </VBox>

    <VBox padding="md" background="slate-50" border="top" class="shrink-0">
      <VEntityStatusActionGroup
        :is-locked="isLocked"
        :is-modified="isValueModified"
        :disabled="!isValid"
        :labels="{
          unlockedPrimary: 'Lock Scope'
        }"
        @cancel="handleCancel"
        @submit="handleSubmit"
      />
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useInitiativeStore } from '@/stores/initiation';
import type { EntityStatus, FeasibilityStatus } from '@/interfaces/core';
import type { ProcessedScope } from '@/interfaces/initiation';

// Atoms Layer Layout & UI Component Imports
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';

// Molecules Layer Component Imports
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VEntityProjectStatus from '@/components/molecules/domain/VEntityProjectStatus.vue';
import VFeasibilityStatus from '@/components/molecules/domain/VFeasibilityStatus.vue';

// Shared State Machine Action Component
import VEntityStatusActionGroup from '@/components/molecules/domain/VEntityStatusActionGroup.vue';

/**
 * ScopeDetailEditor Molecule
 * Provides a granular specification configuration sheet to align macro project inclusion/exclusion bounds.
 * Implements centralized action dispatch patterns to minimize state drift debt.
 */
const props = defineProps<{
  scopeIndex: number;
  initialScopeElement: ProcessedScope;
  feasibilityStatus: FeasibilityStatus;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const initiativeStore = useInitiativeStore();
const draftValue = ref(props.initialScopeElement.rationale);

/**
 * Reactively syncs local state whenever the parent architecture triggers an updated rationale data flow.
 */
watch(() => props.initialScopeElement.rationale, (val) => {
  draftValue.value = val;
});

// --- Computed Analytical State Layers ---

/**
 * Ensures validation constraints are met before committing down to transaction branches.
 */
const isValid = computed(() => !!draftValue.value?.trim());

/**
 * Resolves whether the targeted project scope segment is marked as confirmed and frozen.
 */
const isLocked = computed(() => props.initialScopeElement.entityStatus === 'LOCKED');

/**
 * Validates dirty state status to enable/disable specific locked submit combinations.
 */
const isValueModified = computed(() => draftValue.value?.trim() !== props.initialScopeElement.rationale);

/**
 * Boundary UI Configuration
 * Dynamically resolves structural classes and tokens depending on INCLUSION / EXCLUSION configurations.
 */
const boundaryConfig = computed(() => {
  const isInclusion = props.initialScopeElement.boundaryType === 'INCLUSION';
  return {
    icon: (isInclusion ? 'PlusCircle' : 'MinusCircle') as any,
    bg: (isInclusion ? 'emerald-50' : 'rose-50') as any,
    text: isInclusion ? 'text-emerald-600' : 'text-rose-600',
    badgeColor: (isInclusion ? 'emerald' : 'red') as any
  };
});

// --- Action Delegations ---

/**
 * Persists updated boundaries downstream via parallel API mutations and store dispatches.
 * @param targetStatus Destination state assigned through footer selection interactions.
 */
async function handleSubmit(targetStatus: EntityStatus) {
  const value = draftValue.value?.trim();
  if (!value) return;

  const { id, label } = props.initialScopeElement;

  // Persist directly via service wrappers depending on record origin profiles
  if (id) {
    await apiService.knowledge.scopes.update(id, label, value, targetStatus);
  } else {
    await apiService.projects.scopes.create(label, value, targetStatus);
  }

  // Update unified in-memory application store states
  initiativeStore.createOrUpdateTopicScopes(id, label, value, targetStatus);
  emit('close-modal');
}

/**
 * Intercepts cancel paths when dirty attributes risk tracking breaks or missing edits.
 */
function handleCancel() {
  if (isValueModified.value && !window.confirm('Discard unsaved scope changes?')) {
    return;
  }
  emit('close-modal');
}
</script>