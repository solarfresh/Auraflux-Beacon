<template>
  <div class="relative min-h-full">

    <main class="max-w-7xl mx-auto px-4 py-8">

      <div class="grid gap-8" :class="[isPanelVisible ? 'grid-cols-4' : 'grid-cols-1']">

        <ReferencePanel
          v-if="isPanelVisible && currentStep !== 'SEARCH'"
          :current-step="currentStep"
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
              @lock-data="$emit('lock-data')"
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
              @scope-defined="$emit('scope-defined', $event)"
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
import { ref } from 'vue';

import KnowledgeGapPanel from '@/components/organisms/KnowledgeGapPanel.vue';
import ReferencePanel from '@/components/organisms/ReferencePanel.vue';
import ScopeSelector from '@/components/organisms/ScopeSelector.vue';
import SearchPageContent from '@/components/organisms/SearchPageContent.vue';
import TaskCard from '@/components/organisms/TaskCard.vue';
import type { ScopeData, SearchResult, WorkflowStep } from '@/interfaces/search';

// --- Local UI State ---
// This state controls the internal layout of the template
const isPanelVisible = ref(true);

// --- Props (All workflow data is passed down from the store/container) ---
const props = defineProps<{
  // Authentication State (isLoggedIn prop is removed, AppLayout handles it)

  // Workflow State Data
  currentStep: WorkflowStep;
  searchQuery: string;
  searchResults: SearchResult[];
  scopeData: ScopeData | null;
  isLoading: boolean;
}>();


// --- Events (Actions emitted up to the parent container/store) ---
const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'lock-data'): void;
  (e: 'scope-defined', data: ScopeData): void;
}>();

// --- Methods (Internal handlers for component events) ---

// Handle search event from SearchPageContent
const handleSearch = (query: string) => {
  emit('search', query);
};
</script>