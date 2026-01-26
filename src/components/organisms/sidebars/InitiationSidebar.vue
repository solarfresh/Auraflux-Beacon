<template>
  <BaseSidebarLayout
    :title="'Initiation'"
    :item-count="keywords.length + scope.length"
    class="bg-slate-50 border-r border-gray-200 h-full"
    body-class="p-2 space-y-6"
  >
    <template #header-extension>
      <div class="px-5 pb-2">
        <VNavAlert
          :keywords="keywords"
          :scope="scope"
          @scroll-to-review="handleScrollToReview"
        />
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <VStatusScore
          :stability-score="stabilityScore"
          label="Topic Refinement"
          color="indigo"
        />
        <VStatusCard
          :status="feasibilityStatus"
          :description="getFeasibilityDescription(feasibilityStatus)"
        />
      </div>

      <hr class="border-gray-200 mx-2" />

      <div class="space-y-2">
        <KeywordManagementSection
          ref="keywordSectionRef"
          :keywords="keywords"
          @add-request="handleKeywordAction('keyword-add')"
          @edit-request="(payload) => handleKeywordAction('keyword', payload)"
        />

        <ScopeManagementSection
          ref="scopeSectionRef"
          :scope="scope"
          @add-request="handleScopeAction('scope-add')"
          @edit-request="(payload) => handleScopeAction('scope', payload)"
        />
      </div>

      <hr class="border-gray-200 mx-2" />

      <div class="space-y-6">
        <div class="space-y-2">
          <VTypography tag="h3" size="sm" weight="bold" color="gray-900" class="px-2">
            Final Research Question
          </VTypography>
          <div
            class="mx-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-all group"
            @click="handleViewDetails('final-question')"
          >
            <VTypography tag="p" size="sm" color="gray-700" class="italic leading-relaxed">
              "{{ finalQuestion || 'Click to define your core inquiry...' }}"
            </VTypography>
          </div>
        </div>

        <div class="space-y-2 px-2 pb-4">
          <div class="flex items-center justify-between">
            <VTypography tag="h3" size="sm" weight="bold" color="gray-900">Latest Reflection</VTypography>
            <VButton
              variant="ghost"
              size="xs"
              iconOnly
              iconName="BookOpen"
              @click="handleViewDetails('reflection-log')"
            />
          </div>
          <div class="p-3 bg-white/50 rounded-lg border border-gray-100 text-xs italic text-slate-500">
            {{ latestReflection || "No recent reflections logged." }}
          </div>
        </div>
      </div>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { FeasibilityStatus as TFeasibilityStatus } from '@/interfaces/core';
import type { ManagementType, ProcessedKeyword, ProcessedScope } from '@/interfaces/initiation';

// Layout & UI Components
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

// Molecules
import VStatusCard from '@/components/molecules/indicators/VStatusCard.vue';
import VStatusScore from '@/components/molecules/indicators/VStatusScore.vue';
import VNavAlert from '@/components/molecules/navs/VNavAlert.vue';

// Specialized Sections
import KeywordManagementSection from '@/components/organisms/sections/KeywordManagementSection.vue';
import ScopeManagementSection from '@/components/organisms/sections/ScopeManagementSection.vue';

/**
 * InitiationSidebar: Orchestrates research startup data.
 * It uses BaseSidebarLayout to define the visual frame and manages
 * local navigation (scrolling) and event bubbling to the view level.
 */
const props = defineProps<{
  keywords: ProcessedKeyword[];
  scope: ProcessedScope[];
  finalQuestion: string;
  feasibilityStatus: TFeasibilityStatus;
  latestReflection: string | null;
  stabilityScore: number;
}>();

const emit = defineEmits<{
  (e: 'viewDetails', type: ManagementType, index?: number, value?: any): void;
}>();

// --- Template Refs for Scrolling Logic ---
const keywordSectionRef = ref<InstanceType<typeof KeywordManagementSection> | null>(null);
const scopeSectionRef = ref<InstanceType<typeof ScopeManagementSection> | null>(null);

// --- Business Logic Helpers ---

const getFeasibilityDescription = (status: TFeasibilityStatus) => {
  const descriptions: Record<TFeasibilityStatus, string> = {
    HIGH: "Data and resources are readily available.",
    MEDIUM: "Requires targeted effort to find sources.",
    LOW: "Significant resource gaps identified.",
  };
  return descriptions[status] || "Status pending.";
};

// --- Action & Navigation Handlers ---

const handleKeywordAction = (type: 'keyword' | 'keyword-add', payload?: any) => {
  type === 'keyword-add'
    ? emit('viewDetails', 'keyword')
    : emit('viewDetails', 'keyword', payload.index, payload.keyword);
};

const handleScopeAction = (type: 'scope' | 'scope-add', payload?: any) => {
  type === 'scope-add'
    ? emit('viewDetails', 'scope')
    : emit('viewDetails', 'scope', payload.index, payload.scope);
};

const handleViewDetails = (type: ManagementType, index?: number, value?: any) => {
  emit('viewDetails', type, index, value);
};

/** Handles smooth scrolling to sections when user clicks on Alert notifications */
const handleScrollToReview = (firstSection: 'keyword' | 'scope') => {
  nextTick(() => {
    const target = firstSection === 'keyword'
      ? keywordSectionRef.value?.$el
      : scopeSectionRef.value?.$el;

    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};
</script>