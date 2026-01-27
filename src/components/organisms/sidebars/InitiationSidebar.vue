<template>
  <BaseSidebarLayout
    :title="'Initiation'"
    :item-count="keywords.length + scope.length"
    class="bg-slate-50 border-r border-slate-200 h-full"
    body-class="p-0"
  >
    <template #header-extension>
      <VBox padding="md" class="pt-2 pb-2">
        <VNavAlert
          :keywords="keywords"
          :scope="scope"
          @scroll-to-review="handleScrollToReview"
        />
      </VBox>
    </template>

    <template #body>
      <VStack gap="lg" padding="md">

        <VStack gap="md">
          <VStatusScore
            :stability-score="stabilityScore"
            label="Topic Refinement"
            color="indigo"
          />
          <VStatusCard
            :status="feasibilityStatus"
            :description="getFeasibilityDescription(feasibilityStatus)"
          />
        </VStack>

        <hr class="border-slate-200" />

        <VStack gap="md">
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
        </VStack>

        <hr class="border-slate-200" />

        <VStack gap="lg" class="pb-6">
          <VStack gap="xs">
            <VTypography tag="h3" size="sm" weight="bold" class="px-2 text-slate-900">
              Final Research Question
            </VTypography>
            <VBox
              background="white"
              padding="md"
              rounded="xl"
              border="all"
              class="shadow-sm cursor-pointer hover:border-indigo-300 transition-all group mx-2"
              @click="handleViewDetails('final-question')"
            >
              <VTypography tag="p" size="sm" class="text-slate-700 italic leading-relaxed">
                "{{ finalQuestion || 'Click to define your core inquiry...' }}"
              </VTypography>
            </VBox>
          </VStack>

          <VStack gap="xs" class="px-2">
            <VCluster justify="between" align="center">
              <VTypography tag="h3" size="sm" weight="bold" class="text-slate-900">
                Latest Reflection
              </VTypography>
              <VButton
                variant="ghost"
                size="xs"
                icon-only
                icon-name="BookOpen"
                @click="handleViewDetails('reflection-log')"
              />
            </VCluster>
            <VBox background="transparent" padding="sm" rounded="lg" border="all" class="border-slate-100 border-dashed">
              <VTypography size="xs" italic class="text-slate-500">
                {{ latestReflection || "No recent reflections logged." }}
              </VTypography>
            </VBox>
          </VStack>
        </VStack>

      </VStack>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

// Layout Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';

// Standard Atoms
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

// Molecules & Specialized Sections
import VStatusCard from '@/components/molecules/indicators/VStatusCard.vue';
import VStatusScore from '@/components/molecules/indicators/VStatusScore.vue';
import VNavAlert from '@/components/molecules/navs/VNavAlert.vue';
import KeywordManagementSection from '@/components/organisms/sections/KeywordManagementSection.vue';
import ScopeManagementSection from '@/components/organisms/sections/ScopeManagementSection.vue';

import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';

import type { FeasibilityStatus as TFeasibilityStatus } from '@/interfaces/core';
import type { ManagementType, ProcessedKeyword, ProcessedScope } from '@/interfaces/initiation';

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

const keywordSectionRef = ref<InstanceType<typeof KeywordManagementSection> | null>(null);
const scopeSectionRef = ref<InstanceType<typeof ScopeManagementSection> | null>(null);

// --- Domain Logic ---
const getFeasibilityDescription = (status: TFeasibilityStatus) => {
  const descriptions: Record<TFeasibilityStatus, string> = {
    HIGH: "Data and resources are readily available.",
    MEDIUM: "Requires targeted effort to find sources.",
    LOW: "Significant resource gaps identified.",
  };
  return descriptions[status] || "Status pending.";
};

// --- Handlers ---
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

const handleScrollToReview = (firstSection: 'keyword' | 'scope') => {
  nextTick(() => {
    const target = firstSection === 'keyword'
      ? keywordSectionRef.value?.$el
      : scopeSectionRef.value?.$el;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};
</script>