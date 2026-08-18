<template>
  <VToolbar
    intent="neutral"
    surface="base"
    border="none"
    padding="none"
    sticky
  >
    <!-- Start Region: Agent Selection Dropdown & Status -->
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
            <VIcon name="Bot" size="sm" />
            <VTypography tag="span" weight="semibold" size="sm">
              {{ selectedAgent?.name || 'Select Agent' }}
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
          class="absolute top-full left-0 mt-1 w-96 shadow-xl"
        >
          <VStack gap="xs" padding="xs">
            <VDropdownItem
              v-for="agent in agents"
              :key="String(agent.id)"
              @click="selectAgent(agent)"
            >
              <VStack gap="xs" class="w-full">
                <VBox class="flex items-center justify-between w-full">
                  <VTypography tag="span" weight="medium" size="sm">
                    {{ agent.name }}
                  </VTypography>
                  <!-- Agent Status Chip -->
                  <VChip
                    size="xs"
                    padding="xs"
                    rounded="sm"
                    :intent="getStatusIntent(agent.status)"
                  >
                    {{ agent.status }}
                  </VChip>
                </VBox>
                <!-- Agent Purpose / Description -->
                <VTypography
                  v-if="agent.purpose"
                  tag="p"
                  size="xs"
                  class="line-clamp-2"
                >
                  {{ agent.purpose }}
                </VTypography>
              </VStack>
            </VDropdownItem>
          </VStack>
        </VDropdownMenu>
      </VBox>

      <!-- Current Agent Entity Status Selector -->
      <VSelect
        v-if="selectedAgent"
        :model-value="selectedAgent.status"
        :disabled="disabled"
        rounded="md"
        size="sm"
        class="text-xs font-semibold"
        @update:model-value="handleStatusChange"
      >
        <option value="DRAFT">Not Configured</option>
        <option value="REVIEW">Under Review</option>
        <option value="ACTIVE">Ready / Operational</option>
        <option value="INACTIVE">Disabled</option>
      </VSelect>
    </template>

    <!-- Center Region: Model Provider & Model Selection (Controlled via Props) -->
    <template #center>
      <VBox class="flex items-center gap-2">
        <!-- Provider Selector -->
        <VSelect
          :model-value="selectedAgent?.providerId"
          :disabled="disabled"
          size="sm"
          class="text-xs border-gray-300 rounded-md"
          @update:model-value="handleProviderChange"
        >
          <option
            v-for="provider in providers"
            :key="provider.value"
            :value="provider.value"
          >
            {{ provider.label }}
          </option>
        </VSelect>

        <!-- Model Selector -->
        <VSelect
          :model-value="selectedAgent?.modelFamilyId"
          size="sm"
          class="text-xs border-gray-300 rounded-md"
          @update:model-value="handleModelChange"
        >
          <option
            v-for="model in availableModels"
            :key="model.value"
            :value="model.value"
          >
            {{ model.label }}
          </option>
        </VSelect>
      </VBox>
    </template>

    <!-- End Region: Save Button -->
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
          Edit Agent
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

import type { Agent, ModelOption, ProviderOption } from '@auraflux/design-system/interfaces/agents';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';

export interface VAgentToolbarProps {
  disabled?: boolean;
  agents?: Agent[];
  selectedAgent?: Partial<Agent> | null;
  isDirty?: boolean;
  providers?: ProviderOption[];
  models?: ModelOption[];
}

const props = withDefaults(
  defineProps<VAgentToolbarProps>(),
  {
    disabled: false,
    agents: () => [],
    selectedAgent: null,
    isDirty: false,
    providers: () => [
      { label: 'Select Provider...', value: '' },
    ],
    models: () => [
      { label: 'Select Model...', value: '', providerId: '' },
    ],
  }
);

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'edit'): void;
  (e: 'select-agent', agent: Agent): void;
  (e: 'status-change', status: EntityStatus): void;
  (e: 'update:selectedProvider', providerId: ID): void;
  (e: 'update:selectedModel', modelFamilyId: ID): void;
}>();

const isDropdownOpen = ref(false);
const availableModels = computed(() => {
  return props.models.filter((m) => m.providerId === props.selectedAgent?.providerId);
});

const getStatusIntent = (status: EntityStatus) => {
  switch (status) {
    case 'DRAFT': return 'neutral';
    case 'REVIEW': case 'PENDING': return 'warning';
    case 'ACTIVE': case 'APPROVED': case 'PUBLISHED': return 'success';
    default: return 'neutral';
  }
};

const selectAgent = (agent: Agent) => {
  isDropdownOpen.value = false;
  emit('select-agent', agent);
  emit('update:selectedProvider', agent.providerId);
  emit('update:selectedModel', agent.modelFamilyId);
};

const handleProviderChange = (val: string) => {
  emit('update:selectedProvider', val);
  const firstModel = props.models.find((m) => m.providerId === val);
  if (firstModel) {
    emit('update:selectedModel', firstModel.value);
  }
};

const handleModelChange = (val: string) => {
  emit('update:selectedModel', val);
};

const handleStatusChange = (val: string) => {
  const status = val as EntityStatus;
  emit('status-change', status);
};
</script>