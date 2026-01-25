<template>
  <VBox tag="section" background="white" class="flex flex-col h-full overflow-hidden">

    <VBox padding="lg" border="bottom" class="flex-shrink-0">
      <VCluster justify="between" align="center">
        <VCluster gap="md" align="center">
          <VBox
            padding="sm"
            rounded="xl"
            class="shadow-sm"
            :background="initialScopeElement.boundaryType === 'INCLUSION' ? 'emerald-50' as any : 'rose-50' as any"
            :class="initialScopeElement.boundaryType === 'INCLUSION' ? 'text-emerald-600' : 'text-rose-600'"
          >
            <VIcon :name="initialScopeElement.boundaryType === 'INCLUSION' ? 'PlusCircle' : 'MinusCircle'" size="md" />
          </VBox>
          <VStack gap="none">
            <VTypography tag="h2" size="xl" weight="bold" color="gray-900">
              Refine Scope: {{ initialScopeElement.label }}
            </VTypography>
            <VBadge :variant="initialScopeElement.boundaryType === 'INCLUSION' ? 'emerald' : 'red'" size="xs">
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
                :placeholder="`Describe the specific parameters for ${initialScopeElement.label}...`"
                class="w-full text-md font-medium leading-relaxed p-4"
                :class="{ 'border-red-500 ring-red-100': !draftValue?.trim() }"
              />
              <VCluster v-if="!draftValue?.trim()" gap="xs" align="center" class="text-red-500">
                <VIcon name="ExclamationCircle" size="xs" />
                <VTypography size="xs">Specification cannot be empty.</VTypography>
              </VCluster>
            </VStack>
          </template>
        </VFormField>

        <VBox
          padding="md"
          rounded="xl"
          border="all"
          :class="[statusUI.bgClass, 'transition-all']"
        >
          <VCluster gap="md" align="center">
            <VBox padding="sm" background="white" rounded="md" border="all" :class="statusUI.iconColor" class="shadow-sm">
              <VIcon :name="statusUI.icon" size="sm" />
            </VBox>
            <VStack gap="none">
              <VTypography size="xs" weight="bold" color="gray-400" class="uppercase tracking-widest">
                Entity Status
              </VTypography>
              <VTypography size="sm" weight="bold" :class="statusUI.textColor">
                {{ initialScopeElement.entityStatus }}
              </VTypography>
            </VStack>
          </VCluster>
        </VBox>

        <VBox padding="lg" background="amber-50" rounded="xl" border="all" class="border-amber-100">
          <VStack gap="md">
            <VCluster gap="xs" align="center">
              <VIcon name="LightBulb" size="sm" class="text-amber-500" />
              <VTypography tag="h3" size="sm" weight="bold" color="amber-900">
                Strategic Impact
              </VTypography>
            </VCluster>

            <VStack gap="sm">
              <VBox padding="xs" background="white" rounded="lg" border="all" class="border-amber-100 shadow-sm">
                <VCluster justify="between" align="center">
                  <VTypography size="xs" color="gray-500">Global Feasibility</VTypography>
                  <VBadge :variant="feasibilityStatus === 'HIGH' ? 'emerald' : 'amber'" size="xs">
                    {{ feasibilityStatus }}
                  </VBadge>
                </VCluster>
              </VBox>

              <VTypography size="xs" color="amber-800" class="leading-relaxed">
                Precisely defining <strong class="text-amber-900">{{ initialScopeElement.label }}</strong> will directly influence the volume and quality of resources the system can retrieve.
              </VTypography>
            </VStack>
          </VStack>
        </VBox>
      </VStack>
    </VBox>

    <VBox padding="md" background="gray-50" border="top" class="flex-shrink-0">
      <VCluster justify="end" gap="md">
        <VButton variant="tertiary" @click="handleCancelAndCheck">
          Cancel
        </VButton>

        <template v-if="!isLOCKED">
          <VButton
            variant="secondary"
            icon-name="ArchiveBox"
            :disabled="!draftValue?.trim()"
            @click="handleUnifiedSubmit('ON_HOLD')"
          >
            Put On Hold
          </VButton>

          <VButton
            variant="primary"
            icon-name="LockClosed"
            :disabled="!draftValue?.trim()"
            @click="handleUnifiedSubmit('LOCKED')"
          >
            Lock Scope
          </VButton>
        </template>

        <template v-else>
          <VButton
            variant="secondary"
            icon-name="ArchiveBox"
            @click="handleUnifiedSubmit('ON_HOLD')"
          >
            Unlock & Hold
          </VButton>

          <VButton
            variant="primary"
            icon-name="DocumentCheck"
            :disabled="!isValueModified"
            @click="handleUnifiedSubmit('LOCKED')"
          >
            Save Changes
          </VButton>
        </template>
      </VCluster>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useInitiativeStore } from '@/stores/initiation';
import type { EntityStatus, FeasibilityStatus } from '@/interfaces/core';
import type { ProcessedScope } from '@/interfaces/initiation';

// Atoms & Molecules
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';

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

watch(() => props.initialScopeElement.rationale, (newVal) => {
  draftValue.value = newVal;
});

const isLOCKED = computed(() => props.initialScopeElement.entityStatus === 'LOCKED');
const isValueModified = computed(() => draftValue.value?.trim() !== props.initialScopeElement.rationale);

const statusUI = computed(() => {
  const status = props.initialScopeElement.entityStatus;
  const config = {
    LOCKED: { bgClass: 'bg-indigo-50 border-indigo-100', textColor: 'text-indigo-700', iconColor: 'text-indigo-600', icon: 'LockClosed' as const },
    AI_EXTRACTED: { bgClass: 'bg-amber-50 border-amber-100', textColor: 'text-amber-700', iconColor: 'text-amber-600', icon: 'Sparkles' as const },
    ON_HOLD: { bgClass: 'bg-gray-50 border-gray-200', textColor: 'text-gray-500', iconColor: 'text-gray-400', icon: 'ArchiveBox' as const },
    USER_DRAFT: { bgClass: 'bg-white border-gray-200', textColor: 'text-gray-800', iconColor: 'text-gray-600', icon: 'PencilSquare' as const }
  };
  return config[status as keyof typeof config] || config.USER_DRAFT;
});

async function handleUnifiedSubmit(targetStatus: EntityStatus) {
  const value = draftValue.value?.trim();
  if (!value) return;

  const id = props.initialScopeElement.id;
  const label = props.initialScopeElement.label;

  if (id) {
    await apiService.knowledge.scopes.update(id, label, value, targetStatus);
  } else {
    await apiService.workflows.scopes.create(label, value, targetStatus);
  }

  initiativeStore.createOrUpdateTopicScopes(id, label, value, targetStatus);
  emit('close-modal');
}

function handleCancelAndCheck() {
  if (isValueModified.value && !window.confirm('Discard unsaved scope changes?')) return;
  emit('close-modal');
}
</script>