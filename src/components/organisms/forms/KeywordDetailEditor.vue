<template>
  <VBox tag="section" background="white" class="flex flex-col h-full overflow-hidden">
    <VBox padding="lg" border="bottom" class="shrink-0">
      <VCluster gap="md" align="center">
        <VBox padding="sm" background="indigo-50" rounded="xl" class="text-indigo-600 shadow-sm">
          <VIcon name="PencilSquare" size="md" />
        </VBox>
        <VStack gap="none">
          <VTypography tag="h2" size="xl" weight="bold" color="slate-900">
            Refine Keyword
          </VTypography>
          <VTypography size="xs" color="slate-500">
            Precisely define this core concept to guide AI exploration.
          </VTypography>
        </VStack>
      </VCluster>
    </VBox>

    <VBox tag="main" padding="lg" class="flex-1 overflow-y-auto stable-gutter">
      <VStack gap="xl">
        <VFormField id="keyword-input" label="Keyword Text">
          <template #hint>
            <VBadge v-if="isTextModified" variant="amber" size="xs" class="animate-pulse">
              Unsaved Changes
            </VBadge>
          </template>

          <template #default="{ id }">
            <VStack gap="xs">
              <VTextarea
                :id="id"
                v-model="draftText"
                :rows="2"
                placeholder="Enter a precise keyword..."
                class="w-full text-lg font-medium p-4"
                :class="{ 'border-red-500 ring-red-100': !isValid }"
              />

              <VCluster v-if="!isValid" gap="xs" align="center" class="text-red-500">
                <VIcon name="ExclamationCircle" size="xs" />
                <VTypography size="xs">Keyword text cannot be empty.</VTypography>
              </VCluster>
            </VStack>
          </template>
        </VFormField>

        <VStack gap="sm">
          <VEntityProjectStatus :status="props.initialKeyword.entityStatus">
            <template v-if="isTextModified" #default>
              <VTypography size="xs" color="amber-600" italic class="mt-1">
                Note: Saving will update content and persist the choice below.
              </VTypography>
            </template>
          </VEntityProjectStatus>
        </VStack>
      </VStack>
    </VBox>

    <VBox padding="md" background="slate-50" border="top" class="shrink-0">
      <VEntityStatusActionGroup
        :is-locked="isLocked"
        :is-modified="isTextModified"
        :disabled="!isValid"
        :labels="{
          unlockedPrimary: 'Lock Keyword'
        }"
        @cancel="handleCancel"
        @submit="handleSubmit"
      />
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedKeyword } from '@/interfaces/consultation';
import { useConsultationStore } from '@/stores/consultation';

// Atoms Layer Layout & UI Component Imports
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';

// Molecules Layer Component Imports
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VEntityProjectStatus from '@/components/molecules/domain/VEntityProjectStatus.vue';

// Shared State Machine Action Component
import VEntityStatusActionGroup from '@/components/molecules/domain/VEntityStatusActionGroup.vue';

/**
 * KeywordDetailEditor Molecule
 * Provides a dedicated detail panel to refine specific keywords used for domain exploration.
 * Seamlessly abstracts lifecycle submission variants via unified action groups.
 */
const props = defineProps<{
  keywordIndex: number;
  initialKeyword: ProcessedKeyword;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const consultationStore = useConsultationStore();
const draftText = ref(props.initialKeyword.label);

/**
 * Reactively syncs local state whenever the parent scope updates the target keyword attributes.
 */
watch(() => props.initialKeyword.label, (val) => {
  draftText.value = val;
});

// --- Computed Analytical State Layers ---

/**
 * Validates whether the keyword form constraints are legally satisfied.
 */
const isValid = computed(() => !!draftText.value.trim());

/**
 * Resolves whether the specific keyword state machine is already finalized or hardened.
 */
const isLocked = computed(() => props.initialKeyword.entityStatus === 'LOCKED');

/**
 * Determines whether user modifications are pending synchronization with the cloud backend streams.
 */
const isTextModified = computed(() => draftText.value.trim() !== props.initialKeyword.label);

// --- Action Delegations ---

/**
 * Dispatches synchronization requests upstream to persistence layers and closes the active modal view.
 * @param targetStatus Destination lifecycle status assigned via action choices.
 */
async function handleSubmit(targetStatus: EntityStatus) {
  if (!isValid.value) return;
  await consultationStore.createOrUpdateTopicKeywords(
    props.initialKeyword.id,
    draftText.value.trim(),
    targetStatus
  );
  emit('close-modal');
}

/**
 * Safety interceptor protecting unsaved user data states prior to exiting edit view contexts.
 */
function handleCancel() {
  if (isTextModified.value && !window.confirm('Discard unsaved changes?')) {
    return;
  }
  emit('close-modal');
}
</script>