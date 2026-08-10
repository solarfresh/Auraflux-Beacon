<template>
  <VBox
    border="top"
    padding="none"
    intent="neutral"
    surface="solid"
    class="w-full pt-3 mt-1 border-dashed"
  >
    <VStack gap="xs" align="stretch">
      <!-- Location breadcrumb header -->
      <VCluster align="center" gap="xs">
        <VIcon
          name="DocumentMagnifyingGlass"
          size="xs"
          type="outline"
        />
        <VTypography
          tag="span"
          size="xs"
          weight="semibold"
          class="uppercase tracking-wider"
        >
          EVIDENCE {{ location ? `— ${location}` : '' }}
        </VTypography>
      </VCluster>

      <!-- Source citation excerpt (serif and italic formatting for grounding effect) -->
      <VBox
        border="left"
        padding="none"
        intent="neutral"
        surface="solid"
        class="pl-3 border-l-2 my-1"
      >
        <VTypography
          tag="blockquote"
          size="xs"
          weight="normal"
          class="font-serif italic leading-relaxed wrap-break-words"
        >
          <slot>
            “{{ text }}”
          </slot>
        </VTypography>
      </VBox>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VEvidenceBlock Molecule
 * Renders Layer 4 (Fact & Evidence) of a ChunkCard.
 * Features location breadcrumbs (Page/Section) and serif italic blockquote for source evidence.
 * Fully refactored using VBox, VStack, VCluster, VTypography, and VIcon.
 */
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';

export interface VEvidenceBlockProps {
  /** Page or Section location reference (e.g. "Page 5, Section 3.2") */
  location?: string;
  /** Exact citation/evidence string from source document */
  text?: string;
}

withDefaults(defineProps<VEvidenceBlockProps>(), {
  location: '',
  text: '',
});
</script>