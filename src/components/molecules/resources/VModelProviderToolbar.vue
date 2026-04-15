<template>
  <VBox
    tag="nav"
    background="white"
    border="bottom"
    padding-x="md"
    padding-y="sm"
    class="sticky top-0 z-20 w-full"
  >
    <VCluster justify="between" align="center" gap="md">

      <VCluster gap="sm" align="center">
        <VBox
          background="slate-50"
          border="all"
          rounded="lg"
          padding="none"
          class="flex overflow-hidden border-slate-200/60"
        >
          <VButton
            v-for="option in statusOptions"
            :key="option.value"
            variant="ghost"
            size="xs"
            :class="[
              'px-4 transition-all',
              modelValue.filter === option.value
                ? 'bg-white shadow-sm text-indigo-600 font-semibold'
                : 'text-slate-500 hover:text-slate-700'
            ]"
            @click="updateFilter(option.value as FilterState)"
          >
            {{ option.label }}
          </VButton>
        </VBox>

        <VBox width="px" height="4" background="slate-50" class="mx-1 hidden md:block" />

        <VCluster gap="xs" align="center" class="ml-1">
          <VTypography size="xs" weight="bold" color="slate-400" class="uppercase tracking-widest">
            Type:
          </VTypography>
          <VSelect
            :model-value="modelValue.providerType"
            size="xs"
            class="w-40"
            @update:model-value="updateProviderType"
          >
            <option value="ALL">All Sources</option>
            <option v-for="option in providerOptions" :value="option.value">{{ option.label }}</option>
          </VSelect>
        </VCluster>
      </VCluster>

      <VCluster gap="md" align="center">
        <VCluster gap="xs" align="center" class="text-slate-500">
          <VIcon name="ArrowsUpDown" size="xs" />
          <VSelect
            :model-value="modelValue.sorter"
            size="xs"
            class="w-44"
            @update:model-value="updateSorter"
          >
            <option v-for="option in sorterOptions" :value="option.value">{{ option.label }}</option>
          </VSelect>
        </VCluster>

        <VBox width="px" height="4" background="slate-50" />

        <VButton
          variant="primary"
          size="xs"
          icon-name="Plus"
          @click="$emit('create')"
        >
          Add Provider
        </VButton>
      </VCluster>

    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VModelProviderToolbar Molecule
 * Responsibility: Orchestrating the visibility of infrastructure-level AI connectors.
 * Follows Resource Molecule Rule 6 & 7.
 */
import VButton from '@/components/atoms/buttons/VButton.vue';
import VSelect from '@/components/atoms/forms/VSelect.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import { PROVIDER_OPTIONS } from '@/constants/agents';
import { FilterState, ModelProviderSelectorState, SorterState } from '@/interfaces/indicators';
import { ref } from 'vue';

const props = defineProps<{
  modelValue: ModelProviderSelectorState;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelProviderSelectorState): void;
  (e: 'create'): void;
}>();

const providerOptions = ref(PROVIDER_OPTIONS);

const statusOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Connected', value: 'ACTIVE' },
  { label: 'Errors', value: 'ERROR' },
];

const sorterOptions = ref([
  { label: 'Sort by Name', value: 'NAME'},
  // { label: 'Connection Health', value: 'HEALTH'},
  // { label: 'Lowest Latency', value: 'LATENCY'},
  { label: 'Recently Verified', value: 'EDITED'},
]);

const updateState = (patch: Partial<ModelProviderSelectorState>) => {
  emit('update:modelValue', { ...props.modelValue, ...patch });
};

const updateFilter = (filter: FilterState) => updateState({ filter });
const updateProviderType = (providerType: FilterState) => updateState({ providerType });
const updateSorter = (sorter: SorterState) => updateState({ sorter });
</script>