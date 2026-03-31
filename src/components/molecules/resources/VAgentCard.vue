<template>
  <VBox
    tag="div"
    padding="md"
    rounded="lg"
    background="white"
    :clickable="true"
    :border="agent.status === 'USER_DRAFT' ? 'dashed' : 'all'"
    :class="[
      'v-agent-card transition-all duration-200 border-slate-200/60 flex flex-col gap-4',
      agent.status === 'USER_DRAFT' ? 'bg-amber-50/30' : 'hover:border-indigo-300 shadow-sm'
    ]"
  >
    <VCluster justify="between" align="start">
      <VBox
        padding="xs"
        rounded="md"
        :background="agent.status === 'LOCKED' ? 'indigo-50' : 'slate-50'"
      >
        <VIcon
          name="CpuChip"
          size="sm"
          :class="agent.status === 'LOCKED' ? 'text-indigo-600' : 'text-slate-400'"
        />
      </VBox>

      <VBox
        width="2"
        height="2"
        rounded="full"
        :background="agent.status === 'LOCKED' ? 'emerald-50' : 'slate-50'"
        class="mt-1.5"
      />
    </VCluster>

    <VStack gap="xs">
      <VTypography weight="bold" size="base" color="slate-900">
        {{ agent.name }}
      </VTypography>

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

      <VTypography size="xs" color="slate-300" weight="medium">
        v{{ agent.version }}
      </VTypography>
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