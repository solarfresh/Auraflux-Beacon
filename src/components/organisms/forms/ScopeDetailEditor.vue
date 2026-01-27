<template>
  <VBox tag="section" background="white" class="flex flex-col h-full overflow-hidden">

    <VBox padding="lg" border="bottom" class="flex-shrink-0">
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
              Refine Scope: {{ initialScopeElement.label }}
            </VTypography>
            <VBadge :variant="boundaryConfig.badgeColor" size="xs">
              {{ initialScopeElement.boundaryType }} CRITERIA
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
                :placeholder="`Describe parameters for ${initialScopeElement.label}...`"
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
          <VEntityWorkflowStatus :status="initialScopeElement.entityStatus" />

          <VFeasibilityStatus
            :status="feasibilityStatus"
            :title="`Strategic Impact: ${initialScopeElement.label}`"
          >
            Precisely defining this scope will directly influence the volume and quality of resources the system retrieves.
          </VFeasibilityStatus>
        </VStack>

      </VStack>
    </VBox>

    <VBox padding="md" background="slate-50" border="top" class="flex-shrink-0">
      <VCluster justify="end" gap="md">
        <VButton variant="tertiary" @click="handleCancel">
          Cancel
        </VButton>

        <template v-if="!isLocked">
          <VButton
            variant="secondary"
            icon-name="ArchiveBox"
            :disabled="!isValid"
            @click="handleSubmit('ON_HOLD')"
          >
            Put On Hold
          </VButton>

          <VButton
            variant="primary"
            icon-name="LockClosed"
            :disabled="!isValid"
            @click="handleSubmit('LOCKED')"
          >
            Lock Scope
          </VButton>
        </template>

        <template v-else>
          <VButton
            variant="secondary"
            icon-name="ArchiveBox"
            @click="handleSubmit('ON_HOLD')"
          >
            Unlock & Hold
          </VButton>

          <VButton
            variant="primary"
            icon-name="DocumentCheck"
            :disabled="!isValueModified"
            @click="handleSubmit('LOCKED')"
          >
            Save Changes
          </VButton>
        </template>
      </VCluster>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
/**
 * ScopeDetailEditor
 * Refactored to use standardized Indicator molecules and color-based VBadge.
 */
import { computed, ref, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useInitiativeStore } from '@/stores/initiation';
import type { EntityStatus, FeasibilityStatus } from '@/interfaces/core';
import type { ProcessedScope } from '@/interfaces/initiation';

// Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';

// Molecules
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VEntityWorkflowStatus from '@/components/molecules/indicators/VEntityWorkflowStatus.vue';
import VFeasibilityStatus from '@/components/molecules/indicators/VFeasibilityStatus.vue';

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

watch(() => props.initialScopeElement.rationale, (val) => (draftValue.value = val));

// Logic Helpers
const isValid = computed(() => !!draftValue.value?.trim());
const isLocked = computed(() => props.initialScopeElement.entityStatus === 'LOCKED');
const isValueModified = computed(() => draftValue.value?.trim() !== props.initialScopeElement.rationale);

/**
 * Boundary UI Configuration
 * Maps INCLUSION/EXCLUSION to visual tokens.
 */
const boundaryConfig = computed(() => {
  const isInclusion = props.initialScopeElement.boundaryType === 'INCLUSION';
  return {
    icon: isInclusion ? 'PlusCircle' : 'MinusCircle' as const,
    bg: (isInclusion ? 'emerald-50' : 'rose-50') as any,
    text: isInclusion ? 'text-emerald-600' : 'text-rose-600',
    badgeColor: (isInclusion ? 'emerald' : 'red') as any
  };
});

async function handleSubmit(targetStatus: EntityStatus) {
  const value = draftValue.value?.trim();
  if (!value) return;

  const { id, label } = props.initialScopeElement;

  if (id) {
    await apiService.knowledge.scopes.update(id, label, value, targetStatus);
  } else {
    await apiService.workflows.scopes.create(label, value, targetStatus);
  }

  initiativeStore.createOrUpdateTopicScopes(id, label, value, targetStatus);
  emit('close-modal');
}

function handleCancel() {
  if (isValueModified.value && !window.confirm('Discard unsaved scope changes?')) return;
  emit('close-modal');
}
</script>