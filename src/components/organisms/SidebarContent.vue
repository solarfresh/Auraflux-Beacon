<template>
  <div class="flex flex-col space-y-6">

    <Text tag="h2" size="xl" weight="bold" color="gray-900" class="border-b pb-3 flex items-center space-x-2">
      <Icon name="Target" type="solid" size="md" color="indigo-600" />
      <Text tag="span" size="xl" weight="bold" color="gray-900">Initiation Phase Output</Text>
    </Text>

    <div class="space-y-2">
      <TopicStatusIndicator
        :stability-score="stabilityScore"
        label="Topic Refinement Status"
        description="current clarity level"
        color="indigo"      />
    </div>

    <div class="flex items-center space-x-2 p-2 rounded-lg"
      :class="getFeasibilityClasses(feasibilityStatus)">
      <Icon :name="getFeasibilityIcon(feasibilityStatus)" type="solid" size="sm" class="flex-shrink-0" />
      <Text tag="span" size="sm" weight="medium" class="flex-grow">
        Research Feasibility: <span class="font-bold">{{ getFeasibilityLabel(feasibilityStatus) }}</span>
      </Text>
    </div>

    <div class="space-y-3">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="flex items-center justify-between">
        Final Question Statement
        <Button variant="tertiary" size="sm" @click="promptAndEmitQuestionUpdate(finalQuestion)">
          <Icon name="PencilSquare" type="outline" size="sm" color="gray-600" />
        </Button>
      </Text>

      <div
        class="p-4 rounded-lg border-2 transition duration-150 cursor-pointer hover:shadow-md"
        :class="finalQuestion ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-100'"
        @click="handleViewDetails('final-question')"
      >
        <Text tag="p" size="base" :weight="finalQuestion ? 'semibold' : 'normal'" :color="finalQuestion ? 'green-800' : 'gray-500'">
          {{ finalQuestion || 'Question not yet finalized. Refine in the chat to see the draft here.' }}
        </Text>
      </div>
    </div>

    <div class="space-y-3">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="flex items-center justify-between">
        <Text tag="span" size="lg" weight="semibold" color="gray-800">Core Keywords & Elements</Text>
        <Text tag="span" size="xs" weight="medium" :color="unreviewedKeywordsCount > 0 ? 'yellow-600' : 'indigo-600'">
          ({{ lockedKeywordsCount }}/{{ keywords.length }}) Locked <span v-if="unreviewedKeywordsCount > 0">({{ unreviewedKeywordsCount }} Unreviewed)</span>
        </Text>
      </Text>

      <ul class="space-y-2">
        <li
          v-for="(keyword, index) in keywords"
          :key="index"
          :class="[
            'flex items-center justify-between p-3 border rounded-lg transition duration-150 cursor-pointer',
            getTopicKeywordPresentation(keyword).classes
          ]"
          @click="handleViewDetails('keyword', index, keyword)"
        >
          <div class="flex items-start space-x-3">
            <Icon :name="getTopicKeywordPresentation(keyword).icon" type="outline" size="sm" :color="getTopicKeywordPresentation(keyword).iconColor" class="mt-1 flex-shrink-0" />

            <div class="flex flex-col">
              <Text tag="span" size="base" weight="medium" :color="getTopicKeywordPresentation(keyword).iconColor">
                {{ keyword.text }}
              </Text>
              <Text tag="span" size="xs" :color="getTopicKeywordPresentation(keyword).iconColor" class="opacity-80">
                {{ getTopicKeywordPresentation(keyword).secondaryText }}
              </Text>
            </div>
          </div>

          <Icon
            :name="getTopicKeywordPresentation(keyword).actionIcon!"
            type="outline"
            size="md"
            :color="getTopicKeywordPresentation(keyword).iconColor"
          />
        </li>
      </ul>
    </div>

    <div class="space-y-3">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="flex items-center justify-between">
        Research Scope
        <Button variant="tertiary" size="sm" @click="handleViewDetails('scope-management')">
          <Icon name="Cog" type="outline" size="sm" color="gray-600" />
        </Button>
      </Text>
      <ul class="space-y-2 text-sm text-gray-700">
        <Text
          tag="li"
          v-for="(item, index) in scope"
          :key="index"
          class="flex justify-between"
        >
          <Text tag="span" size="sm" weight="medium" color="gray-600">{{ item.label }}:</Text>
          <Text tag="span" size="sm" color="gray-700">{{ item.value || 'N/A' }}</Text>
        </Text>
      </ul>
    </div>
<!--
    <div class="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <Text tag="h4" size="base" weight="semibold" color="blue-700">
        Suggested Search Focus
      </Text>
      <Text tag="p" size="sm" color="blue-600">
        {{ resourceSuggestion }}
      </Text>
    </div>
 -->
    <div class="space-y-3 mt-auto pt-6 border-t border-gray-200">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="flex items-center justify-between">
        Reflection Log Summary
        <Button variant="tertiary" size="sm" @click="handleViewDetails('reflection-log')">
          <Icon name="ListBullet" type="outline" size="sm" color="gray-600" />
        </Button>
      </Text>

      <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 italic">
        <p v-if="latestReflection">{{ latestReflection }}</p>
        <p v-else>No recent thoughts logged. Click the "Log a Thought" button below to clarify your task or feelings.</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import TopicStatusIndicator from '@/components/molecules/TopicStatusIndicator.vue';
import type { FeasibilityStatus, ManagementType, TopicKeyword, TopicKeywordStyle, TopicScopeElement } from '@/interfaces/initiation';
import { computed } from 'vue';

// ----------------------------------------------------------------------
// --- Props (Defined with Mock Data for standalone use) ---
// ----------------------------------------------------------------------

const props = defineProps<{
  /** List of keywords, status, and source. */
  keywords: TopicKeyword[];

  /** List of scope items (e.g., Geographical, Timeframe). */
  scope: TopicScopeElement[];

  /** The final synthesized research question string. */
  finalQuestion: string;

  /** Status of information availability for the topic (e.g., High, Medium, Low). */
  feasibilityStatus: FeasibilityStatus;

  /** Suggestion for the next search path (e.g., Use academic databases). */
  resourceSuggestion: string;

  /** The most recent thought logged by the user. */
  latestReflection: string | null;

  /** The overall completion percentage for the sidebar view. */
  stabilityScore: number;
}>();

// --- Emits ---
const emit = defineEmits<{
  /** Emitted when a user attempts to manually edit/lock a keyword. */
  (e: 'keywordUpdate', payload: { index: number, newText: string }): void;

  /** Emitted when a user manually edits the Final Question. */
  (e: 'questionUpdate', newText: string): void;

  /** Emitted when a user clicks an element that leads to a detailed management page/modal. */
  (e: 'viewDetails', type: ManagementType, index?: number, value?: any): void;
}>();


// --- Computed Properties ---

/** Calculates the number of locked keywords for the progress tracker. */
const lockedKeywordsCount = computed(() => {
  return props.keywords.filter(k => k.status === 'LOCKED').length;
});

/** Calculates the number of keywords that need user attention (AI_EXTRACTED or USER_DRAFT). */
const unreviewedKeywordsCount = computed(() => {
  return props.keywords.filter(k => k.status === 'AI_EXTRACTED' || k.status === 'USER_DRAFT').length;
});

// --- Feasibility Helpers ---
const getFeasibilityClasses = (status: FeasibilityStatus) => {
  switch (status) {
    case 'HIGH': return 'bg-teal-50 border-teal-200 text-teal-700';
    case 'MEDIUM': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    case 'LOW': return 'bg-red-50 border-red-200 text-red-700';
    default: return 'bg-gray-50 border-gray-200 text-gray-500';
  }
};

const getFeasibilityIcon = (status: FeasibilityStatus) => {
  switch (status) {
    case 'HIGH': return 'CheckCircle';
    case 'MEDIUM': return 'ExclamationTriangle';
    case 'LOW': return 'ArchiveBoxXMark';
    default: return 'QuestionMarkCircle';
  }
};

const getFeasibilityLabel = (status: FeasibilityStatus) => {
  switch (status) {
    case 'HIGH': return 'Information Abundant';
    case 'MEDIUM': return 'Requires Refinement';
    case 'LOW': return 'Information Scarce';
    default: return 'N/A';
  }
};

const getTopicKeywordPresentation = (keyword: TopicKeyword): TopicKeywordStyle => {
    switch (keyword.status) {
        case 'LOCKED':
            return {
                classes: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
                icon: 'LockClosed',
                iconColor: 'indigo-600',
                secondaryText: 'Locked',
                actionIcon: 'ChevronRight', // Click to view details
            };
        case 'AI_EXTRACTED':
            return {
                classes: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                icon: 'Sparkles',
                iconColor: 'yellow-600',
                secondaryText: 'Review AI Capture',
                actionIcon: 'ChevronRight', // Click to manage commitment
            };
        case 'ON_HOLD':
            return {
                classes: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
                icon: 'ArchiveBox',
                iconColor: 'gray-500',
                secondaryText: 'On Hold (Excluded)',
                actionIcon: 'ArrowPath', // Click to reactivate/view
            };
        case 'USER_DRAFT':
        default:
            return {
                classes: 'bg-white border-gray-200 hover:bg-gray-50',
                icon: 'PencilSquare',
                iconColor: 'gray-600',
                secondaryText: 'User Draft',
                actionIcon: 'PencilSquare', // Click to edit text or commit
            };
    }
};

// --- Methods ---

/** Emits event for navigating to detailed views/modals. */
const handleViewDetails = (type: ManagementType, index?: number, value?: any) => {
    emit('viewDetails', type, index, value);
};

/** Simulates the edit action for keywords. */
const promptAndEmitKeywordUpdate = (index: number, currentText: string) => {
  // NOTE: This should be replaced by a proper UI modal/inline editor in production.
  const newText = prompt(`Edit and lock keyword: ${currentText}`, currentText);
  if (newText && newText.trim() !== currentText) {
    emit('keywordUpdate', { index, newText: newText.trim() });
  }
};

/** Simulates the edit action for Final Question. */
const promptAndEmitQuestionUpdate = (currentText: string) => {
  // NOTE: This should be replaced by a proper UI modal/inline editor in production.
  const newText = prompt(`Edit and lock Final Question:`, currentText);
  if (newText && newText.trim() !== currentText) {
    emit('questionUpdate', newText.trim());
  }
};

</script>