<template>
  <div class="h-screen overflow-y-auto bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <Text tag="h1" size="5xl" weight="bold" color="gray-800" class="tracking-tight mb-2">
          AI Interactive Search
        </Text>
        <Text tag="p" size="lg" color="gray-600">
          Search for a topic, and we'll build a personalized indication for you.
        </Text>
      </div>

      <div class="max-w-3xl mx-auto mb-10">
        <slot name="search-form"></slot>
      </div>

      <div class="lg:grid lg:grid-cols-3 lg:gap-12">
        <div class="lg:col-span-2">
          <slot name="search-results"></slot>
        </div>
        <div class="lg:col-span-1 mt-12 lg:mt-0">
          <slot name="assistant-panel"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
</script>