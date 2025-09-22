<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <Text tag="h1" size="5xl" weight="bold" color="gray-800" class="tracking-tight mb-2">
          Knowledge Graph Search
        </Text>
        <Text tag="p" size="lg" color="gray-600">
          Search for a topic, and we'll build a personalized knowledge graph for you.
        </Text>
      </div>

      <div class="max-w-3xl mx-auto mb-10">
        <slot name="search-form"></slot>
      </div>

      <div class="mt-12">
        <slot name="search-results"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
</script>