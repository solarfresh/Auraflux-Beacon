<template>
  <VBox
    padding="md"
    rounded="md"
    border="left"
    intent="brand"
    surface="soft"
    class="w-full"
  >
    <VStack gap="xs" align="stretch">
      <!-- Concept Section Tag -->
      <VTypography
        tag="span"
        size="xs"
        weight="bold"
        class="uppercase tracking-wider"
      >
        Abstract Concept
      </VTypography>

      <!-- Concept Title -->
      <VTypography
        v-if="title"
        tag="h5"
        size="sm"
        weight="bold"
      >
        {{ title }}
      </VTypography>

      <!-- Concept Description -->
      <VTypography
        tag="p"
        size="sm"
        weight="normal"
        class="leading-relaxed"
      >
        {{ description }}
      </VTypography>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VConceptBlock Molecule
 * Displays Layer 2 ChunkConcept (title and description).
 */
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

export interface VConceptBlockProps {
  /** High-level proposition title */
  title?: string;
  /** Contextual description */
  description: string;
}

defineProps<VConceptBlockProps>();
</script>