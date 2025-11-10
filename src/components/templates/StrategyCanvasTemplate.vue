<template>
  <div class="strategy-canvas-layout relative min-h-screen pt-16">
    <HeaderToolbar :current-step="currentStep" class="fixed top-0 left-0 right-0 z-20" />

    <main class="max-w-6xl mx-auto px-4 py-8 space-y-8">

      <TaskCard
        title="1. Search & Data Lock (Knowledge Base Setup)"
        :step-id="'SEARCH'"
        :current-step="currentStep"
        :is-complete="currentStep !== 'SEARCH'"
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
          Knowledge Base Locked: {{ props.searchResults?.length }} sources for "{{ searchQuery }}".
        </div>
      </TaskCard>

      <TaskCard
        title="2. Define Scope & Tension"
        :step-id="'SCOPE'"
        :current-step="currentStep"
        :is-complete="currentStep === 'COLLECTION' || currentStep === 'ANALYSIS' || currentStep === 'OUTPUT'"
      >
        <ScopeSelector v-if="currentStep === 'SCOPE'" @scope-defined="handleScopeDefined" />
        <div v-else class="text-gray-600">
          Scope Status: {{ currentStep === 'SEARCH' ? 'Pending' : 'Defined.' }}
        </div>
      </TaskCard>

      </main>

    <KnowledgeGapPanel v-if="currentStep !== 'SEARCH'" class="fixed bottom-0 right-0 z-20" />
  </div>
</template>

<script setup lang="ts">
// Interfaces and component imports go here (e.g., TaskCard, HeaderToolbar, etc.)
import HeaderToolbar from '@/components/molecules/HeaderToolbar.vue';
import KnowledgeGapPanel from '@/components/organisms/KnowledgeGapPanel.vue';
import ScopeSelector from '@/components/organisms/ScopeSelector.vue';
import SearchPageContent from '@/components/organisms/SearchPageContent.vue';
import TaskCard from '@/components/organisms/TaskCard.vue';
import type { SearchResult, WorkflowStep } from '@/interfaces/search';

// Props and methods from the main App component will be passed down.
const props = defineProps<{
  currentStep: WorkflowStep;
  searchQuery: string;
  searchResults: SearchResult[];
  isLoading?: boolean;
  handleSearch?: (...args: any[]) => any;
  handleLockData: (...args: any[]) => any;
  // Other handlers for future steps
}>();

const handleScopeDefined = () => {}
</script>