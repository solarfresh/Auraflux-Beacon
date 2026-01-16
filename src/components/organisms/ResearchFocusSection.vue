<template>
  <section class="flex flex-col mb-6 pb-6 border-b border-gray-200">
    <div class="flex items-center justify-between mb-4 px-2">
      <Text tag="h3" size="sm" weight="semibold" color="gray-700">
        💡 Current Research Focus
      </Text>

      <Text tag="span" size="xs" weight="normal" color="gray-400" class="font-mono tracking-wider uppercase">
        Score: {{ focus.stabilityScore.toFixed(2) }}
      </Text>
    </div>

    <div class="flex flex-col space-y-1 mb-6">
      <FocusItem
        label="Question"
        :value="focus.finalQuestion"
        placeholder="Click to define Research Question"
        @click="$emit('edit', 'final-question')"
      />

      <FocusItem
        label="Keywords"
        :value="keywordItems"
        placeholder="Click to define Keywords"
        @click="$emit('edit', 'keyword')"
      />

      <FocusItem
        label="Scope"
        :value="scopeSummary"
        placeholder="Click to define Research Scope"
        @click="$emit('edit', 'scope')"
      />
    </div>

    <div class="px-1">
      <ResearchValidation
        :status="feasibilityStatus"
        :description="getFeasibilityDescription(feasibilityStatus)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FeasibilityStatus as TFeasibilityStatus } from '@/interfaces/core';
import type { ManagementType } from '@/interfaces/exploration';
import type { RefinedTopic } from '@/interfaces/workflow';
import { computed } from 'vue';

// Components
import Text from '@/components/atoms/Text.vue';
import FocusItem from '@/components/molecules/FocusItem.vue';
import ResearchValidation from '@/components/molecules/ResearchValidation.vue';

// --- PROPS ---
const props = defineProps<{
  focus: RefinedTopic
}>();

// --- EMITS ---
defineEmits<{
  /** Triggers the opening of RefinementModal (U.S. 1) */
  (e: 'edit', type: ManagementType): void;
}>();

// --- COMPUTED ---
const feasibilityStatus = computed(() => {
  return props.focus.feasibilityStatus;
});

const keywordItems = computed(() => {
  const keywords = props.focus.keywords.map((processedKeyword) => {
    return processedKeyword.label;
  });

  return keywords.join(', ');
});

/** * Summarizes the scope counts for the FocusItem display.
 * Example: "5 Inclusions, 2 Exclusions"
 */
const scopeSummary = computed(() => {
  const inclusions = props.focus.scope?.filter(s => s.boundaryType === 'INCLUSION').length || 0;
  const exclusions = props.focus.scope?.filter(s => s.boundaryType === 'EXCLUSION').length || 0;

  if (inclusions === 0 && exclusions === 0) return undefined;
  return `${inclusions} Included, ${exclusions} Excluded`;
});

const getFeasibilityDescription = (status: TFeasibilityStatus) => {
  switch (status) {
    case 'HIGH':
      return "Data and resources are readily available. Research is low-risk.";
    case 'MEDIUM':
      return "Data availability might be challenging but manageable. Requires targeted effort.";
    case 'LOW':
      return "Significant resource or data gaps exist. Research topic may need significant refinement.";
    default:
      return "Feasibility status is pending.";
  }
};
</script>