<template>
  <StrategyCanvasTemplate
    :current-step="currentStep"
    :search-query="searchQuery"
    :search-results="searchResults"
    :is-loading="isLoading"
    :handle-search="handleSearch"
    :handle-lock-data="handleLockData"
    :related-topics="relatedTopics"
    :next-actions="nextActions"
    @update-step="currentStep = $event"
  />
</template>

<script setup lang="ts">
// Renaming and updating imports
import { apiService } from '@/api/apiService';
import StrategyCanvasTemplate from '@/components/templates/StrategyCanvasTemplate.vue';
import type { SearchResult, WorkflowStep } from '@/interfaces/search';
import { ref } from 'vue';

// State Management
const searchQuery = ref<string>('');
const searchResults = ref<SearchResult[]>([]);
const relatedTopics = ref<string[]>([]); // Retain existing data structure
const nextActions = ref<string[]>([]);   // Retain existing data structure
const isLoading = ref<boolean>(false);
const currentStep = ref<WorkflowStep>('SEARCH'); // Start at Step 1

const handleSearch = async (query: string) => {
  searchQuery.value = query;
  isLoading.value = true;

  console.log(`Searching for: ${query}`);

  const searchResponse = await apiService.search.results.create(query);
  searchResults.value = searchResponse.data;

  isLoading.value = false;
};

const handleLockData = () => {
  if (searchResults.value.length > 0) {
    currentStep.value = 'SCOPE'; // Transition to Step 2
    console.log("Data Locked. Transitioning to Step 2.");
  }
};
</script>