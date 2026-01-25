<template>
  <Box tag="section" background="white" class="flex flex-col h-full overflow-hidden">

    <Box padding="lg" border="bottom" class="flex-shrink-0">
      <Cluster justify="between" align="center">
        <Cluster gap="md" align="center">
          <Box
            padding="sm"
            rounded="xl"
            class="shadow-sm"
            :background="initialScopeElement.boundaryType === 'INCLUSION' ? 'emerald-50' as any : 'rose-50' as any"
            :class="initialScopeElement.boundaryType === 'INCLUSION' ? 'text-emerald-600' : 'text-rose-600'"
          >
            <Icon :name="initialScopeElement.boundaryType === 'INCLUSION' ? 'PlusCircle' : 'MinusCircle'" size="md" />
          </Box>
          <Stack gap="none">
            <Text tag="h2" size="xl" weight="bold" color="gray-900">
              Refine Scope: {{ initialScopeElement.label }}
            </Text>
            <Badge :variant="initialScopeElement.boundaryType === 'INCLUSION' ? 'emerald' : 'red'" size="xs">
              {{ initialScopeElement.boundaryType }} CRITERIA
            </Badge>
          </Stack>
        </Cluster>
      </Cluster>
    </Box>

    <Box tag="main" padding="lg" class="flex-1 overflow-y-auto stable-gutter">
      <Stack gap="xl">

        <FormField id="scope-value-input" label="Boundary Specification">
          <template #hint>
            <Badge v-if="isValueModified" variant="amber" size="xs" class="animate-pulse">
              Unsaved Changes
            </Badge>
          </template>

          <template #default="{ id }">
            <Stack gap="xs">
              <Textarea
                :id="id"
                v-model="draftValue"
                :rows="3"
                :placeholder="`Describe the specific parameters for ${initialScopeElement.label}...`"
                class="w-full text-md font-medium leading-relaxed p-4"
                :class="{ 'border-red-500 ring-red-100': !draftValue?.trim() }"
              />
              <Cluster v-if="!draftValue?.trim()" gap="xs" align="center" class="text-red-500">
                <Icon name="ExclamationCircle" size="xs" />
                <Text size="xs">Specification cannot be empty.</Text>
              </Cluster>
            </Stack>
          </template>
        </FormField>

        <Box
          padding="md"
          rounded="xl"
          border="all"
          :class="[statusUI.bgClass, 'transition-all']"
        >
          <Cluster gap="md" align="center">
            <Box padding="sm" background="white" rounded="md" border="all" :class="statusUI.iconColor" class="shadow-sm">
              <Icon :name="statusUI.icon" size="sm" />
            </Box>
            <Stack gap="none">
              <Text size="xs" weight="bold" color="gray-400" class="uppercase tracking-widest">
                Entity Status
              </Text>
              <Text size="sm" weight="bold" :class="statusUI.textColor">
                {{ initialScopeElement.entityStatus }}
              </Text>
            </Stack>
          </Cluster>
        </Box>

        <Box padding="lg" background="amber-50" rounded="xl" border="all" class="border-amber-100">
          <Stack gap="md">
            <Cluster gap="xs" align="center">
              <Icon name="LightBulb" size="sm" class="text-amber-500" />
              <Text tag="h3" size="sm" weight="bold" color="amber-900">
                Strategic Impact
              </Text>
            </Cluster>

            <Stack gap="sm">
              <Box padding="xs" background="white" rounded="lg" border="all" class="border-amber-100 shadow-sm">
                <Cluster justify="between" align="center">
                  <Text size="xs" color="gray-500">Global Feasibility</Text>
                  <Badge :variant="feasibilityStatus === 'HIGH' ? 'emerald' : 'amber'" size="xs">
                    {{ feasibilityStatus }}
                  </Badge>
                </Cluster>
              </Box>

              <Text size="xs" color="amber-800" class="leading-relaxed">
                Precisely defining <strong class="text-amber-900">{{ initialScopeElement.label }}</strong> will directly influence the volume and quality of resources the system can retrieve.
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>

    <Box padding="md" background="gray-50" border="top" class="flex-shrink-0">
      <Cluster justify="end" gap="md">
        <Button variant="tertiary" @click="handleCancelAndCheck">
          Cancel
        </Button>

        <template v-if="!isLOCKED">
          <Button
            variant="secondary"
            icon-name="ArchiveBox"
            :disabled="!draftValue?.trim()"
            @click="handleUnifiedSubmit('ON_HOLD')"
          >
            Put On Hold
          </Button>

          <Button
            variant="primary"
            icon-name="LockClosed"
            :disabled="!draftValue?.trim()"
            @click="handleUnifiedSubmit('LOCKED')"
          >
            Lock Scope
          </Button>
        </template>

        <template v-else>
          <Button
            variant="secondary"
            icon-name="ArchiveBox"
            @click="handleUnifiedSubmit('ON_HOLD')"
          >
            Unlock & Hold
          </Button>

          <Button
            variant="primary"
            icon-name="DocumentCheck"
            :disabled="!isValueModified"
            @click="handleUnifiedSubmit('LOCKED')"
          >
            Save Changes
          </Button>
        </template>
      </Cluster>
    </Box>
  </Box>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useInitiativeStore } from '@/stores/initiation';
import type { EntityStatus, FeasibilityStatus } from '@/interfaces/core';
import type { ProcessedScope } from '@/interfaces/initiation';

// Atoms & Molecules
import Box from '@/components/atoms/layout/Box.vue';
import Stack from '@/components/atoms/layout/Stack.vue';
import Cluster from '@/components/atoms/layout/Cluster.vue';
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Textarea from '@/components/atoms/forms/Textarea.vue';
import Badge from '@/components/atoms/data-display/Badge.vue';
import FormField from '@/components/molecules/actions/FormField.vue';

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