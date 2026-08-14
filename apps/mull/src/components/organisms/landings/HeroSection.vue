<template>
  <VBox
    tag="section"
    padding="xl"
    class="relative pt-8 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-slate-50/50"
  >
    <VBox class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.12),rgba(255,255,255,0))]" />

    <VStack align="center" gap="lg" class="max-w-5xl mx-auto px-6 text-center relative z-10">
      <!-- Main Heading & Subtitle Container -->
      <VStack align="center" gap="md">
        <VTypography
          tag="h1"
          weight="extrabold"
          class="text-4xl md:text-6xl text-slate-900 tracking-tight leading-tight"
        >
          Stop Making Strategic Decisions on "Gut Feeling"!<br>
        </VTypography>

        <VTypography
          tag="h2"
          weight="bold"
          class="text-xl md:text-2xl bg-clip-text text-transparent bg-linear-to-r from-sky-600 via-indigo-600 to-purple-600"
        >
          Spot Blind Spots, Conflicts, and Collapse Boundaries at a Glance
        </VTypography>

        <VTypography
          tag="p"
          size="lg"
          weight="normal"
          class="text-slate-600 max-w-3xl mx-auto"
        >
          A cognitive decision-making sandbox crafted specifically for executives and strategy teams. Eliminate unproductive meetings with an intuitive Canvas that resolves conflicts in 3 seconds and warns of critical decision inflection points in real time.
        </VTypography>
      </VStack>

      <!-- Action Buttons -->
      <VCluster justify="center" align="center" gap="md" wrap class="w-full sm:w-auto">
        <VButton
          attention="primary"
          intent="brand"
          size="lg"
          icon-name="ArrowRight"
          class="w-full sm:w-auto shadow-lg shadow-sky-600/20"
        >
          Book Demo Now
        </VButton>

        <VButton
          attention="secondary"
          size="lg"
          class="w-full sm:w-auto"
        >
          Explore MVP Highlights
        </VButton>
      </VCluster>

    </VStack>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
</script>