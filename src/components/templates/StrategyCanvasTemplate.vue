<template>
  <div class="relative min-h-screen pt-16">
    <HeaderToolbar
      :current-step="currentStep"
      class="fixed top-0 left-0 right-0 z-20"
      @toggle-reference-panel="isPanelVisible = !isPanelVisible"
    />

    <main class="max-w-7xl mx-auto px-4 py-8">

      <div class="grid gap-8" :class="[isPanelVisible ? 'grid-cols-4' : 'grid-cols-1']">

        <ReferencePanel
          v-if="isPanelVisible && currentStep !== 'SEARCH'"
          :search-query="searchQuery"
          :search-results="searchResults"
          :scope-data="scopeData"
          class="col-span-1"
        />

        <div
          :class="[
            'space-y-8',
            isPanelVisible && currentStep !== 'SEARCH' ? 'col-span-3' : 'col-span-4'
          ]"
        >
          <TaskCard
            title="1. Search & Data Lock (Knowledge Base Setup)"
            :step-id="'SEARCH'"
            :current-step="currentStep"
            :is-complete="currentStep !== 'SEARCH'"
            completion-summary="Knowledge Base Locked. Ready for scope definition."
          >
            <SearchPageContent
              v-if="currentStep === 'SEARCH'"
              :search-query="searchQuery"
              :search-results="searchResults"
              :is-loading="isLoading"
              @search="handleSearch"
              @lock-data="handleLockData"
            />
            <div v-else class="text-gray-600">
              Knowledge Base Locked: **{{ searchResults.length }}** sources for "**{{ searchQuery }}**".
            </div>
          </TaskCard>

          <TaskCard
            title="2. Define Scope & Tension"
            :step-id="'SCOPE'"
            :current-step="currentStep"
            :is-complete="!!scopeData"
            :completion-summary="scopeData ? `Tension: ${scopeData.dichotomy}` : 'Scope Pending'"
          >
            <ScopeSelector
              v-if="currentStep === 'SCOPE'"
              @scope-defined="handleScopeDefined"
            />
            <div v-else-if="scopeData" class="text-gray-600">
              Tension defined: **{{ scopeData.dichotomy }}**. Question: "{{ scopeData.question }}"
            </div>
          </TaskCard>

          </div>
      </div>
    </main>

    <KnowledgeGapPanel v-if="currentStep !== 'SEARCH'" class="fixed bottom-0 right-0 z-20" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'; // Import ref for the new toggle state

import HeaderToolbar from '@/components/molecules/HeaderToolbar.vue';
import KnowledgeGapPanel from '@/components/organisms/KnowledgeGapPanel.vue';
import ReferencePanel from '@/components/organisms/ReferencePanel.vue';
import ScopeSelector from '@/components/organisms/ScopeSelector.vue';
import SearchPageContent from '@/components/organisms/SearchPageContent.vue';
import TaskCard from '@/components/organisms/TaskCard.vue';
import type { ScopeData, SearchResult, WorkflowStep } from '@/interfaces/search';

// --- Local State for UI ---
const isPanelVisible = ref(true); // Default to visible
const scopeData = ref<ScopeData | null>(null);

// --- Props (Received from main App Container) ---
const props = defineProps<{
  currentStep: WorkflowStep;
  searchQuery: string;
  searchResults: SearchResult[];
  isLoading?: boolean;
  handleSearch?: (...args: any[]) => any;
  handleLockData: (...args: any[]) => any;
  // Other handlers for future steps
}>();

// --- Event Handlers (Emitting to the App Container) ---
const emit = defineEmits(['updateStep']); // Assuming the parent App manages step transition

const handleLockData = () => {
  props.handleLockData(); // Call parent handler to transition state to 'SCOPE'
};

const handleScopeDefined = (data: ScopeData) => {
  scopeData.value = data;
  emit('updateStep', 'COLLECTION'); // Transition state to Step 3
};
</script>