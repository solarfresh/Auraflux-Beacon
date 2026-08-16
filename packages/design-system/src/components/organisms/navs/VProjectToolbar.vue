<template>
  <VToolbar
    intent="neutral"
    surface="base"
    border="none"
    padding="none"
    sticky
  >
    <!-- Start area: Filter controls -->
    <template #start>
      <VSegmentedControl
        :model-value="modelValue.filter"
        :options="filterOptions"
        @update:model-value="updateFilter"
      />
    </template>

    <!-- End area: Sorter, divider, and primary action -->
    <template #end>
      <VCluster gap="xs" align="center" class="text-slate-500">
        <VIcon name="ArrowsUpDown" size="xs" />
        <VSelect
          :model-value="modelValue.sorter"
          size="sm"
          class="w-44"
          @update:model-value="updateSorter"
        >
          <option value="EDITED">Recently Edited</option>
          <option value="CREATED">Date Created</option>
          <option value="NAME">Name</option>
        </VSelect>
      </VCluster>

      <VDivider orientation="vertical" size="sm" />

      <VButton
        attention="primary"
        rounded="md"
        size="sm"
        icon-name="Plus"
        @click="$emit('create')"
      >
        New Project
      </VButton>
    </template>
  </VToolbar>
</template>

<script setup lang="ts">
/**
 * VProjectToolbar
 * Updated to utilize VToolbar for slot-based layout structure.
 */
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VDivider from '@auraflux/design-system/components/atoms/layout/VDivider.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VToolbar from '@auraflux/design-system/components/organisms/layout/VToolbar.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VSegmentedControl, { type SegmentedOption } from '@auraflux/design-system/components/molecules/forms/VSegmentedControl.vue';
import type { SortOption } from '@auraflux/design-system/interfaces/indicators';
import type { EntityAttribute, EntityStatus } from '@auraflux/design-system/interfaces/core';
import type { BaseSelectorState } from '@auraflux/design-system/interfaces/indicators';

type ProjectFilterType = 'ALL' | EntityStatus
export type ProjectSelectorState = BaseSelectorState<ProjectFilterType, EntityAttribute>;

const props = defineProps<{
  modelValue: ProjectSelectorState;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProjectSelectorState): void;
  (e: 'create'): void;
}>();

const filterOptions: ReadonlyArray<SegmentedOption<ProjectFilterType>> = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'LOCKED' },
  { label: 'Archived', value: 'ARCHIVED' },
] as const;

const updateFilter = (filter: ProjectFilterType) => {
  emit('update:modelValue', { ...props.modelValue, filter });
};

const updateSorter = (sorter: EntityAttribute | SortOption<EntityAttribute>) => {
  emit('update:modelValue', { ...props.modelValue, sorter });
};
</script>