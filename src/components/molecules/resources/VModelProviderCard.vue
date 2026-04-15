<template>
  <VBox
    tag="div"
    padding="md"
    rounded="lg"
    background="white"
    :clickable="true"
    :border="provider.status === 'ERROR' ? 'dashed' : 'all'"
    :class="[
      'v-provider-card transition-all duration-200 border-slate-200/60 flex flex-col gap-4',
      provider.status === 'ERROR' ? 'hover:border-rose-300' : 'hover:border-indigo-300',
      'shadow-sm hover:shadow-md'
    ]"
  >
    <VCluster justify="between" align="start">
      <VCluster gap="sm" align="center">
        <VBox
          padding="xs"
          rounded="md"
          :background="provider.status === 'ERROR' ? 'rose-50' : 'slate-50'"
          class="shrink-0 border border-slate-100"
        >
          <VIcon
            :name="getProviderIcon(provider.type)"
            size="sm"
            :class="provider.status === 'ERROR' ? 'text-rose-600' : 'text-slate-600'"
          />
        </VBox>
        <VStack gap="none">
          <VTypography weight="bold" size="base" color="slate-900">
            {{ provider.name }}
          </VTypography>
          <VTypography size="xs" color="slate-400" class="font-mono uppercase tracking-tighter">
            {{ provider.type }}
          </VTypography>
        </VStack>
      </VCluster>

      <VBox
        width="2"
        height="2"
        rounded="full"
        :background="statusColorMap[provider.status] as BackgroundToken"
        :class="[
          'shrink-0 mt-1.5',
          provider.status === 'ACTIVE' ? 'animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]' : ''
        ]"
      />
    </VCluster>

    <VStack gap="xs" class="bg-slate-50/50 p-2 rounded border border-slate-100/50">
      <VCluster justify="between" align="center">
        <VTypography size="xs" color="slate-400" weight="medium">API Key Fingerprint</VTypography>
        <VTypography size="xs" color="slate-600" class="font-mono tracking-widest">
          {{ provider.apiKeyFingerprint }}
        </VTypography>
      </VCluster>
      <VCluster v-if="provider.latencyMs" justify="between" align="center">
        <VTypography size="xs" color="slate-400" weight="medium">Last Latency</VTypography>
        <VTypography size="xs" color="emerald-600" class="font-mono">
          {{ provider.latencyMs }}ms
        </VTypography>
      </VCluster>
    </VStack>

    <VCluster gap="xs" align="center">
      <VBox
        tag="span"
        background="indigo-50"
        class="px-2 py-0.5 rounded text-[10px] font-bold text-indigo-600 border border-indigo-100"
      >
        {{ provider.activeAgentCount }} AGENTS
      </VBox>

      <VBox
        v-for="family in provider.supportedFamilies.slice(0, 2)"
        :key="family.id"
        tag="span"
        background="slate-50"
        class="px-2 py-0.5 rounded text-[10px] font-medium text-slate-500 uppercase"
      >
        {{ family.displayName }}
      </VBox>

      <VTypography v-if="provider.supportedFamilies.length > 2" size="xs" color="slate-300">
        +{{ provider.supportedFamilies.length - 2 }}
      </VTypography>

      <VBox class="grow" />

      <VTypography size="xs" color="slate-300" class="italic">
        {{ formatTime(provider.lastVerifiedAt) }}
      </VTypography>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VModelProviderCard Molecule
 * Responsibility: Visualizing infrastructure health, API security state, and provider load.
 */
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import type { ModelProvider, ProviderType } from '@/interfaces/agents';
import type { ConnectStatus } from '@/interfaces/core';
import type { BackgroundToken } from '@/interfaces/layout';

defineProps<{
  provider: ModelProvider;
}>();

const statusColorMap: Record<ConnectStatus, string> = {
  IDLE: '',
  ACTIVE: 'emerald-50',
  ERROR: 'rose-50',
  UNVERIFIED: 'amber-50',
  RATE_LIMITED: 'orange-50'
};

const getProviderIcon = (type: ProviderType) => {
  switch (type) {
    case 'GOOGLE': return 'Sparkles';
    case 'OPENAI': return 'Bolt';
    case 'LOCAL': return 'CommandLine';
    default: return 'CpuChip';
  }
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<style scoped>
.v-provider-card {
  /* Enhance technical feel with subtle mono adjustments */
  font-feature-settings: "tnum" on, "lnum" on;
}
</style>