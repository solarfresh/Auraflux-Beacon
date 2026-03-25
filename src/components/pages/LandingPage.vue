<template>
  <VBox
    tag="main"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
    background="slate-50"
  >
    <VBox position="absolute" inset="0" z-index="0" class="opacity-20 pointer-events-none">
      <VStaticGraph v-if="isGraphLoaded" />
    </VBox>

    <VBox position="relative" z-index="10" class="w-full max-w-7xl px-16">

      <VStack gap="md" class="pt-6 mb-6">
        <VTypography tag="h1" size="4xl" weight="bold" color="slate-900">FROM CONFUSION TO ACTION.</VTypography>
        <VTypography tag="p" size="lg" weight="normal" color="slate-600">
          Navigate your knowledge flow: from defining ambiguity to structured decision-making.
        </VTypography>
      </VStack>

      <VCluster gap="xl" align="start" justify="between" class="w-full">

        <VStack gap="md" class="flex-[1.6] min-w-[500px]">
          <VISPStepCard
            label="DEFINE: CLARIFY ANXIETY"
            description="Acknowledge the initial ambiguity of a new challenge. Use this phase to identify known unknowns and set cognitive boundaries, transforming vague uncertainty into a structured problem space for exploration."
            icon="MagnifyingGlass"
          />
          <VISPStepCard
            label="CONNECT: MAP HIDDEN RELATIONS"
            description="Surface the underlying architecture of your information. By visualizing nodes and their dependencies, you can uncover non-obvious correlations and structural patterns that traditional linear searching often misses."
            icon="Share"
          />
          <VISPStepCard
            label="ACT: TRIGGER DECISION"
            description="Synthesize mapped insights into a logical trajectory. This final stage focuses on reducing cognitive load to trigger a confident, evidence-based decision, moving from raw data to purposeful execution."
            icon="Bolt"
          />
        </VStack>

        <VWelcomeGateway
          :greeting="greeting"
          :intents="intents"
          @launch="handleLaunch"
        />

      </VCluster>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VISPStepCard from '@/components/molecules/indicators/VISPStepCard.vue';
import VStaticGraph from '@/components/molecules/layout/VStaticGraph.vue';
import VWelcomeGateway from '@/components/molecules/navs/VWelcomeGateway.vue';
import type { IntentOption } from '@/interfaces/user';
import { onMounted, ref } from 'vue';

const greeting = ref<string>("Ready to map hidden relations?");
const intents = ref<IntentOption[]>([
  {
    id: 'exploratory',
    label: 'Exploratory',
    icon: 'MagnifyingGlass', // Focus: Clarifying the unknown
  },
  {
    id: 'structural',
    label: 'Structural',
    icon: 'RectangleGroup', // Focus: Organizing existing nodes
  },
  {
    id: 'decision',
    label: 'Decision-focused',
    icon: 'Bolt', // Focus: Triggering an actionable output
  },
  {
    id: 'evaluative',
    label: 'Critical Review',
    icon: 'ShieldCheck', // Focus: Red-teaming or validating logic
  }
]);

const isGraphLoaded = ref(false);

onMounted(() => {
  // Delay ensures the Functional Molecules are interactive first
  setTimeout(() => { isGraphLoaded.value = true; }, 400);
});

const handleLaunch = (intentId: string | null) => {
  if (!intentId) return;
  console.log(`Transitioning to workspace with intent: ${intentId}`);
};
</script>