<template>
  <a :href="result.url" target="_blank" rel="noopener noreferrer">
    <div
      class="rounded-lg p-6 bg-white border border-gray-200 transition-shadow duration-300 ease-in-out hover:shadow-lg hover:border-blue-400 min-h-full flex flex-col"
    >
      <div class="flex items-center text-sm font-medium text-gray-500 mb-2">
        <Icon name="link" type="solid" size="sm" color="gray-500" class="mr-1" />
        <Text tag="span" size="sm" color="gray-500">
          {{ result.source }}
        </Text>
      </div>

      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="mb-2 line-clamp-2">
        {{ result.title }}
      </Text>

      <Text tag="p" size="sm" color="gray-600" class="line-clamp-3">
        {{ result.snippet }}
      </Text>

      <div class="mt-4 pt-4 border-t border-gray-100 flex-grow" />

      <div class="flex justify-between items-center mt-auto">
        <Text tag="span" size="sm" color="gray-500" weight="medium">
          Visit Website
        </Text>
        <Icon name="arrow-long-right" type="solid" size="md" color="blue-500" />
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import { SearchResult } from '@/interfaces/search';

const props = defineProps({
  result: {
    type: Object as () => SearchResult,
    required: true,
  },
});
</script>