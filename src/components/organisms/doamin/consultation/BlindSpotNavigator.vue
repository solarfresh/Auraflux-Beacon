<template>
  <VStack gap="xs" class="w-full min-w-0">

    <VBox padding="none" background="transparent" class="w-full px-0.5">
      <VCluster justify="between" align="center" :full-width="true" gap="xs">

        <VCluster gap="xs" align="center" class="min-w-0">
          <VTypography
            tag="span"
            size="xs"
            class="w-1.5 h-1.5 rounded-full transition-colors duration-300 flex-shrink-0"
            :class="isComplete ? 'bg-emerald-500' : 'bg-amber-500'"
          />
          <VTypography tag="span" size="xs" weight="medium" color="slate-400" class="text-[11px] tracking-wide truncate">
            {{ alignmentString }}
          </VTypography>
        </VCluster>

        <VTypography
          v-if="primaryInsight?.canSidebarPatch"
          tag="span"
          size="xs"
          weight="semibold"
          color="indigo-500"
          class="cursor-pointer hover:text-indigo-600 active:opacity-70 select-none transition-colors flex-shrink-0 text-[11px]"
          @click="$emit('toggle-expand')"
        >
          {{ isExpanded ? uiLabels.collapseAction : uiLabels.inspectAction }}
        </VTypography>

      </VCluster>
    </VBox>

    <VCard v-if="primaryInsight" padding="sm" gap="sm" class="border-slate-200/60">

      <VCluster justify="between" align="center" :full-width="true" class="w-full min-w-0">
        <VCluster gap="xs" align="center" class="min-w-0">
          <VTypography
            tag="span"
            class="w-1 h-3 bg-amber-500 rounded-full shrink-0"
          />
          <VTypography tag="span" size="xs" weight="bold" color="slate-400" class="tracking-wider uppercase text-[9px]">
            {{ primaryInsight.targetDimension }} Focus
          </VTypography>
        </VCluster>

        <VTooltip :content="primaryInsight.description" position="bottom-right">
          <VIcon
            name="question-mark-circle"
            type="outline"
            size="xs"
            color="slate-400"
            class="hover:text-slate-600 transition-colors cursor-help shrink-0"
          />
        </VTooltip>
      </VCluster>

      <VStack gap="xs" class="w-full min-w-0">
        <VTypography tag="h4" size="xs" weight="bold" color="slate-900" class="leading-snug break-words">
          {{ primaryInsight.title }}
        </VTypography>

        <VTypography
          tag="div"
          size="xs"
          color="indigo-950"
          class="w-full pl-1.5 border-l border-indigo-100/80 mt-0.5 italic font-medium leading-relaxed break-words"
        >
          "{{ primaryInsight.question }}"
        </VTypography>
      </VStack>

      <VCluster justify="between" align="center" :full-width="true" class="pt-2.5 border-t border-slate-100 min-w-0">
        <VTypography tag="span" size="xs" color="slate-400" class="flex-shrink-0 text-[10px]">
          {{ totalInsightsCount }} {{ uiLabels.insightsCountLabel }}
        </VTypography>

        <VCluster
          gap="xs"
          align="center"
          class="cursor-pointer group select-none flex-shrink-0"
          @click="$emit('open-calibration', primaryInsight.id)"
        >
          <VTypography tag="span" size="xs" weight="semibold" color="indigo-500" class="group-hover:text-indigo-600 transition-colors text-[11px]">
            {{ uiLabels.calibrateAction }}
          </VTypography>

          <VIcon
            name="arrow-right"
            type="solid"
            size="xs"
            color="indigo-500"
            class="group-hover:translate-x-0.5 transition-transform duration-150"
          />
        </VCluster>
      </VCluster>

    </VCard>
  </VStack>
</template>

<script setup lang="ts">
/**
 * BlindSpotNavigator Component (Refactored Phase 1 Concentrator)
 * Consolidates layout tracking mechanisms natively while entirely stripping down
 * secondary dialectic list variables to alleviate sidebar cognitive weight.
 * Enforces strict synchronization with VIcon, VCard, and VTooltip design tokens.
 */
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VTooltip from '@/components/molecules/feedback/VTooltip.vue';
import VCard from '@/components/molecules/resources/VCard.vue';

interface AIInsight {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  targetDimension: 'CONCEPT' | 'RESOURCE' | 'BOUNDARY' | 'OUTCOME' | 'EVENT' | 'RISK';
  title: string;
  description: string;
  question: string;
  canSidebarPatch: boolean;
  patchActionLabel?: string;
}

interface UILabels {
  inspectAction: string;
  collapseAction: string;
  calibrateAction: string;
  insightsCountLabel: string;
}

withDefaults(
  defineProps<{
    /** Quantitative status summary parsed string (e.g., "5 / 6 Dimensions Settled") */
    alignmentString: string;
    /** Triggers complete vs warning semantic indicator state updates */
    isComplete: boolean;
    /** Synchronized active state tracking whether Phase 2 side-drawer is expanded */
    isExpanded: boolean;
    /** Cumulative metric representing the total density of detected blindspots */
    totalInsightsCount: number;
    /** Primary focused structural payload object injected by orchestration page */
    primaryInsight: AIInsight | null;
    /** Internationalized semantic application label dictionary */
    uiLabels: UILabels;
  }>(),
  {
    isComplete: false,
    isExpanded: false,
    totalInsightsCount: 0,
    primaryInsight: null
  }
);

defineEmits<{
  /** Toggles the expansion state of the side inspection module panel */
  (e: 'toggle-expand'): void;
  /** Dispatches an intent to drill-down into full-screen workspace calibration */
  (e: 'open-calibration', id: string): void;
}>();
</script>