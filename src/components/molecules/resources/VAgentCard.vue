<template>
  <VBox
    tag="div"
    padding="md"
    rounded="lg"
    background="white"
    :clickable="true"
    border="all"
    :class="[
      'v-agent-card transition-all duration-200 border-slate-200/60 flex flex-col gap-4',
      'hover:border-indigo-300 shadow-sm'
    ]"
  >
    <VCluster justify="between" align="center">
      <VCluster gap="sm" align="center">
        <VBox
          padding="xs"
          rounded="md"
          background="indigo-50"
          class="shrink-0"
        >
          <VIcon
            name="CpuChip"
            size="sm"
            class="text-indigo-600"
          />
        </VBox>
        <VTypography weight="bold" size="base" color="slate-900">
          {{ agent.name }}
        </VTypography>
      </VCluster>

      <VBox
        width="2"
        height="2"
        rounded="full"
        background="emerald-50"
        class="shrink-0"
      />
    </VCluster>

    <VStack gap="xs">
      <VTypography
        size="sm"
        color="slate-400"
        class="line-clamp-2 min-h-10"
      >
        {{ agent.systemPrompt }}
      </VTypography>
    </VStack>

    <VCluster gap="xs" align="center">
      <VBox
        tag="span"
        background="slate-50"
        class="px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-100"
      >
        {{ agent.role }}
      </VBox>

      <VBox
        tag="span"
        class="px-2 py-0.5 rounded text-[10px] font-medium text-indigo-500 bg-indigo-50/50"
      >
        {{ agent.llmParameters.model }}
      </VBox>

      <VBox class="grow" />
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VAgentCard Molecule
 * * Entity: Agent (TwinRAD / Multi-agent system)
 * Responsibility: Visualizing agent capabilities, model backbone, and active status.
 */
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import type { Agent } from '@/interfaces/agents';

defineProps<{
  agent: Agent;
}>();
</script>

<style scoped>
.v-agent-card {
  /* Ensure text-rendering optimization for prompt snippets */
  -webkit-font-smoothing: antialiased;
}
</style>