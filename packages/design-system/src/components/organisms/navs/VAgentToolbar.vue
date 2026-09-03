<template>
  <VToolbar
    intent="neutral"
    surface="base"
    border="none"
    padding="none"
    sticky
  >
    <!-- Start Region: Target Selection Dropdown & Status -->
    <template #start>
      <VBox class="relative">
        <VButton
          intent="neutral"
          surface="outline"
          size="sm"
          class="flex items-center gap-2"
          @click="isDropdownOpen = !isDropdownOpen"
        >
          <VCluster gap="md" align="center" justify="between">
            <VIcon :name="activeTargetIcon" size="sm" />
            <VTypography tag="span" weight="semibold" size="sm">
              {{ currentTargetName }}
            </VTypography>
            <VBox
              v-if="isDirty"
              rounded="full"
              intent="danger"
              surface="solid"
              tag="span"
              class="w-2 h-2"
              title="Unsaved changes"
            />
            <VIcon name="ChevronDown" size="xs" />
          </VCluster>
        </VButton>

        <!-- Dropdown Menu -->
        <VDropdownMenu
          v-if="isDropdownOpen"
          intent="neutral"
          border="all"
          surface="solid"
          class="absolute top-full left-0 mt-1 w-96 shadow-xl z-50"
        >
          <VStack gap="xs" padding="xs">
            <!-- Agents List -->
            <template v-if="agents.length > 0">
              <VTypography tag="span" size="xs" class="text-slate-400 font-bold px-2 py-1">
                AGENTS
              </VTypography>
              <VDropdownItem
                v-for="agent in agents"
                :key="String(agent.id)"
                @click="selectTarget(agent)"
              >
                <VStack gap="xs" class="w-full">
                  <VBox class="flex items-center justify-between w-full">
                    <VTypography tag="span" weight="medium" size="sm">
                      {{ agent.name }}
                    </VTypography>
                    <VChip
                      size="xs"
                      padding="xs"
                      rounded="sm"
                      :intent="getStatusIntent(agent.status)"
                    >
                      {{ agent.status }}
                    </VChip>
                  </VBox>
                  <VTypography
                    v-if="agent.purpose"
                    tag="p"
                    size="xs"
                    class="line-clamp-2 text-slate-500"
                  >
                    {{ agent.purpose }}
                  </VTypography>
                </VStack>
              </VDropdownItem>
            </template>

            <!-- Embeddings List -->
            <template v-if="embeddings.length > 0">
              <VTypography tag="span" size="xs" class="text-slate-400 font-bold px-2 py-1 mt-1">
                EMBEDDINGS
              </VTypography>
              <VDropdownItem
                v-for="embedding in embeddings"
                :key="String(embedding.id)"
                @click="selectTarget(embedding)"
              >
                <VStack gap="xs" class="w-full">
                  <VBox class="flex items-center justify-between w-full">
                    <VTypography tag="span" weight="medium" size="sm">
                      {{ embedding.name }}
                    </VTypography>
                    <VChip
                      size="xs"
                      padding="xs"
                      rounded="sm"
                      :intent="getStatusIntent(embedding.status)"
                    >
                      {{ embedding.status }}
                    </VChip>
                  </VBox>
                </VStack>
              </VDropdownItem>
            </template>
          </VStack>
        </VDropdownMenu>
      </VBox>

      <!-- Current Entity Status Selector (Agent or Embedding) -->
      <VSelect
        v-if="currentTargetStatus"
        :model-value="currentTargetStatus"
        :disabled="disabled"
        rounded="md"
        size="sm"
        class="text-xs font-semibold"
        @update:model-value="(val: string) => handleStatusChange(val)"
      >
        <option value="DRAFT">Not Configured</option>
        <option value="REVIEW">Under Review</option>
        <option value="ACTIVE">Ready / Operational</option>
        <option value="INACTIVE">Disabled</option>
      </VSelect>
    </template>

    <!-- Center Region: Model Provider & Model Selection -->
    <template #center>
      <VBox class="flex items-center gap-2">
        <!-- Provider Selector -->
        <VSelect
          :model-value="activeProviderId"
          :disabled="disabled"
          size="sm"
          class="text-xs border-gray-300 rounded-md"
          @update:model-value="(val: string) => handleProviderChange(val)"
        >
          <option
            v-for="provider in providerOptions"
            :key="String(provider.value)"
            :value="provider.value"
          >
            {{ provider.label }}
          </option>
        </VSelect>

        <!-- Model Selector -->
        <VSelect
          :model-value="activeModelFamilyId"
          :disabled="disabled"
          size="sm"
          class="text-xs border-gray-300 rounded-md"
          @update:model-value="(val: string) => handleModelChange(val)"
        >
          <option
            v-for="model in modelOptions"
            :key="String(model.value)"
            :value="model.value"
          >
            {{ model.label }}
          </option>
        </VSelect>
      </VBox>
    </template>

    <!-- End Region: Action Buttons -->
    <template #end>
      <VButton
        v-if="disabled"
        intent="brand"
        surface="solid"
        rounded="md"
        size="sm"
        class="flex items-center gap-1.5"
        @click="$emit('edit')"
      >
        <VIcon name="Pencil" size="sm" />
        <VTypography tag="span" size="sm" weight="medium">
          Edit
        </VTypography>
      </VButton>

      <VButton
        v-else
        intent="brand"
        surface="solid"
        rounded="md"
        size="sm"
        class="flex items-center gap-1.5"
        @click="$emit('save')"
      >
        <VIcon name="Save" size="sm" />
        <VTypography tag="span" size="sm" weight="medium">
          Save Settings
        </VTypography>
      </VButton>
    </template>
  </VToolbar>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VDropdownItem from '@auraflux/design-system/components/atoms/buttons/VDropdownItem.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VChip from '@auraflux/design-system/components/molecules/indicators/VChip.vue';
import VDropdownMenu from '@auraflux/design-system/components/molecules/layout/VDropdownMenu.vue';
import VToolbar from '@auraflux/design-system/components/organisms/layout/VToolbar.vue';
import { computed, ref } from 'vue';

import type { Agent, Embedding, ModelOption, ProviderOption } from '@auraflux/design-system/interfaces/agents';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';

export interface VAgentToolbarProps {
  disabled?: boolean;
  agents?: Agent[];
  embeddings?: Embedding[];
  selectedAgent?: Partial<Agent> | null;
  selectedEmbedding?: Partial<Embedding> | null;
  isDirty?: boolean;
  providers?: ProviderOption[];
  models?: ModelOption[];
}

const props = withDefaults(
  defineProps<VAgentToolbarProps>(),
  {
    disabled: false,
    agents: () => [],
    embeddings: () => [],
    selectedAgent: null,
    selectedEmbedding: null,
    isDirty: false,
    providers: () => [
      { label: 'Select Provider...', value: '' },
    ],
    models: () => [
      { label: 'Select Model...', value: '', providerId: '', name: '' },
    ],
  }
);

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'edit'): void;
  (e: 'select-agent', target: Agent | Embedding): void;
  (e: 'status-change', status: EntityStatus): void;
  (e: 'update:selected-provider', providerId: ID): void;
  (e: 'update:selected-model', modelFamilyId: ID): void;
}>();

const isDropdownOpen = ref(false);

const currentTargetName = computed(() => {
  return props.selectedEmbedding?.name || props.selectedAgent?.name || 'Select Target';
});

const currentTargetStatus = computed(() => {
  return props.selectedEmbedding?.status || props.selectedAgent?.status;
});

const activeTargetIcon = computed(() => {
  return props.selectedEmbedding ? 'Database' : 'Bot';
});

const activeProviderId = computed(() => {
  const rawProviderId = props.selectedEmbedding?.providerId || props.selectedAgent?.providerId;

  if (!rawProviderId) {
    return '';
  }

  const existsInOptions = props.providers.some(
    (p) => String(p.value) === String(rawProviderId)
  );

  return existsInOptions ? rawProviderId : '';
});

const activeModelFamilyId = computed(() => {
  const rawModelFamilyId =
    props.selectedEmbedding?.modelFamilyId || props.selectedAgent?.modelFamilyId;

  if (!rawModelFamilyId) {
    return '';
  }

  const existsInAvailable = availableModels.value.some(
    (m) => String(m.value) === String(rawModelFamilyId)
  );

  return existsInAvailable ? rawModelFamilyId : '';
});

const availableModels = computed(() => {
  if (!activeProviderId.value) return [];
  return props.models.filter(
    (m) => String(m.providerId) === String(activeProviderId.value)
  );
});

const providerOptions = computed(() => {
  const hasPlaceholder = props.providers.some((p) => p.value === '');
  if (!activeProviderId.value && !hasPlaceholder) {
    return [
      { label: 'Select Provider...', value: '' },
      ...props.providers,
    ];
  }
  return props.providers;
});

const modelOptions = computed(() => {
  const hasPlaceholder = availableModels.value.some((m) => m.value === '');
  if (!activeModelFamilyId.value && !hasPlaceholder) {
    return [
      { label: 'Select Model...', value: '', providerId: '', name: '' },
      ...availableModels.value,
    ];
  }
  return availableModels.value;
});

const getStatusIntent = (status?: EntityStatus) => {
  switch (status) {
    case 'DRAFT': return 'neutral';
    case 'REVIEW': case 'PENDING': return 'warning';
    case 'ACTIVE': case 'APPROVED': case 'PUBLISHED': return 'success';
    default: return 'neutral';
  }
};

const selectTarget = (target: Agent | Embedding) => {
  isDropdownOpen.value = false;
  emit('select-agent', target);
  emit('update:selected-provider', target.providerId);
  emit('update:selected-model', target.modelFamilyId);
};

const handleProviderChange = (val: string) => {
  emit('update:selected-provider', val as ID);
  const firstModel = props.models.find((m) => m.providerId === val);
  if (firstModel) {
    emit('update:selected-model', firstModel.value as ID);
  }
};

const handleModelChange = (val: string) => {
  emit('update:selected-model', val as ID);
};

const handleStatusChange = (val: string) => {
  emit('status-change', val as EntityStatus);
};
</script>