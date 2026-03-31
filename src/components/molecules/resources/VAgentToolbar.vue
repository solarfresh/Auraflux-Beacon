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
            v-for="option in filterOptions"
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
            Model:
          </VTypography>
          <VSelect
            :model-value="modelValue.modelFamily"
            size="xs"
            class="w-40"
            @update:model-value="updateModelFamily"
          >
            <option value="ALL">All Models</option>
            <option value="GEMINI">Gemini Series</option>
            <option value="GPT">GPT Series</option>
            <option value="CLAUDE">Claude Series</option>
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
            <option value="NAME">Sort by Name</option>
            <option value="VERSION">Latest Version</option>
            <option value="UPDATED">Recently Modified</option>
          </VSelect>
        </VCluster>

        <VBox
          width="px"
          height="4"
          background="slate-50"
        />

        <VButton
          variant="primary"
          size="xs"
          icon-name="Plus"
          @click="$emit('create')"
        >
          Deploy Agent
        </VButton>
      </VCluster>

    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VAgentToolbar Molecule
 * Responsibility: Orchestrating the visibility and sequence of Agent blueprints.
 * Strictly follows Resource Molecule Rule 6 & 7.
 */
import VButton from '@/components/atoms/buttons/VButton.vue';
import VSelect from '@/components/atoms/forms/VSelect.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import type { FilterState, SelectorState, SorterState } from '@/interfaces/indicators';

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
  { label: 'Drafts', value: 'USER_DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' },
];

// Helper to emit updates while maintaining immutability
const updateState = (patch: Partial<SelectorState>) => {
  emit('update:modelValue', { ...props.modelValue, ...patch });
};

const updateFilter = (filter: FilterState) => updateState({ filter });
const updateModelFamily = (modelFamily: string) => updateState({ modelFamily });
const updateSorter = (sorter: SorterState) => updateState({ sorter });
</script>