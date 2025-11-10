<template>
  <div class="space-y-6">
    <SearchForm @search="$emit('search', $event)" :is-loading="isLoading" />

    <div v-if="searchResults.length > 0" class="mt-8">

      <Text tag="h3" size="xl" weight="semibold" color="gray-800" class="mb-4">
        Knowledge Base Preview: {{ searchResults.length }} Sources Found
      </Text>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <SearchResults :results="searchResults" />
      </div>

      <div class="flex justify-center mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Button
          variant="primary"
          size="lg"
          @click="$emit('lockData')"
          :disabled="isLoading || searchResults.length === 0"
        >
          <Icon name="lock-closed" type="solid" size="md" class="mr-2" color="white" />
          <Text tag="span" size="lg" weight="medium" color="white">
            Lock Data & Proceed to Step 2
          </Text>
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center p-12">
      <Text tag="p" size="lg" color="gray-500">Searching and preparing knowledge base...</Text>
      <Icon name="arrow-path" type="solid" size="2xl" color="blue-500" class="animate-spin mt-4" />
    </div>

    <div v-else-if="searchResults.length === 0 && searchQuery" class="text-center p-12 border border-dashed border-gray-300 rounded-lg">
      <Text tag="p" size="lg" color="gray-500">No results found for "{{ searchQuery }}". Please refine your query.</Text>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchForm from '@/components/molecules/SearchForm.vue';
import SearchResults from '@/components/organisms/SearchResults.vue'; // Renders the ResultCard list
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue'; // Used for all text styling

import { SearchResult } from '@/interfaces/search';

const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
  searchResults: {
    type: Array as () => SearchResult[],
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  // Removed assistant-related props
});

// Define custom events for communication back to the main app component
const emit = defineEmits(['search', 'lockData']);
</script>