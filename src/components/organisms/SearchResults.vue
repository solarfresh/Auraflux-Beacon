<template>
  <div v-if="results.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <ResultCard
      v-for="(result, index) in results"
      :key="index"
      :result="result"
    />
  </div>

  <div v-else class="text-center py-10">
    <Text tag="p" size="lg" color="gray-500">
      Sorry, no results found for your search.
    </Text>
    <Text tag="p" size="sm" color="gray-400" class="mt-2">
      Please try a different search query.
    </Text>
  </div>
</template>

<script setup lang="ts">
import ResultCard from '@/components/molecules/ResultCard.vue';
import Text from '@/components/atoms/Text.vue';
import { SearchResult } from '@/interfaces/search';

const props = defineProps({
  results: {
    type: Array as () => SearchResult[],
    required: true,
  },
});
</script>