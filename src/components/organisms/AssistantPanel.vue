<template>
  <div v-if="query" class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center justify-between mb-4">
      <Text tag="h3" size="xl" weight="semibold" color="gray-800">
        Your Knowledge Assistant
      </Text>
      <Icon name="sparkles" type="solid" size="md" color="blue-500" />
    </div>

    <div class="mb-6">
      <Text tag="p" size="sm" color="gray-600">
        Based on your search for "<span class="font-medium text-gray-800">{{ query }}</span>", here are some related concepts and next steps you can take.
      </Text>
    </div>

    <div class="mb-6">
      <Text tag="h4" size="lg" weight="semibold" color="gray-700" class="mb-2">
        Related Topics
      </Text>
      <div class="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" v-for="topic in relatedTopics" :key="topic">
          {{ topic }}
        </Button>
      </div>
    </div>

    <div class="mb-6">
      <Text tag="h4" size="lg" weight="semibold" color="gray-700" class="mb-2">
        Suggested Next Actions
      </Text>
      <ul class="space-y-3">
        <li v-for="(action, index) in nextActions" :key="index" class="flex items-start">
          <Icon name="arrow-long-right" type="solid" size="md" color="blue-500" class="mt-1" />
          <Text tag="p" size="sm" color="gray-600" class="ml-2 leading-tight">
            {{ action }}
          </Text>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';

const props = defineProps({
  query: {
    type: String,
    required: true,
  },
  relatedTopics: {
    type: Array as () => string[],
    default: () => [],
  },
  nextActions: {
    type: Array as () => string[],
    default: () => [],
  }
});
</script>