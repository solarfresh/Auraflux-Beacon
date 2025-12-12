<template>
  <div class="flex flex-col space-y-6">

    <UnifiedReviewAlert
        :keywords="keywords"
        :scope="scope"
        @scroll-to-review="handleScrollToReview"
    />

    <div class="space-y-2">
      <TopicStatusIndicator
        :stability-score="stabilityScore"
        label="Topic Refinement Status"
        description="current clarity level"
        color="indigo"
      />
    </div>

    <div class="space-y-4">

      <ResearchValidation
        :status="feasibilityStatus"
        :description="getFeasibilityDescription(feasibilityStatus)"
      />

      <div class="space-y-2">
        <Text tag="h3" size="lg" weight="semibold" color="gray-800">Final Research Question</Text>

        <Text tag="p" size="base" color="gray-600" class="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition"
              @click="handleViewDetails('final-question')">
          {{ finalQuestion || "Click to define the final question..." }}
        </Text>
      </div>
    </div>

    <div class="h-px bg-gray-200"></div>
    <KeywordManagementSection
      :keywords="keywords"
      :ref="'keywordSectionRef'"
      @add-request="handleKeywordAction('keyword-add')"
      @edit-request="(payload) => handleKeywordAction('keyword', payload)"
    />

    <ScopeManagementSection
      :scope="scope"
      :ref="'scopeSectionRef'"
      @add-request="handleScopeAction('scope-add')"
      @edit-request="(payload: any) => handleScopeAction('scope', payload)"
    />

    <div class="h-px bg-gray-200"></div>

    <div class="space-y-3">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="flex items-center justify-between">
        <Text tag="span" size="lg" weight="semibold" color="gray-800">Reflection Log</Text>
        <Button variant="tertiary" size="sm" @click="handleViewDetails('reflection-log')">
          <Icon name="BookOpen" type="outline" size="sm" color="gray-600" />
        </Button>
      </Text>
      <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm italic text-gray-500">
        {{ latestReflection || "No recent reflection logs." }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import ResearchValidation from '@/components/molecules/ResearchValidation.vue';
import TopicStatusIndicator from '@/components/molecules/TopicStatusIndicator.vue';
import KeywordManagementSection from '@/components/organisms/KeywordManagementSection.vue';
import ScopeManagementSection from '@/components/organisms/ScopeManagementSection.vue';
import UnifiedReviewAlert from '@/components/organisms/UnifiedReviewAlert.vue';
import type { ManagementType, FeasibilityStatus as TFeasibilityStatus, TopicKeyword, TopicScopeElement } from '@/interfaces/initiation';
import { nextTick, ref } from 'vue';


// ----------------------------------------------------------------------
// --- Refs for Component Scrolling ---
// ----------------------------------------------------------------------
const keywordSectionRef = ref<InstanceType<typeof KeywordManagementSection> | null>(null);
const scopeSectionRef = ref<InstanceType<typeof ScopeManagementSection> | null>(null);


// ----------------------------------------------------------------------
// --- Props & Data Conversion ---
// ----------------------------------------------------------------------

const props = defineProps<{
  /** List of keywords, status, and source. */
  keywords: TopicKeyword[];

  /** List of scope items (e.g., Geographical, Timeframe). */
  scope: TopicScopeElement[];

  /** The final synthesized research question string. */
  finalQuestion: string;

  /** Status of information availability for the topic (e.g., High, Medium, Low). */
  feasibilityStatus: TFeasibilityStatus;

  /** Suggestion for the next search path. (Unused in template, but kept for completeness). */
  resourceSuggestion: string;

  /** The most recent thought logged by the user. */
  latestReflection: string | null;

  /** The overall stability score for the sidebar view. */
  stabilityScore: number;
}>();

// --- Emits ---
const emit = defineEmits<{
  /** Emitted when a user clicks an element that leads to a detailed management page/modal. */
  (e: 'viewDetails', type: ManagementType, index?: number, value?: any): void;
}>();


// ----------------------------------------------------------------------
// --- Helper Functions (Remaining Logic) ---
// ----------------------------------------------------------------------

/** Provides a detailed description for the simple feasibility status. */
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


// ----------------------------------------------------------------------
// --- Event Handlers ---
// ----------------------------------------------------------------------

/** * Handles keyword actions (add/edit) from the child Organism
 * and routes them to the top-level viewDetails emitter.
 */
const handleKeywordAction = (type: 'keyword' | 'keyword-add', payload?: { index: number, keyword: TopicKeyword }) => {
    if (type === 'keyword-add') {
        handleViewDetails('keyword');
    } else if (type === 'keyword' && payload) {
        handleViewDetails('keyword', payload.index, payload.keyword);
    }
};

/** * Handles scope actions (add/edit) from the child Organism
 * and routes them to the top-level viewDetails emitter.
 */
const handleScopeAction = (type: 'scope' | 'scope-add', payload?: { index: number, scope: TopicScopeElement }) => {
    if (type === 'scope-add') {
        handleViewDetails('scope');
    } else if (type === 'scope' && payload) {
        // NOTE: Scope edit requires the 'scope' type and index/value payload
        handleViewDetails('scope', payload.index, payload.scope);
    }
};

/** Emits event for navigating to detailed views/modals. */
const handleViewDetails = (type: ManagementType, index?: number, value?: any) => {
    emit('viewDetails', type, index, value);
};


/** * Handles the scroll-to-review event from UnifiedReviewAlert
 * to scroll to the first section that has review items.
 */
const handleScrollToReview = (firstSection: 'keyword' | 'scope') => {
    nextTick(() => {
        let targetElement = null;
        if (firstSection === 'keyword' && keywordSectionRef.value?.$el) {
            targetElement = keywordSectionRef.value.$el;
        } else if (firstSection === 'scope' && scopeSectionRef.value?.$el) {
            targetElement = scopeSectionRef.value.$el;
        }

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
};
</script>