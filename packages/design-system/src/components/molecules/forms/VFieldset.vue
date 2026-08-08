<template>
  <VBox
    tag="fieldset"
    intent="neutral"
    surface="outline"
    border="all"
    rounded="lg"
    :padding="padding"
    class="v-fieldset shadow-sm"
  >
    <!-- HTML Native <legend> must be a direct child of <fieldset> -->
    <legend v-if="title || description" class="w-full float-left mb-3 px-1">
      <VStack gap="xs">
        <VTypography
          v-if="title"
          tag="h3"
          size="sm"
          weight="bold"
        >
          {{ title }}
        </VTypography>

        <VTypography
          v-if="description"
          size="xs"
          intent="neutral"
          class="leading-relaxed"
        >
          {{ description }}
        </VTypography>
      </VStack>
    </legend>

    <!-- Fieldset Form Controls Slot -->
    <VStack gap="md" class="w-full">
      <slot />
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
  /** Inner padding for the fieldset container */
  padding?: SpacingToken;
  /** Optional sub-text to guide the user on how to configure these fields */
  description?: string;
}

withDefaults(defineProps<VFieldsetProps>(), {
  padding: 'md',
});
</script>

<style scoped>
fieldset {
  display: block;
  min-inline-size: auto;
}

legend {
  display: block;
  padding: 0;
}
</style>