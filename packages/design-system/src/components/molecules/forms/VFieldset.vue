<template>
  <VBox
    tag="fieldset"
    surface="subtle"
    border="all"
    rounded="lg"
    :padding="padding"
    class="v-fieldset shadow-sm"
  >
    <VStack gap="md">
      <VStack v-if="title || description" gap="xs" tag="legend" class="px-1">
        <VTypography
          v-if="title"
          tag="h3"
          size="sm"
          weight="bold"
          variant="outline"
          class="uppercase tracking-wider"
        >
          {{ title }}
        </VTypography>

        <VTypography
          v-if="description"
          size="xs"
          variant="tertiary"
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
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import type { SpacingToken } from '@auraflux/design-system/interfaces/theme';

export interface VFieldsetProps {
  /** The primary heading for this configuration group */
  title?: string;
  padding?: SpacingToken;
  /** Optional sub-text to guide the user on how to configure these fields */
  description?: string;
};

const props = withDefaults(defineProps<VFieldsetProps>(), {
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