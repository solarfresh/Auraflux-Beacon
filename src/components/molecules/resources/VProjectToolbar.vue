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
          class="flex overflow-hidden"
        >
          <VButton
            v-for="filter in filterOptions"
            :key="filter.value"
            variant="ghost"
            size="xs"
            :class="[
              'px-4 transition-all',
              modelValue.filter === filter.value
                ? 'bg-white shadow-sm text-indigo-600 font-semibold'
                : 'text-slate-500 hover:text-slate-700'
            ]"
            @click="updateFilter(filter.value)"
          >
            {{ filter.label }}
          </VButton>
        </VBox>
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
            <option value="EDITED">Recently Edited</option>
            <option value="CREATED">Date Created</option>
          </VSelect>
        </VCluster>

        <VBox
          width="px"
          height="4"
          background="slate-50"
          class="bg-slate-200"
        />

        <VButton
          variant="primary"
          size="xs"
          icon-name="Plus"
          @click="$emit('create')"
        >
          New Project
        </VButton>
      </VCluster>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VProjectToolbar
 * Updated: Replaced non-existent VLayoutDivider with a semantic VBox divider.
 */
import VButton from '@/components/atoms/buttons/VButton.vue';
import VSelect from '@/components/atoms/forms/VSelect.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import type { FilterState, BaseSelectorState, SorterState } from '@/interfaces/indicators';

const props = defineProps<{
  modelValue: BaseSelectorState;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: BaseSelectorState): void;
  (e: 'create'): void;
}>();

const filterOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'LOCKED' },
  { label: 'Archived', value: 'ARCHIVED' },
] as const;

const updateFilter = (filter: FilterState) => {
  emit('update:modelValue', { ...props.modelValue, filter });
};

const updateSorter = (sorter: SorterState) => {
  emit('update:modelValue', { ...props.modelValue, sorter });
};
</script>