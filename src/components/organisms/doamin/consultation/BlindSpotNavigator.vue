<template>
  <VStack gap="xs" class="w-full px-0.5">
    <!-- Header: Status Indicator -->
    <VCluster justify="start" align="center" class="w-full min-h-6">
      <VTypography
        tag="span"
        size="xs"
        class="w-2 h-2 rounded-full transition-colors duration-300 shadow-sm bg-amber-500"
      />
    </VCluster>

    <!-- Consultation Gap: Hierarchical Governance Hub using VAlert -->
    <VAlert
      v-if="primaryGap"
      variant="warning"
      :border="true"
      padding="sm"
      class="w-full"
    >
      <VStack gap="xs">
        <VTypography size="xs" weight="bold" color="slate-800">
          {{ primaryGap.title }}
        </VTypography>

        <VTypography size="xs" color="slate-600" class="leading-relaxed">
          {{ primaryGap.description }}
        </VTypography>

        <VTypography
          v-if="primaryGap.consensus"
          size="xs"
          weight="medium"
          color="indigo-600"
          class="italic pt-0.5"
        >
          Consensus: {{ primaryGap.consensus }}
        </VTypography>
      </VStack>
    </VAlert>
  </VStack>
</template>

<script setup lang="ts">
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';

interface ConsultationGap {
  id: string;
  title: string;
  description: string;
  consensus?: string;
}

defineProps<{
  primaryGap?: ConsultationGap | null;
}>();
</script>