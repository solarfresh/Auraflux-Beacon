<template>
  <VBox
    tag="fieldset"
    background="white"
    border="all"
    rounded="lg"
    :padding="padding"
    class="v-fieldset border-slate-200/60 shadow-sm"
  >
    <VStack gap="md">
      <VStack v-if="title || description" gap="xs" tag="legend" class="px-1">
        <VTypography
          v-if="title"
          tag="h3"
          size="sm"
          weight="bold"
          color="slate-900"
          class="uppercase tracking-wider"
        >
          {{ title }}
        </VTypography>

        <VTypography
          v-if="description"
          size="xs"
          color="slate-500"
          class="leading-relaxed"
        >
          {{ description }}
        </VTypography>
      </VStack>

      <VBox tag="div" class="w-full">
        <slot></slot>
      </VBox>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VFieldset Molecule
 * Responsibility: Physical grouping of related form fields with semantic titling.
 * Follows Auraflux Physicality Principle: Border + Shadow-sm + Internal Vertical Rhythm.
 */
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import type { SpacingToken } from '@/interfaces/layout';

const props = withDefaults(defineProps<{
  /** The primary heading for this configuration group */
  title?: string;
  padding?: SpacingToken;
  /** Optional sub-text to guide the user on how to configure these fields */
  description?: string;
}>(), {
  padding: 'md',
})
</script>

<style scoped>
fieldset {
  display: block;
  min-inline-size: auto;
}

legend {
  float: left;
  width: 100%;
}
</style>