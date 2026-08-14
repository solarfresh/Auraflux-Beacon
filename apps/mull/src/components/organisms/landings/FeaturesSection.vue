<template>
  <VBox
    tag="section"
    padding="xl"
    border="y"
    class="bg-white border-slate-100"
  >
    <VBox class="max-w-7xl mx-auto px-6">
      <VStack gap="xl">

        <!-- Section Header -->
        <VStack align="center" gap="xs" class="text-center max-w-2xl mx-auto">
          <VBadge attention="secondary" intent="brand" size="sm" class="uppercase tracking-widest">
            MVP Highlight
          </VBadge>
          <VTypography
            tag="h2"
            size="lg"
            weight="bold"
            class="text-3xl text-slate-900"
          >
            Solve Immediate Pain Points with a Catchy, Memorable, and Intuitive Experience
          </VTypography>
        </VStack>

        <!-- Feature Cards Grid -->
        <div class="grid md:grid-cols-3 gap-8">

          <!-- Card 1 -->
          <VCard padding="lg" rounded="xl" :hoverable="true" class="bg-slate-50/60">
            <VStack gap="sm">
              <VSectionHeader
                title="Conflict Alignment Card"
                icon="Target"
                size="lg"
                title-tag="h3"
                class="text-sky-600"
              />
              <VBadge attention="secondary" intent="brand" size="xs" class="w-fit">
                At-a-Glance Clarity
              </VBadge>
              <VTypography
                tag="p"
                size="sm"
                weight="semibold"
                class="text-sky-700"
              >
                "Stop arguing, start looking: Find conflicts in 3s, align consensus in 3s."
              </VTypography>
              <VTypography
                tag="p"
                size="sm"
                weight="normal"
                class="text-slate-600 leading-relaxed"
              >
                When teams get stuck in endless debates, the system extracts underlying logical contradictions within 3 seconds, launching a minimalist conflict card to instantly align everyone on the same page.
              </VTypography>
            </VStack>
          </VCard>

          <!-- Card 2 -->
          <VCard padding="lg" rounded="xl" :hoverable="true" class="bg-slate-50/60">
            <VStack gap="sm">
              <VSectionHeader
                title="Inflection Dashboard"
                icon="ChartBar"
                size="lg"
                title-tag="h3"
                class="text-amber-600"
              />
              <VBadge attention="secondary" intent="warning" size="xs" class="w-fit">
                Interactive Drag & Predict
              </VBadge>
              <VTypography
                tag="p"
                size="sm"
                weight="semibold"
                class="text-amber-700"
              >
                "Drag variables live, trigger risk alerts: See the limits before blind sprinting."
              </VTypography>
              <VTypography
                tag="p"
                size="sm"
                weight="normal"
                class="text-slate-600 leading-relaxed"
              >
                An intuitive Green/Yellow/Red tolerance dashboard lets you adjust resources and market variables on the fly, triggering instant alerts for non-linear inflection points to prevent catastrophic system collapse.
              </VTypography>
            </VStack>
          </VCard>

          <!-- Card 3 -->
          <VCard padding="lg" rounded="xl" :hoverable="true" class="bg-slate-50/60">
            <VStack gap="sm">
              <VSectionHeader
                title="Orthogonal Strategy Canvas"
                icon="Scale"
                size="lg"
                title-tag="h3"
                class="text-purple-600"
              />
              <VBadge attention="secondary" intent="brand" size="xs" class="w-fit">
                Side-by-Side Objectivity
              </VBadge>
              <VTypography
                tag="p"
                size="sm"
                weight="semibold"
                class="text-purple-700"
              >
                "Line up options, expose empty claims: Decide with data, not gut feelings."
              </VTypography>
              <VTypography
                tag="p"
                size="sm"
                weight="normal"
                class="text-slate-600 leading-relaxed"
              >
                Unfold 2–3 distinct strategic concepts side-by-side with interlinked variable warnings that block unrealistic proposals, replacing subjective pitch decks with an objective matrix.
              </VTypography>
            </VStack>
          </VCard>

        </div>

      </VStack>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
</script>