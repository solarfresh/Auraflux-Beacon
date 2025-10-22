<template>
  <SearchPageTemplate>
    <template #search-form>
      <SearchForm @search="handleSearch" />
    </template>

    <template #search-results>
      <SearchResults :results="searchResults" />
    </template>

    <template #assistant-panel>
      <AssistantPanel
        :query="searchQuery"
        :related-topics="relatedTopics"
        :next-actions="nextActions"
      />
    </template>
  </SearchPageTemplate>
</template>

<script setup lang="ts">
import SearchForm from '@/components/molecules/SearchForm.vue';
import AssistantPanel from '@/components/organisms/AssistantPanel.vue';
import SearchResults from '@/components/organisms/SearchResults.vue';
import SearchPageTemplate from '@/components/templates/SearchPageTemplate.vue';
import { SearchResult } from '@/interfaces/search';
import { ref } from 'vue';
import { apiService } from '@/api/apiService'

const searchQuery = ref<string>('');
const searchResults = ref<SearchResult[]>([]);
const relatedTopics = ref<string[]>([]);
const nextActions = ref<string[]>([]);

const mockAssistantData = {
  '創業': {
    related: ['Business Plan', 'Venture Capital', 'Marketing Strategy'],
    actions: [
      'Research different business models for your idea.',
      'Look for startup incubators in your area.',
      'Find government grants for new businesses.'
    ],
  },
  '幼兒成長': {
    related: ['Sensory Play', 'Child Psychology', 'Early Education'],
    actions: [
      'Find parenting workshops near you.',
      'Download our guide on developmental milestones.',
      'Connect with other parents in our community forums.'
    ],
  }
};

const handleSearch = async (query: string) => {
  searchQuery.value = query;
  console.log(`Searching for: ${query}`);

  const searchResponse = await apiService.search.results.create(query);
  searchResults.value = searchResponse.data;

  const assistantResponse = await apiService.search.assistant.create(query);
  relatedTopics.value = assistantResponse.data.related_topics;
  nextActions.value = assistantResponse.data.next_actions;
};
</script>