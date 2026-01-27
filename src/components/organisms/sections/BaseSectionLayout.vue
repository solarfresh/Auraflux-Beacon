<template>
  <section class="flex flex-col gap-5">
    <header class="flex items-center justify-between">
      <VTypography tag="h3" size="lg" weight="bold" color="slate-900">
        {{ title }}
      </VTypography>
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
import VTypography from '@/components/atoms/indicators/VTypography.vue';

defineProps<{
  title: string;
}>();
</script>