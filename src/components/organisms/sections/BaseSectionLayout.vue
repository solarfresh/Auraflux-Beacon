<template>
  <section class="flex flex-col gap-5">
    <header class="flex items-center justify-between">
      <Text tag="h3" size="lg" weight="bold" color="gray-900">
        {{ title }}
      </Text>
      <slot name="header-actions"></slot>
    </header>

    <div v-if="$slots.stats" class="flex items-center gap-3">
      <slot name="stats"></slot>
    </div>

    <div class="flex flex-col gap-6">
      <slot name="content"></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/data-display/Text.vue';

defineProps<{
  title: string;
}>();
</script>