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
          <select
            :value="modelValue.sorter"
            class="bg-transparent text-sm font-medium focus:outline-none cursor-pointer hover:text-slate-900"
            @change="updateSorter(($event.target as HTMLSelectElement).value as SorterState)"
          >
            <option value="edited">Recently Edited</option>
            <option value="created">Date Created</option>
          </select>
        </VCluster>

        <VBox
          width="px"
          height="4"
          background="slate-50"
          class="bg-slate-200"
        />

        <VButton
          variant="primary"
          size="sm"
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
import { ref } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import type { SelectorState, SorterState, FilterState } from '@/interfaces/indicators';

const props = defineProps<{
  modelValue: SelectorState;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectorState): void;
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