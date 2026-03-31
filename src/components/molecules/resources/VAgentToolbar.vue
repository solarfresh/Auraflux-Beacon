<template>
  <VBox
    tag="div"
    class="w-full flex flex-col md:flex-row md:items-center justify-between gap-4"
  >
    <VCluster gap="sm" align="center">
      <VBox
        background="slate-50"
        rounded="lg"
        padding="xs"
        class="flex items-center gap-1 border border-slate-200/50"
      >
        <VButton
          v-for="option in filterOptions"
          :key="option.value"
          variant="ghost"
          size="sm"
          :class="[
            'px-4 transition-all duration-200',
            modelValue.filter === option.value
              ? 'bg-white shadow-sm text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-700'
          ]"
          @click="updateFilter(option.value as FilterState)"
        >
          {{ option.label }}
        </VButton>
      </VBox>

      <VBox width="px" height="4" background="slate-50" class="mx-1 hidden md:block" />

      <VTypography size="xs" weight="bold" color="slate-400" class="uppercase tracking-widest ml-2">
        Model:
      </VTypography>
      <select
        :value="modelValue.modelFamily"
        class="bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer hover:text-indigo-600"
        @change="updateModelFamily(($event.target as HTMLSelectElement).value)"
      >
        <option value="ALL">All Models</option>
        <option value="GEMINI">Gemini Series</option>
        <option value="GPT">GPT Series</option>
        <option value="CLAUDE">Claude Series</option>
      </select>
    </VCluster>

    <VCluster gap="md" align="center" justify="end">
      <VCluster gap="xs" align="center" class="text-slate-500">
        <VIcon name="ArrowsUpDown" size="xs" />
        <select
          :value="modelValue.sorter"
          class="bg-transparent text-sm font-medium outline-none cursor-pointer hover:text-slate-900"
          @change="updateSorter(($event.target as HTMLSelectElement).value as SorterState)"
        >
          <option value="NAME">Sort by Name</option>
          <option value="VERSION">Latest Version</option>
          <option value="UPDATED">Recently Modified</option>
        </select>
      </VCluster>

      <VButton
        variant="primary"
        size="md"
        icon-name="Plus"
        @click="$emit('create')"
      >
        Deploy Agent
      </VButton>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VAgentToolbar Molecule
 * Responsibility: Orchestrating the visibility and sequence of Agent blueprints.
 * Strictly follows Resource Molecule Rule 6 & 7.
 */
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import type { SelectorState, SorterState, FilterState } from '@/interfaces/indicators';

const props = defineProps<{
  modelValue: SelectorState;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectorState): void;
  (e: 'create'): void;
}>();

const filterOptions = [
  { label: 'All Agents', value: 'ALL' },
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