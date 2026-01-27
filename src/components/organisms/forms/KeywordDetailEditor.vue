<template>
  <VBox tag="section" background="white" class="flex flex-col h-full overflow-hidden">

    <VBox padding="lg" border="bottom" class="flex-shrink-0">
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
          <VEntityWorkflowStatus :status="initialKeyword.entityStatus">
            <template v-if="isTextModified" #default>
              <VTypography size="xs" color="amber-600" italic class="mt-1">
                Note: Saving will update content and persist the choice below.
              </VTypography>
            </template>
          </VEntityWorkflowStatus>
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
            Lock Keyword
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
            :disabled="!isTextModified"
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
 * KeywordDetailEditor
 * Integrated refactor using specialized status molecules.
 */
import { computed, ref, watch } from 'vue';
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedKeyword } from '@/interfaces/initiation';
import { useInitiativeStore } from '@/stores/initiation';

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
  keywordIndex: number;
  initialKeyword: ProcessedKeyword;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const initiativeStore = useInitiativeStore();
const draftText = ref(props.initialKeyword.label);

// Sync draft with external props
watch(() => props.initialKeyword.label, (val) => (draftText.value = val));

// Computed Logic
const isValid = computed(() => !!draftText.value.trim());
const isLocked = computed(() => props.initialKeyword.entityStatus === 'LOCKED');
const isTextModified = computed(() => draftText.value.trim() !== props.initialKeyword.label);

/**
 * Persist changes to store
 */
async function handleSubmit(targetStatus: EntityStatus) {
  if (!isValid.value) return;
  await initiativeStore.createOrUpdateTopicKeywords(
    props.initialKeyword.id,
    draftText.value.trim(),
    targetStatus
  );
  emit('close-modal');
}

/**
 * Safety check for dirty state
 */
function handleCancel() {
  if (isTextModified.value && !window.confirm('Discard unsaved changes?')) return;
  emit('close-modal');
}
</script>