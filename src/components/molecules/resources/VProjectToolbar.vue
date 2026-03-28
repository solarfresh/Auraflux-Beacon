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
            :value="modelValue.sort"
            class="bg-transparent text-sm font-medium focus:outline-none cursor-pointer hover:text-slate-900"
            @change="updateSort(($event.target as HTMLSelectElement).value)"
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
import VButton from '@/components/atoms/actions/VButton.vue';

interface ToolbarState {
  filter: 'all' | 'active' | 'archived';
  sort: 'edited' | 'created';
}

const props = defineProps<{
  modelValue: ToolbarState;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ToolbarState): void;
  (e: 'create'): void;
}>();

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
] as const;

const updateFilter = (filter: ToolbarState['filter']) => {
  emit('update:modelValue', { ...props.modelValue, filter });
};

const updateSort = (sort: any) => {
  emit('update:modelValue', { ...props.modelValue, sort });
};
</script>